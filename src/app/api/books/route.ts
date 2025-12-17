import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schema for book creation/update
const BookSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  author: z.string().min(1, 'Author is required').max(100, 'Author name too long'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description too long'),
  condition: z.enum(['NEW', 'LIKE_NEW', 'GOOD', 'FAIR', 'POOR']),
  priceOrRent: z.number().min(0, 'Price must be non-negative').max(10000, 'Price too high'),
  type: z.enum(['RENT', 'SELL']),
  imageUrl: z.string().url().optional().or(z.literal(''))
})

// GET /api/books - List all books with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const type = searchParams.get('type') || ''
    const condition = searchParams.get('condition') || ''
    const available = searchParams.get('available')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50)
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: any = {}

    // Apply filters
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (type && ['RENT', 'SELL'].includes(type)) {
      where.type = type
    }

    if (condition && ['NEW', 'LIKE_NEW', 'GOOD', 'FAIR', 'POOR'].includes(condition)) {
      where.condition = condition
    }

    if (available !== null) {
      where.available = available === 'true'
    }

    const [books, totalCount] = await Promise.all([
      prisma.book.findMany({
        where,
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              phoneNumber: true,
              college: true
            }
          },
          _count: {
            select: {
              requests: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: limit,
        skip: offset
      }),
      prisma.book.count({ where })
    ])

    return NextResponse.json({
      books,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    })

  } catch (error) {
    console.error('Error fetching books:', error)
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    )
  }
}

// POST /api/books - Create a new book listing
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = BookSchema.parse(body)

    const book = await prisma.book.create({
      data: {
        ...validatedData,
        ownerUserId: session.user.id
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            college: true
          }
        }
      }
    })

    // Create notification for successful book listing
    await prisma.notification.create({
      data: {
        title: 'Book Listed Successfully',
        message: `Your book "${book.title}" has been listed for ${book.type.toLowerCase()}.`,
        type: 'SUCCESS',
        userId: session.user.id
      }
    })

    return NextResponse.json(book, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error creating book:', error)
    return NextResponse.json(
      { error: 'Failed to create book listing' },
      { status: 500 }
    )
  }
}