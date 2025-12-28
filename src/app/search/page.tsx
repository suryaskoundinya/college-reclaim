"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loading } from "@/components/ui/loading"
import { Navbar } from "@/components/navbar"
import { BackButton } from "@/components/ui/back-button"
import { ArrowLeft, Search as SearchIcon, Filter, MapPin, Calendar, User, Heart, Eye, ExternalLink, Sparkles } from "lucide-react"
import { toast } from "sonner"

// Debounce hook for search input
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

const categories = [
  { value: "ALL", label: "All Categories", icon: "📦" },
  { value: "ELECTRONICS", label: "Electronics", icon: "📱" },
  { value: "BOOK", label: "Books", icon: "📚" },
  { value: "ID_CARD", label: "ID Cards", icon: "🆔" },
  { value: "BAGS", label: "Bags & Backpacks", icon: "🎒" },
  { value: "ACCESSORIES", label: "Accessories", icon: "👜" },
  { value: "CLOTHING", label: "Clothing", icon: "👕" },
  { value: "KEYS", label: "Keys", icon: "🔑" },
  { value: "SPORTS", label: "Sports Equipment", icon: "⚽" },
  { value: "OTHER", label: "Other Items", icon: "📋" }
]

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedSearchQuery = useDebounce(searchQuery, 300) // 300ms debounce delay
  const [categoryFilter, setCategoryFilter] = useState("ALL")
  const [typeFilter, setTypeFilter] = useState("ALL")
  const [sortBy, setSortBy] = useState("date")
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("grid")
  const [lostItems, setLostItems] = useState<any[]>([])
  const [foundItems, setFoundItems] = useState<any[]>([])

  // Fetch items from API
  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true)
      try {
        const [lostResponse, foundResponse] = await Promise.all([
          fetch('/api/lost-items'),
          fetch('/api/found-items')
        ])

        if (lostResponse.ok) {
          const lostData = await lostResponse.json()
          setLostItems(lostData.items || [])
        } else {
          toast.error('Failed to load lost items')
        }

        if (foundResponse.ok) {
          const foundData = await foundResponse.json()
          setFoundItems(foundData.items || [])
        } else {
          toast.error('Failed to load found items')
        }
      } catch (error) {
        console.error('Error fetching items:', error)
        toast.error('Failed to load items. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchItems()
  }, [])

  // Combine and transform items for display
  const allItems = useMemo(() => {
    const transformedLost = lostItems.map(item => {
      const date = new Date(item.dateLost)
      return {
        id: item.id,
        type: 'lost',
        title: item.title,
        description: item.description,
        category: item.category,
        location: item.location,
        date: date.toLocaleDateString('en-CA'), // YYYY-MM-DD format in local timezone
        time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        reporter: item.user?.name || 'Anonymous',
        contactEmail: item.user?.email || null,
        contactPhone: item.contactPhone || item.user?.phoneNumber || null,
        imageUrl: item.imageUrl || null,
        status: item.status,
        views: 0,
        contactAttempts: 0,
        verified: true
      }
    })

    const transformedFound = foundItems.map(item => {
      const date = new Date(item.dateFound)
      return {
        id: item.id,
        type: 'found',
        title: item.title,
        description: item.description,
        category: item.category,
        location: item.location,
        date: date.toLocaleDateString('en-CA'), // YYYY-MM-DD format in local timezone
        time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        reporter: item.user?.name || 'Anonymous',
        contactEmail: item.user?.email || null,
        contactPhone: item.contactPhone || item.user?.phoneNumber || null,
        imageUrl: item.imageUrl || null,
        status: item.status,
        views: 0,
        contactAttempts: 0,
        verified: true
      }
    })

    const combined = [...transformedLost, ...transformedFound]
    return combined
  }, [lostItems, foundItems])

  // Memoized filtered items with improved filter logic
  const filteredItems = useMemo(() => {
    const filtered = allItems.filter(item => {
      // Search query filter (case-insensitive, trim whitespace)
      const query = debouncedSearchQuery.trim().toLowerCase()
      const matchesQuery = query === '' || 
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      
      // Category filter (strict match)
      const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter
      
      // Type filter (strict match)
      const matchesType = typeFilter === 'ALL' || item.type === typeFilter
      
      // All filters must match (AND logic)
      return matchesQuery && matchesCategory && matchesType
    }).sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime()
        case 'views':
          return b.views - a.views
        case 'title':
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    return filtered
  }, [debouncedSearchQuery, categoryFilter, typeFilter, sortBy, allItems])

  const handleSearch = () => {
    toast.success(`Found ${filteredItems.length} items matching your criteria`)
  }

  const handleContact = (item: { title: string; reporter?: string; user?: { name: string } }) => {
    toast.success(`Contact details for ${item.title} have been sent to your email!`)
  }

  const handleSaveItem = (itemId: number) => {
    toast.success("Item saved to your favorites!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Navbar />
      
      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <BackButton showHomeButton showBackButton className="mb-4 sm:mb-6" />
          
          <div className="text-center md:text-left px-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-3 sm:mb-4">
              Search Lost & Found Items
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto md:mx-0">
              Find your lost items or browse found items to help others reconnect with their belongings
            </p>
          </div>
        </motion.div>

        {/* Enhanced Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="mb-6 sm:mb-8 bg-white/70 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-xl">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center text-lg sm:text-xl md:text-2xl dark:text-gray-100">
                <SearchIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-violet-600 dark:text-violet-400" />
                Advanced Search & Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div className="sm:col-span-2 lg:col-span-1">
                  <Label htmlFor="search" className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Search Items</Label>
                  <Input
                    id="search"
                    placeholder="Search by title, description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mt-1 text-sm"
                  />
                </div>
                
                <div>
                  <Label htmlFor="category" className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Category</Label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="mt-1 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.value} value={category.value} className="text-sm">
                          {category.icon} {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="type" className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Item Type</Label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="mt-1 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL" className="text-sm">📦 All Items</SelectItem>
                      <SelectItem value="lost" className="text-sm">❌ Lost Items</SelectItem>
                      <SelectItem value="found" className="text-sm">✅ Found Items</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between pt-2">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                  <Button 
                    onClick={handleSearch} 
                    className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-sm w-full sm:w-auto"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loading size="sm" />
                    ) : (
                      <>
                        <SearchIcon className="h-4 w-4 mr-2" />
                        Search Items
                      </>
                    )}
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    <Label htmlFor="sort" className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">Sort by:</Label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-full sm:w-32 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date" className="text-sm">📅 Date</SelectItem>
                        <SelectItem value="views" className="text-sm">👁️ Views</SelectItem>
                        <SelectItem value="title" className="text-sm">🔤 Title</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
                  <TabsList className="w-full sm:w-auto grid grid-cols-2">
                    <TabsTrigger value="grid" className="text-xs sm:text-sm">Grid View</TabsTrigger>
                    <TabsTrigger value="list" className="text-xs sm:text-sm">List View</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Summary */}
        <motion.div 
          className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center gap-4">
            <p className="text-gray-600 dark:text-gray-300 font-medium">
              Found <span className="text-violet-600 dark:text-violet-400 font-bold">{filteredItems.length}</span> items
            </p>
            {searchQuery && (
              <Badge variant="outline" className="border-violet-200 dark:border-violet-600 text-violet-700 dark:text-violet-300">
                Search: "{searchQuery}"
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span>Lost Items</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span>Found Items</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span>Resolved</span>
            </div>
          </div>
        </motion.div>

        {/* Results */}
        <Tabs value={activeTab} className="w-full">
          <TabsContent value="grid">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <AnimatePresence>
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{ y: -4 }}
                  >
                    <Card className={`h-full hover:shadow-2xl transition-all duration-500 cursor-pointer ${
                      item.type === 'lost' 
                        ? 'border-l-4 border-l-red-400 bg-gradient-to-br from-red-50/50 to-pink-50/50 dark:from-red-900/20 dark:to-pink-900/20 dark:bg-gray-800/90 dark:border-gray-700' 
                        : 'border-l-4 border-l-emerald-400 bg-gradient-to-br from-emerald-50/50 to-green-50/50 dark:from-emerald-900/20 dark:to-green-900/20 dark:bg-gray-800/90 dark:border-gray-700'
                    } ${item.status === 'RESOLVED' ? 'opacity-60' : ''} relative overflow-hidden`}>
                      
                      {/* Status indicators */}
                      <div className="absolute top-3 right-3 flex gap-2 z-10">
                        {item.verified && <Badge variant="secondary" className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">✓</Badge>}
                      </div>

                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start mb-2">
                          <CardTitle className="text-lg leading-tight pr-20 dark:text-gray-100">{item.title}</CardTitle>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge variant={item.type === 'lost' ? 'destructive' : 'secondary'} className="font-medium">
                            {item.type === 'lost' ? '❌ Lost' : '✅ Found'}
                          </Badge>
                          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {item.views}
                            </div>
                            {item.contactAttempts > 0 && (
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {item.contactAttempts}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        {item.imageUrl ? (
                          <div className="mb-4 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                            <img 
                              src={item.imageUrl} 
                              alt={item.title}
                              className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                console.error('Image failed to load:', item.imageUrl)
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          </div>
                        ) : (
                          <div className="mb-4 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 h-48 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-4xl mb-2">{categories.find(c => c.value === item.category)?.icon || '📦'}</div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">No image available</p>
                            </div>
                          </div>
                        )}
                        
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">{item.description}</p>
                        
                        <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-violet-500 dark:text-violet-400" />
                            <span className="line-clamp-1">{item.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 flex-shrink-0 text-violet-500 dark:text-violet-400" />
                            <span>{new Date(item.date).toLocaleDateString()} at {item.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 flex-shrink-0 text-violet-500 dark:text-violet-400" />
                            <span>Reported by {item.reporter}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="border-t pt-3 space-y-2">
                            <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Contact Information</h4>
                            {item.contactEmail && (
                              <div className="flex items-center gap-2 text-sm">
                                <span className="text-gray-500 dark:text-gray-400">📧</span>
                                <a href={`mailto:${item.contactEmail}`} className="text-violet-600 dark:text-violet-400 hover:underline">
                                  {item.contactEmail}
                                </a>
                              </div>
                            )}
                            {item.contactPhone && (
                              <div className="flex items-center gap-2 text-sm">
                                <span className="text-gray-500 dark:text-gray-400">📱</span>
                                <a href={`tel:${item.contactPhone}`} className="text-violet-600 dark:text-violet-400 hover:underline">
                                  {item.contactPhone}
                                </a>
                              </div>
                            )}
                            {!item.contactEmail && !item.contactPhone && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 italic">No contact information provided</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </TabsContent>

          <TabsContent value="list">
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <AnimatePresence>
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, delay: index * 0.03 }}
                  >
                    <Card className={`hover:shadow-lg transition-all duration-300 ${
                      item.type === 'lost' ? 'border-l-4 border-l-red-400 dark:bg-gray-800/90 dark:border-gray-700' : 'border-l-4 border-l-emerald-400 dark:bg-gray-800/90 dark:border-gray-700'
                    } ${item.status === 'RESOLVED' ? 'opacity-60' : ''}`}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          {item.imageUrl && (
                            <div className="md:w-40 md:h-28 w-full h-48 rounded-lg overflow-hidden flex-shrink-0">
                              <img 
                                src={item.imageUrl} 
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          
                          <div className="flex-1">
                            <div className="flex items-start gap-3 mb-2">
                              <Badge variant={item.type === 'lost' ? 'destructive' : 'secondary'}>
                                {item.type === 'lost' ? '❌ Lost' : '✅ Found'}
                              </Badge>
                              <div>
                                <h3 className="font-semibold text-lg dark:text-gray-100">{item.title}</h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{item.description}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-gray-500 dark:text-gray-400 mt-3">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-violet-500 dark:text-violet-400" />
                                <span>{item.location}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-violet-500 dark:text-violet-400" />
                                <span>{new Date(item.date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-violet-500 dark:text-violet-400" />
                                <span>{item.reporter}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2 min-w-[250px]">
                            <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Contact</div>
                            {item.contactEmail && (
                              <div className="flex items-center gap-2 text-sm">
                                <span className="text-gray-500 dark:text-gray-400">📧</span>
                                <a href={`mailto:${item.contactEmail}`} className="text-violet-600 dark:text-violet-400 hover:underline truncate">
                                  {item.contactEmail}
                                </a>
                              </div>
                            )}
                            {item.contactPhone && (
                              <div className="flex items-center gap-2 text-sm">
                                <span className="text-gray-500 dark:text-gray-400">📱</span>
                                <a href={`tel:${item.contactPhone}`} className="text-violet-600 dark:text-violet-400 hover:underline">
                                  {item.contactPhone}
                                </a>
                              </div>
                            )}
                            {!item.contactEmail && !item.contactPhone && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 italic">No contact info</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* No Results State */}
        {filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="text-center py-16 bg-white/70 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent>
                <motion.div 
                  className="text-6xl mb-6"
                  animate={{ 
                    rotate: [0, -10, 10, -10, 0],
                    scale: [1, 1.1, 1] 
                  }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  🔍
                </motion.div>
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  No items found
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
                  We couldn't find any items matching your search criteria. Try adjusting your filters or search terms.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                  <Button 
                    onClick={() => {
                      setSearchQuery('')
                      setCategoryFilter('ALL')
                      setTypeFilter('ALL')
                    }}
                    variant="outline"
                  >
                    Clear All Filters
                  </Button>
                  <span className="text-gray-400">or</span>
                  <Link href="/report/lost">
                    <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Report New Item
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Call to Action */}
        {filteredItems.length > 0 && (
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 text-white border-none shadow-2xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <CardContent className="p-8 relative z-10">
                <h3 className="text-2xl font-bold mb-4 text-white">Can't Find Your Item?</h3>
                <p className="text-violet-100 mb-6">
                  Don't worry! Report your lost item or found item to help build our community database.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/report/lost">
                    <Button variant="secondary" size="lg" className="bg-white text-violet-700 hover:bg-gray-50 font-semibold w-full sm:w-auto">
                      📋 Report Lost Item
                    </Button>
                  </Link>
                  <Link href="/report/found">
                    <Button variant="outline" size="lg" className="text-white border-2 border-white hover:bg-white hover:text-violet-600 font-semibold w-full sm:w-auto">
                      ✅ Report Found Item
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  )
}