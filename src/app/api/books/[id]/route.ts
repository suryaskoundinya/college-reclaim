import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schema for book update
const BookUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  author: z.string().min(1).max(100).optional(),
  description: z.string().min(1).max(1000).optional(),
  condition: z.enum(['NEW', 'LIKE_NEW', 'GOOD', 'FAIR', 'POOR']).optional(),
  priceOrRent: z.number().min(0).max(10000).optional(),
  type: z.enum(['RENT', 'SELL']).optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  available: z.boolean().optional()
})

// GET /api/books/[id] - Get book details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            college: true,
            role: true
          }
        },
        requests: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
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

    return NextResponse.json(book)

  } catch (error) {
    console.error('Error fetching book:', error)
    return NextResponse.json(
      { error: 'Failed to fetch book details' },
      { status: 500 }
    )
  }
}

// PUT /api/books/[id] - Update book (owner only)
export async function PUT(
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

    // Check if book exists and user is owner
    const existingBook = await prisma.book.findUnique({
      where: { id },
      select: { ownerUserId: true }
    })

    if (!existingBook) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      )
    }

    if (existingBook.ownerUserId !== session.user.id) {
      return NextResponse.json(
        { error: 'You can only edit your own books' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = BookUpdateSchema.parse(body)

    const updatedBook = await prisma.book.update({
      where: { id },
      data: validatedData,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            college: true
          }
        }
      }
    })

    return NextResponse.json(updatedBook)

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error updating book:', error)
    return NextResponse.json(
      { error: 'Failed to update book' },
      { status: 500 }
    )
  }
}

// DELETE /api/books/[id] - Delete book (owner only)
export async function DELETE(
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

    // Check if book exists and user is owner
    const existingBook = await prisma.book.findUnique({
      where: { id },
      select: { ownerUserId: true, title: true }
    })

    if (!existingBook) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      )
    }

    if (existingBook.ownerUserId !== session.user.id) {
      return NextResponse.json(
        { error: 'You can only delete your own books' },
        { status: 403 }
      )
    }

    await prisma.book.delete({
      where: { id }
    })

    // Create notification for successful deletion
    await prisma.notification.create({
      data: {
        title: 'Book Listing Removed',
        message: `Your book "${existingBook.title}" has been removed from the marketplace.`,
        type: 'INFO',
        userId: session.user.id
      }
    })

    return NextResponse.json({ message: 'Book deleted successfully' })

  } catch (error) {
    console.error('Error deleting book:', error)
    return NextResponse.json(
      { error: 'Failed to delete book' },
      { status: 500 }
    )
  }
}