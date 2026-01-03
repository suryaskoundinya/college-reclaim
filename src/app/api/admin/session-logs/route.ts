import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Only allow admins to view session logs
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '50')
    const page = parseInt(searchParams.get('page') || '1')
    const skip = (page - 1) * limit

    // Build query filters
    const where = userId ? { userId } : {}

    // Fetch session logs
    const [sessions, total] = await Promise.all([
      prisma.userSession.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
        orderBy: {
          loginAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.userSession.count({ where }),
    ])

    // Calculate session durations
    const sessionsWithDuration = sessions.map(s => ({
      ...s,
      duration: s.logoutAt 
        ? Math.round((s.logoutAt.getTime() - s.loginAt.getTime()) / 1000 / 60) // minutes
        : null,
      isActive: !s.logoutAt,
    }))

    return NextResponse.json({
      sessions: sessionsWithDuration,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching session logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch session logs' },
      { status: 500 }
    )
  }
}
