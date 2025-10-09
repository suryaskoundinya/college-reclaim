import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { Category, ItemStatus } from '@prisma/client'

const foundItemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.enum(['BOOK', 'ELECTRONICS', 'ID_CARD', 'ACCESSORIES', 'CLOTHING', 'KEYS', 'BAGS', 'SPORTS', 'OTHER']),
  location: z.string().min(1, 'Location is required'),
  dateFound: z.string().datetime('Invalid date format'),
  handedToAdmin: z.boolean().default(false),
  imageUrl: z.string().url().optional(),
})

// GET /api/found-items - Get all found items with filtering
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category') as Category | null
    const search = searchParams.get('search')
    const status = searchParams.get('status') as ItemStatus | null
    const handedToAdmin = searchParams.get('handedToAdmin')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (category) where.category = category
    if (status) where.status = status
    if (handedToAdmin !== null) where.handedToAdmin = handedToAdmin === 'true'
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [items, total] = await Promise.all([
      prisma.foundItem.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              college: true,
            }
          }
        }
      }),
      prisma.foundItem.count({ where })
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
    console.error('Get found items error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/found-items - Create a new found item
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
    const validatedData = foundItemSchema.parse(body)

    const foundItem = await prisma.foundItem.create({
      data: {
        ...validatedData,
        dateFound: new Date(validatedData.dateFound),
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
        title: 'Found item reported',
        message: `Your found item "${foundItem.title}" has been reported successfully.`,
        type: 'INFO',
        userId: session.user.id,
      }
    })

    // Find potential matches with lost items
    const potentialMatches = await prisma.lostItem.findMany({
      where: {
        category: foundItem.category,
        status: 'LOST',
        NOT: {
          userId: session.user.id // Exclude own items
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    })

    // Create match records and notifications
    for (const lostItem of potentialMatches) {
      await prisma.match.create({
        data: {
          lostItemId: lostItem.id,
          foundItemId: foundItem.id,
          userId: lostItem.userId,
          similarity: 0.8, // Basic matching - can be improved with ML
        }
      })

      // Notify the owner of the lost item
      await prisma.notification.create({
        data: {
          title: 'Potential match found!',
          message: `A found item matching your lost "${lostItem.title}" has been reported. Check your matches!`,
          type: 'MATCH_FOUND',
          userId: lostItem.userId,
        }
      })
    }

    return NextResponse.json({
      message: 'Found item created successfully',
      item: foundItem,
      potentialMatches: potentialMatches.length
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Create found item error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}