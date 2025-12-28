"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Search, Plus } from "lucide-react"
import { mockBooks } from "@/data/mockData"
import { BookGridSkeleton } from "@/components/loading/book-skeletons"
import { BackButton } from "@/components/ui/back-button"

interface Book {
  id: string
  title: string
  author: string
  description: string
  condition: string
  priceOrRent: number
  type: string
  contactPhone?: string
  imageUrl?: string
  isAvailable: boolean
  createdAt: string
  owner: {
    id: string
    name: string
    email: string
    phoneNumber?: string
    image?: string
  }
  _count: {
    requests: number
  }
}

export default function BooksPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const [books, setBooks] = useState<Book[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("")

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const params = new URLSearchParams()
        if (typeFilter) params.append('type', typeFilter)
        
        const response = await fetch(`/api/books?${params.toString()}`)
        if (!response.ok) throw new Error('Failed to fetch books')
        
        const data = await response.json()
        setBooks(data.books || [])
      } catch (error) {
        console.error('Error fetching books:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchBooks()
  }, [typeFilter])

  const filteredBooks = books.filter(book => {
    const matchesSearch = searchQuery === "" || 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "" || book.type === typeFilter
    return matchesSearch && matchesType
  })

  const formatPrice = (price: number, type: string) => {
    return `₹${price}${type === 'RENT' ? '/month' : ''}`
  }

  if (loading) {
    return <BookGridSkeleton />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <div className="mb-4">
          <BackButton />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Book Marketplace
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Buy, sell, or rent textbooks with fellow students</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <Input
                placeholder="Search books by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100"
              />
            </div>
            <Select value={typeFilter || "all"} onValueChange={(value) => setTypeFilter(value === "all" ? "" : value)}>
              <SelectTrigger className="w-32 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="SELL">For Sale</SelectItem>
                <SelectItem value="RENT">For Rent</SelectItem>
              </SelectContent>
            </Select>
            {session && (
              <Link href="/books/new">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  List Book
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="h-12 w-12 text-blue-400 dark:text-blue-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">No books found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchQuery || typeFilter ? "Try adjusting your filters" : "Be the first to list a book!"}
            </p>
            {session && (
              <Link href="/books/new">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  List Your First Book
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                {/* Book Image/Icon */}
                <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center overflow-hidden">
                  {book.imageUrl ? (
                    <img 
                      src={book.imageUrl} 
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BookOpen className="h-16 w-16 text-blue-400 dark:text-blue-300" />
                  )}
                  <Badge className="absolute top-3 right-3 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200" variant={book.type === 'RENT' ? 'default' : 'secondary'}>
                    {book.type === 'RENT' ? 'For Rent' : 'For Sale'}
                  </Badge>
                  <div className="absolute top-3 left-3">
                    <div className={`w-3 h-3 rounded-full ${book.isAvailable ? 'bg-green-500' : 'bg-red-500'}`} />
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg line-clamp-2 text-gray-900 dark:text-gray-100">{book.title}</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">by {book.author}</p>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {book.description}
                  </p>
                  
                  <div className="space-y-3">
                    {/* Price */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-green-600 dark:text-green-400">
                          {formatPrice(book.priceOrRent, book.type)}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {book.type === 'RENT' ? 'Monthly' : 'One-time'}
                        </span>
                      </div>
                    </div>

                    {/* Condition Badge */}
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">{book.condition}</Badge>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {book.isAvailable ? 'Available' : 'Not Available'}
                      </span>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-2 pt-2">
                      <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Owner Contact:</div>
                      {book.owner.email && (
                        <a
                          href={`mailto:${book.owner.email}`}
                          className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors"
                        >
                          <span className="text-lg">📧</span>
                          <span className="truncate">{book.owner.email}</span>
                        </a>
                      )}
                      {(book.contactPhone || book.owner.phoneNumber) && (
                        <a
                          href={`tel:${book.contactPhone || book.owner.phoneNumber}`}
                          className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:underline transition-colors"
                        >
                          <span className="text-lg">📱</span>
                          <span>{book.contactPhone || book.owner.phoneNumber}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Footer Stats */}
        <div className="text-center mt-8 text-gray-600 dark:text-gray-400">
          <p>Showing {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} available in the marketplace</p>
        </div>
      </div>
    </div>
  )
}