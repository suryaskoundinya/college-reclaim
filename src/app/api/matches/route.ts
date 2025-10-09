import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { MatchStatus } from '@prisma/client'

const updateMatchSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'REJECTED'])
})

// GET /api/matches - Get user's matches
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') as MatchStatus | null
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {
      userId: session.user.id,
    }
    if (status) where.status = status

    const [matches, total] = await Promise.all([
      prisma.match.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          lostItem: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  college: true,
                  phoneNumber: true,
                }
              }
            }
          },
          foundItem: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  college: true,
                  phoneNumber: true,
                }
              }
            }
          },
        }
      }),
      prisma.match.count({ where })
    ])

    return NextResponse.json({
      matches,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get matches error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/matches - Create a manual match
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
    const { lostItemId, foundItemId } = body

    if (!lostItemId || !foundItemId) {
      return NextResponse.json(
        { error: 'Both lostItemId and foundItemId are required' },
        { status: 400 }
      )
    }

    // Verify the user owns the lost item
    const lostItem = await prisma.lostItem.findFirst({
      where: {
        id: lostItemId,
        userId: session.user.id
      }
    })

    if (!lostItem) {
      return NextResponse.json(
        { error: 'Lost item not found or you do not have permission' },
        { status: 404 }
      )
    }

    // Check if match already exists
    const existingMatch = await prisma.match.findFirst({
      where: {
        lostItemId,
        foundItemId
      }
    })

    if (existingMatch) {
      return NextResponse.json(
        { error: 'Match already exists' },
        { status: 400 }
      )
    }

    // Get the found item to notify its owner
    const foundItem = await prisma.foundItem.findUnique({
      where: { id: foundItemId },
      include: {
        user: true
      }
    })

    if (!foundItem) {
      return NextResponse.json(
        { error: 'Found item not found' },
        { status: 404 }
      )
    }

    // Create the match
    const match = await prisma.match.create({
      data: {
        lostItemId,
        foundItemId,
        userId: session.user.id,
        similarity: 1.0, // Manual match
      },
      include: {
        lostItem: true,
        foundItem: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                college: true,
              }
            }
          }
        }
      }
    })

    // Notify the owner of the found item
    await prisma.notification.create({
      data: {
        title: 'Item match request',
        message: `${session.user.name} believes their lost "${lostItem.title}" matches your found item "${foundItem.title}".`,
        type: 'MATCH_FOUND',
        userId: foundItem.userId,
      }
    })

    return NextResponse.json({
      message: 'Match created successfully',
      match
    }, { status: 201 })

  } catch (error) {
    console.error('Create match error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}