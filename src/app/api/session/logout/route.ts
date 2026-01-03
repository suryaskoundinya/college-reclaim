import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { sessionId } = await request.json()

    // Update the most recent session or the specified session
    if (sessionId) {
      await prisma.userSession.update({
        where: {
          id: sessionId,
        },
        data: {
          logoutAt: new Date(),
        },
      })
    } else {
      // Find the most recent session without a logout time
      const recentSession = await prisma.userSession.findFirst({
        where: {
          userId: session.user.id,
          logoutAt: null,
        },
        orderBy: {
          loginAt: 'desc',
        },
      })

      if (recentSession) {
        await prisma.userSession.update({
          where: {
            id: recentSession.id,
          },
          data: {
            logoutAt: new Date(),
          },
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking logout:', error)
    return NextResponse.json(
      { error: 'Failed to track logout' },
      { status: 500 }
    )
  }
}
