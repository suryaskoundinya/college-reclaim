import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { Category, ItemStatus } from '@prisma/client'

const lostItemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.enum(['BOOK', 'ELECTRONICS', 'ID_CARD', 'ACCESSORIES', 'CLOTHING', 'KEYS', 'BAGS', 'SPORTS', 'OTHER']),
  location: z.string().min(1, 'Location is required'),
  dateLost: z.string().datetime('Invalid date format'),
  contactPhone: z.string().optional(),
  imageUrl: z.string().optional(),
})

// GET /api/lost-items - Get all lost items with filtering
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category') as Category | null
    const search = searchParams.get('search')
    const status = searchParams.get('status') as ItemStatus | null
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (category) where.category = category
    if (status) where.status = status
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [items, total] = await Promise.all([
      prisma.lostItem.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phoneNumber: true,
              college: true,
            }
          }
        }
      }),
      prisma.lostItem.count({ where })
    ])

    return NextResponse.json({
      items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get lost items error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/lost-items - Create a new lost item
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    console.log('Received body:', JSON.stringify(body, null, 2))
    
    const validatedData = lostItemSchema.parse(body)

    const lostItem = await prisma.lostItem.create({
      data: {
        ...validatedData,
        dateLost: new Date(validatedData.dateLost),
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            college: true,
          }
        }
      }
    })

    // Create notification for the user
    await prisma.notification.create({
      data: {
        title: 'Lost item reported',
        message: `Your lost item "${lostItem.title}" has been reported successfully.`,
        type: 'INFO',
        userId: session.user.id,
      }
    })

    return NextResponse.json({
      message: 'Lost item created successfully',
      item: lostItem
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', JSON.stringify(error.issues, null, 2))
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Create lost item error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}