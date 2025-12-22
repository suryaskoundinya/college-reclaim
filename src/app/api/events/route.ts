import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { CLUBS } from '@/data/clubs'
import { DEPARTMENTS } from '@/data/departments'

// Validation schema for event creation/update
const EventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(2000, 'Description too long'),
  date: z.string().pipe(z.coerce.date()),
  time: z.string().min(1, 'Time is required'),
  venue: z.string().min(1, 'Venue is required').max(200, 'Venue name too long'),
  clubOrDept: z.string().min(1, 'Club or Department is required'),
  contactInfo: z.string().max(200, 'Contact info too long').optional(),
  imageUrl: z.string().url().optional().or(z.literal(''))
})

// GET /api/events - List all events with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const clubOrDept = searchParams.get('clubOrDept') || ''
    const upcoming = searchParams.get('upcoming')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50)
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: any = {}

    // Apply filters
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { venue: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (clubOrDept) {
      where.clubOrDept = clubOrDept
    }

    if (upcoming === 'true') {
      where.date = {
        gte: new Date()
      }
    }

    const [events, totalCount] = await Promise.all([
      prisma.event.findMany({
        where,
        include: {
          postedBy: {
            select: {
              id: true,
              name: true,
              email: true,
              college: true,
              role: true
            }
          },
          _count: {
            select: {
              interested: true
            }
          }
        },
        orderBy: [
          {
            createdAt: 'desc'
          },
          {
            date: 'asc'
          }
        ],
        take: limit,
        skip: offset
      }),
      prisma.event.count({ where })
    ])

    return NextResponse.json({
      events,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    })

  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

// POST /api/events - Create a new event
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if user has permission to create events
    // Only COORDINATOR and ADMIN roles can create events
    if (session.user.role !== 'COORDINATOR' && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Only coordinators and admins can create events' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = EventSchema.parse(body)

    // Validate club or department
    const allClubsAndDepts = [...CLUBS, ...DEPARTMENTS]
    if (!allClubsAndDepts.includes(validatedData.clubOrDept as any)) {
      return NextResponse.json(
        { error: 'Invalid club or department' },
        { status: 400 }
      )
    }

    const event = await prisma.event.create({
      data: {
        ...validatedData,
        postedByUserId: session.user.id
      },
      include: {
        postedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            college: true,
            role: true
          }
        }
      }
    })

    // Create notification for successful event creation
    await prisma.notification.create({
      data: {
        title: 'Event Created Successfully',
        message: `Your event "${event.title}" has been posted and is now visible to all students.`,
        type: 'SUCCESS',
        userId: session.user.id
      }
    })

    return NextResponse.json(event, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error creating event:', error)
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    )
  }
}