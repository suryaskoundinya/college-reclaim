import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        postedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            department: true,
            coordinatorTitle: true,
            image: true
          }
        },
        _count: {
          select: {
            interested: true
          }
        }
      }
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ event })
  } catch (error) {
    console.error('Error fetching event:', error)
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await context.params
    const body = await request.json()
    const { title, description, date, time, venue, clubOrDept, contactInfo, imageUrl } = body

    // Check if event exists and user is the organizer
    const existingEvent = await prisma.event.findUnique({
      where: { id },
      select: { postedByUserId: true }
    })

    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Check if user is the creator or an admin
    const isCreator = existingEvent.postedByUserId === session.user.id
    const isAdmin = session.user.role === 'ADMIN'
    
    if (!isCreator && !isAdmin) {
      return NextResponse.json(
        { error: 'You do not have permission to edit this event' },
        { status: 403 }
      )
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title,
        description,
        date: new Date(date), // Convert string to DateTime
        time,
        venue,
        clubOrDept,
        contactInfo,
        imageUrl
      }
    })

    return NextResponse.json({ 
      message: 'Event updated successfully',
      event: updatedEvent 
    })
  } catch (error) {
    console.error('Error updating event:', error)
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await context.params

    // Check if event exists and user is the organizer
    const existingEvent = await prisma.event.findUnique({
      where: { id },
      select: { postedByUserId: true }
    })

    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Check if user is the creator or an admin
    const isCreator = existingEvent.postedByUserId === session.user.id
    const isAdmin = session.user.role === 'ADMIN'
    
    if (!isCreator && !isAdmin) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this event' },
        { status: 403 }
      )
    }

    await prisma.event.delete({
      where: { id }
    })

    return NextResponse.json({ 
      message: 'Event deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting event:', error)
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    )
  }
}
