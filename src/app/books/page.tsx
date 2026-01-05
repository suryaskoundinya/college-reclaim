"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Search, Plus, Sparkles } from "lucide-react"
import { mockBooks } from "@/data/mockData"
import { BackButton } from "@/components/ui/back-button"
import { AuthProtectedContact } from "@/components/ui/auth-protected-contact"
import { SendMessageButton } from "@/components/send-message-button"
import { HoverCard } from "@/components/ui/animated-card"
import { GridSkeletonLoader } from "@/components/ui/enhanced-skeletons"
import { PageTransition } from "@/components/ui/page-transition"
import { Navbar } from "@/components/navbar"
import { ClickableImage } from "@/components/ui/image-preview"

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
        setLoading(true)
        const params = new URLSearchParams()
        if (typeFilter) params.append('type', typeFilter)
        params.append('limit', '1000')
        
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-4">
            <BackButton />
          </div>
          <div className="text-center mb-8">
            <div className="h-12 w-64 mx-auto bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-4" />
            <div className="h-6 w-96 mx-auto bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          </div>
          <GridSkeletonLoader count={8} type="book" />
        </div>
      </div>
    )
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <Navbar />
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Back Button */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-4"
          >
            <BackButton />
          </motion.div>

          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 flex items-center justify-center gap-3">
              <Sparkles className="h-8 w-8 text-blue-600" />
              Book Marketplace
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Buy, sell, or rent textbooks with fellow students</p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50 mb-8"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <Input
                  placeholder="Search books by title or author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Select value={typeFilter || "all"} onValueChange={(value) => setTypeFilter(value === "all" ? "" : value)}>
                <SelectTrigger className="w-full sm:w-32 bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600">
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
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all">
                    <Plus className="w-4 h-4 mr-2" />
                    List Book
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>

          {/* Books Grid */}
          {filteredBooks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <BookOpen className="h-16 w-16 text-blue-400 dark:text-blue-300 mx-auto mb-4" />
              </motion.div>
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
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBooks.map((book, index) => (
                <HoverCard key={book.id} glowColor="blue" className="h-full">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    {/* Book Image/Icon - Clickable for full preview */}
                    <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center overflow-hidden">
                      {book.imageUrl ? (
                        <ClickableImage
                          src={book.imageUrl}
                          alt={book.title}
                          className="w-full h-full object-cover"
                          containerClassName="w-full h-full"
                        />
                      ) : (
                        <BookOpen className="h-16 w-16 text-blue-400 dark:text-blue-300 group-hover:scale-110 transition-transform duration-500" />
                      )}
                      <Badge className="absolute top-3 right-3 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 shadow-lg z-10 pointer-events-none" variant={book.type === 'RENT' ? 'default' : 'secondary'}>
                        {book.type === 'RENT' ? '📚 Rent' : '💰 Sale'}
                      </Badge>
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 + index * 0.05 }}
                        className="absolute top-3 left-3 z-10 pointer-events-none"
                      >
                        <div className={`w-3 h-3 rounded-full ${book.isAvailable ? 'bg-green-500' : 'bg-red-500'} shadow-lg`} />
                      </motion.div>
                    </div>
                    
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg break-words text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {book.title}
                      </CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">by {book.author}</p>
                    </CardHeader>

                    <CardContent>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 break-words whitespace-pre-wrap">
                        {book.description}
                      </p>
                      
                      <div className="space-y-3">
                        {/* Price */}
                        <motion.div 
                          whileHover={{ scale: 1.02 }}
                          className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg p-3 border border-green-200 dark:border-green-700/50"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-green-600 dark:text-green-400">
                              {formatPrice(book.priceOrRent, book.type)}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {book.type === 'RENT' ? 'Monthly' : 'One-time'}
                            </span>
                          </div>
                        </motion.div>

                        {/* Condition Badge */}
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                            {book.condition}
                          </Badge>
                        </div>

                        {/* Auth-Protected Contact Information */}
                        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                          <AuthProtectedContact
                            contactInfo={{
                              email: book.owner.email,
                              phone: book.contactPhone || book.owner.phoneNumber
                            }}
                            variant="inline"
                          />
                        </div>
                        
                        {/* Send Message Button */}
                        <SendMessageButton
                          itemType="BOOK"
                          itemId={book.id}
                          ownerId={book.owner.id}
                          ownerName={book.owner.name}
                          ownerImage={book.owner.image}
                          itemTitle={book.title}
                          variant="outline"
                          size="sm"
                          className="w-full"
                        />
                      </div>
                    </CardContent>
                  </motion.div>
                </HoverCard>
              ))}
            </div>
          )}

          {/* Footer Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-8 text-gray-600 dark:text-gray-400"
          >
            <p className="text-sm">
              Showing <span className="font-semibold text-blue-600 dark:text-blue-400">{filteredBooks.length}</span> book{filteredBooks.length !== 1 ? 's' : ''} available in the marketplace
            </p>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}