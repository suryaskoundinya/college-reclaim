import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schema for book request
const BookRequestSchema = z.object({
  message: z.string().max(500, 'Message too long').optional()
})

// POST /api/books/[id]/request - Send borrow/buy request
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if book exists and is available
    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      )
    }

    if (!book.available) {
      return NextResponse.json(
        { error: 'Book is not available' },
        { status: 400 }
      )
    }

    if (book.ownerUserId === session.user.id) {
      return NextResponse.json(
        { error: 'You cannot request your own book' },
        { status: 400 }
      )
    }

    // Check if user has already requested this book
    const existingRequest = await prisma.bookRequest.findUnique({
      where: {
        bookId_userId: {
          bookId: id,
          userId: session.user.id
        }
      }
    })

    if (existingRequest) {
      return NextResponse.json(
        { error: 'You have already requested this book' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const validatedData = BookRequestSchema.parse(body)

    const bookRequest = await prisma.bookRequest.create({
      data: {
        bookId: id,
        userId: session.user.id,
        message: validatedData.message || ''
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        book: {
          select: {
            title: true,
            type: true
          }
        }
      }
    })

    // Create notification for book owner
    await prisma.notification.create({
      data: {
        title: `New ${book.type.toLowerCase()} request`,
        message: `${session.user.name || session.user.email} wants to ${book.type.toLowerCase()} your book "${book.title}".`,
        type: 'BOOK_REQUEST',
        userId: book.ownerUserId
      }
    })

    // Create notification for requester
    await prisma.notification.create({
      data: {
        title: 'Request sent successfully',
        message: `Your ${book.type.toLowerCase()} request for "${book.title}" has been sent to ${book.owner.name || book.owner.email}.`,
        type: 'SUCCESS',
        userId: session.user.id
      }
    })

    return NextResponse.json(bookRequest, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error creating book request:', error)
    return NextResponse.json(
      { error: 'Failed to send book request' },
      { status: 500 }
    )
  }
}

// GET /api/books/[id]/requests - Get all requests for a book (owner only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if user is book owner
    const book = await prisma.book.findUnique({
      where: { id },
      select: { ownerUserId: true }
    })

    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      )
    }

    if (book.ownerUserId !== session.user.id) {
      return NextResponse.json(
        { error: 'You can only view requests for your own books' },
        { status: 403 }
      )
    }

    const requests = await prisma.bookRequest.findMany({
      where: { bookId: id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            college: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(requests)

  } catch (error) {
    console.error('Error fetching book requests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch book requests' },
      { status: 500 }
    )
  }
}