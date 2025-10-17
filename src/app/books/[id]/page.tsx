"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, BookOpen, User, Calendar, DollarSign, MessageCircle, Edit3, Trash2, Heart, Share2 } from "lucide-react"
import { toast } from "sonner"
import { BookDetailSkeleton } from "@/components/loading/book-skeletons"

interface Book {
  id: string
  title: string
  author: string
  description: string
  condition: string
  priceOrRent: number
  type: string
  imageUrl?: string
  isAvailable: boolean
  createdAt: string
  updatedAt: string
  owner: {
    id: string
    name: string
    email: string
    image?: string
  }
  _count: {
    requests: number
  }
}

interface BookRequest {
  id: string
  message: string
  status: string
  createdAt: string
  requester: {
    id: string
    name: string
    email: string
    image?: string
  }
}

const CONDITION_COLORS = {
  NEW: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
  LIKE_NEW: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  GOOD: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  FAIR: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  POOR: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
}

const CONDITION_LABELS = {
  NEW: 'New',
  LIKE_NEW: 'Like New',
  GOOD: 'Good',
  FAIR: 'Fair',
  POOR: 'Poor'
}

export default function BookDetailsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const [book, setBook] = useState<Book | null>(null)
  const [requests, setRequests] = useState<BookRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [requestLoading, setRequestLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false)

  const bookId = params.id as string

  useEffect(() => {
    if (status === "loading") return
    
    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }

    fetchBook()
  }, [status, bookId])

  const fetchBook = async () => {
    try {
      const response = await fetch(`/api/books/${bookId}`)
      if (!response.ok) {
        if (response.status === 404) {
          router.push("/books")
          toast.error("Book not found")
          return
        }
        throw new Error('Failed to fetch book')
      }

      const data = await response.json()
      setBook(data.book)
      setRequests(data.requests || [])
    } catch (error) {
      console.error('Error fetching book:', error)
      toast.error("Failed to load book details")
    } finally {
      setLoading(false)
    }
  }

  const handleRequestBook = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message")
      return
    }

    setRequestLoading(true)
    try {
      const response = await fetch(`/api/books/${bookId}/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.trim() })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send request')
      }

      toast.success("Request sent successfully!", {
        description: "The book owner will be notified of your request."
      })
      
      setIsRequestDialogOpen(false)
      setMessage("")
      fetchBook() // Refresh to update request count
      
    } catch (error) {
      console.error('Error sending request:', error)
      toast.error(error instanceof Error ? error.message : "Failed to send request")
    } finally {
      setRequestLoading(false)
    }
  }

  const handleDeleteBook = async () => {
    if (!confirm("Are you sure you want to delete this book listing?")) return

    try {
      const response = await fetch(`/api/books/${bookId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete book')
      }

      toast.success("Book listing deleted successfully")
      router.push("/books")
      
    } catch (error) {
      console.error('Error deleting book:', error)
      toast.error("Failed to delete book listing")
    }
  }

  const handleShareBook = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: book?.title,
          text: `Check out this book: ${book?.title} by ${book?.author}`,
          url: window.location.href
        })
      } catch (error) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(window.location.href)
        toast.success("Link copied to clipboard!")
      }
    } else {
      await navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard!")
    }
  }

  if (status === "loading" || loading) {
    return <BookDetailSkeleton />
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Book not found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">The book you're looking for doesn't exist or has been removed.</p>
          <Link href="/books">
            <Button>Back to Books</Button>
          </Link>
        </div>
      </div>
    )
  }

  const isOwner = session?.user?.id === book.owner.id
  const hasRequested = requests.some(req => req.requester.id === session?.user?.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link href="/books" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Books
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Book Image */}
            {book.imageUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800"
              >
                <img
                  src={book.imageUrl}
                  alt={book.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
              </motion.div>
            )}

            {/* Book Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="shadow-xl border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-2xl font-bold mb-2">{book.title}</CardTitle>
                      <p className="text-lg text-gray-600 dark:text-gray-300 mb-3">by {book.author}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge className={CONDITION_COLORS[book.condition as keyof typeof CONDITION_COLORS] || 'bg-gray-100 text-gray-800'}>
                          {CONDITION_LABELS[book.condition as keyof typeof CONDITION_LABELS] || book.condition}
                        </Badge>
                        <Badge variant={book.type === 'RENT' ? 'secondary' : 'default'}>
                          {book.type === 'RENT' ? 'For Rent' : 'For Sale'}
                        </Badge>
                        <Badge variant={book.isAvailable ? 'default' : 'destructive'}>
                          {book.isAvailable ? 'Available' : 'Not Available'}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 text-2xl font-bold text-green-600 dark:text-green-400">
                        <DollarSign className="w-6 h-6" />
                        {book.priceOrRent}
                        <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">
                          {book.type === 'RENT' ? '/ month' : 'one-time'}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleShareBook}
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                      
                      {isOwner && (
                        <>
                          <Link href={`/books/${bookId}/edit`}>
                            <Button variant="outline" size="sm">
                              <Edit3 className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleDeleteBook}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Description</h3>
                      <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                        {book.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Listed {new Date(book.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {book._count.requests} request{book._count.requests !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Owner Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Book Owner</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={book.owner.image} />
                      <AvatarFallback>
                        {book.owner.name?.charAt(0) || <User className="w-6 h-6" />}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{book.owner.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{book.owner.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Action Button */}
            {!isOwner && book.isAvailable && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      disabled={hasRequested}
                    >
                      {hasRequested ? 'Request Sent' : `Request to ${book.type === 'RENT' ? 'Rent' : 'Buy'}`}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Request Book</DialogTitle>
                      <DialogDescription>
                        Send a message to the book owner expressing your interest in {book.type === 'RENT' ? 'renting' : 'buying'} this book.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          placeholder={`Hi! I'm interested in ${book.type === 'RENT' ? 'renting' : 'buying'} your book "${book.title}". When would be a good time to discuss the details?`}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          rows={4}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setIsRequestDialogOpen(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleRequestBook}
                          disabled={requestLoading}
                          className="flex-1"
                        >
                          {requestLoading ? "Sending..." : "Send Request"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </motion.div>
            )}

            {/* Owner's Requests Panel */}
            {isOwner && requests.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">Requests ({requests.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {requests.map((request) => (
                        <div key={request.id} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 pb-4 last:pb-0">
                          <div className="flex items-center gap-3 mb-2">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={request.requester.image} />
                              <AvatarFallback>
                                {request.requester.name?.charAt(0) || <User className="w-4 h-4" />}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{request.requester.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(request.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant={request.status === 'PENDING' ? 'secondary' : 'default'}>
                              {request.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {request.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}