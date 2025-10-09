"use client"

import { useState, useEffect, useMemo } from "react"
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
import { ArrowLeft, Search as SearchIcon, Filter, MapPin, Calendar, User, Heart, Eye, ExternalLink, Sparkles } from "lucide-react"
import { toast } from "sonner"

// Enhanced mock data with more realistic details
const mockItems = [
  {
    id: 1,
    type: "lost",
    title: "iPhone 14 Pro - Midnight Black",
    description: "Black iPhone 14 Pro with MagSafe compatible purple case. Has a small scratch on the back camera. Contains important photos and contacts.",
    category: "ELECTRONICS",
    location: "Central Library - 3rd Floor Study Area",
    date: "2025-09-25",
    time: "14:30",
    reporter: "John D.",
    contact: "john.doe@university.edu",
    status: "ACTIVE",
    views: 47,
    contactAttempts: 3,
    reward: "$50",
    images: ["phone1.jpg"],
    verified: true
  },
  {
    id: 2,
    type: "found",
    title: "Blue Jansport Backpack",
    description: "Navy blue Jansport backpack with multiple compartments. Contains notebooks, pens, and a water bottle. Found with owner's initials 'S.M.' on the inside tag.",
    category: "BAGS",
    location: "Student Center - Main Entrance",
    date: "2025-09-26",
    time: "10:15",
    reporter: "Sarah M.",
    contact: "sarah.martinez@university.edu",
    status: "ACTIVE",
    views: 32,
    contactAttempts: 1,
    images: ["backpack1.jpg"],
    verified: true
  },
  {
    id: 3,
    type: "lost",
    title: "University Student ID Card",
    description: "Student ID card with photo. Name: Alex Johnson, Student ID: STU2024789. Lost somewhere between the cafeteria and engineering building.",
    category: "ID_CARD",
    location: "Campus Cafeteria to Engineering Building",
    date: "2025-09-27",
    time: "12:45",
    reporter: "Alex J.",
    contact: "alex.johnson@university.edu",
    status: "ACTIVE",
    views: 28,
    contactAttempts: 0,
    urgent: true,
    verified: true
  },
  {
    id: 4,
    type: "found",
    title: "Apple AirPods Pro (2nd Gen)",
    description: "White AirPods Pro with wireless charging case. Found in pristine condition in Room 205. Case shows 80% battery when checked.",
    category: "ELECTRONICS",
    location: "Engineering Building - Room 205",
    date: "2025-09-24",
    time: "16:20",
    reporter: "Mike R.",
    contact: "mike.rodriguez@university.edu",
    status: "ACTIVE",
    views: 65,
    contactAttempts: 5,
    images: ["airpods1.jpg"],
    verified: true
  },
  {
    id: 5,
    type: "lost",
    title: "MacBook Pro 13\" with Stickers",
    description: "Silver MacBook Pro 13\" with programming stickers on the lid. Contains important coursework and projects. Reward offered for safe return.",
    category: "ELECTRONICS", 
    location: "Computer Science Building - Lab 101",
    date: "2025-09-23",
    time: "18:30",
    reporter: "Emma K.",
    contact: "emma.kim@university.edu",
    status: "RESOLVED",
    views: 89,
    contactAttempts: 8,
    reward: "$200",
    images: ["laptop1.jpg"],
    verified: true
  },
  {
    id: 6,
    type: "found",
    title: "Silver Watch - Fossil Brand",
    description: "Men's silver Fossil watch with leather strap. Has an engraving on the back that says 'Happy 21st Birthday - Love Mom & Dad'.",
    category: "ACCESSORIES",
    location: "Sports Complex - Locker Room",
    date: "2025-09-26",
    time: "07:45",
    reporter: "David L.",
    contact: "david.lee@university.edu",
    status: "ACTIVE",
    views: 41,
    contactAttempts: 2,
    images: ["watch1.jpg"],
    verified: true
  }
]

const categories = [
  { value: "ALL", label: "All Categories", icon: "📦" },
  { value: "ELECTRONICS", label: "Electronics", icon: "📱" },
  { value: "BOOKS", label: "Books", icon: "📚" },
  { value: "ID_CARD", label: "ID Cards", icon: "🆔" },
  { value: "BAGS", label: "Bags & Backpacks", icon: "🎒" },
  { value: "ACCESSORIES", label: "Accessories", icon: "👜" },
  { value: "KEYS", label: "Keys", icon: "🔑" },
  { value: "OTHER", label: "Other Items", icon: "📋" }
]

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("ALL")
  const [typeFilter, setTypeFilter] = useState("ALL")
  const [statusFilter, setStatusFilter] = useState("ACTIVE")
  const [sortBy, setSortBy] = useState("date")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("grid")

  // Memoized filtered items for better performance
  const filteredItems = useMemo(() => {
    return mockItems.filter(item => {
      const matchesQuery = searchQuery === '' || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter
      const matchesType = typeFilter === 'ALL' || item.type === typeFilter
      const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter
      
      return matchesQuery && matchesCategory && matchesType && matchesStatus
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
  }, [searchQuery, categoryFilter, typeFilter, statusFilter, sortBy])

  const handleSearch = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast.success(`Found ${filteredItems.length} items matching your criteria`)
    }, 500)
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
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link href="/" className="inline-flex items-center text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 mb-6 transition-colors duration-200">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Search Lost & Found Items
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto md:mx-0">
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
          <Card className="mb-8 bg-white/70 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-xl md:text-2xl dark:text-gray-100">
                <SearchIcon className="h-5 w-5 mr-3 text-violet-600 dark:text-violet-400" />
                Advanced Search & Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="md:col-span-2 lg:col-span-1">
                  <Label htmlFor="search" className="text-sm font-medium text-gray-700 dark:text-gray-300">Search Items</Label>
                  <Input
                    id="search"
                    placeholder="Search by title, description, location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="category" className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</Label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.icon} {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="type" className="text-sm font-medium text-gray-700 dark:text-gray-300">Item Type</Label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">📦 All Items</SelectItem>
                      <SelectItem value="lost">❌ Lost Items</SelectItem>
                      <SelectItem value="found">✅ Found Items</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status" className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">🟢 Active</SelectItem>
                      <SelectItem value="RESOLVED">✅ Resolved</SelectItem>
                      <SelectItem value="ALL">📋 All Status</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button 
                    onClick={handleSearch} 
                    className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
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
                    <Label htmlFor="sort" className="text-sm text-gray-600 dark:text-gray-400">Sort by:</Label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date">📅 Date</SelectItem>
                        <SelectItem value="views">👁️ Views</SelectItem>
                        <SelectItem value="title">🔤 Title</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
                  <TabsList>
                    <TabsTrigger value="grid">Grid View</TabsTrigger>
                    <TabsTrigger value="list">List View</TabsTrigger>
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
                        {item.urgent && <Badge variant="destructive" className="text-xs">Urgent</Badge>}
                        {item.verified && <Badge variant="secondary" className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">✓</Badge>}
                        {item.reward && <Badge variant="outline" className="text-xs border-green-300 dark:border-green-600 text-green-700 dark:text-green-400">{item.reward}</Badge>}
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
                        
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => handleContact(item)}
                            className={`flex-1 ${
                              item.type === 'lost' 
                                ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700' 
                                : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700'
                            } text-white font-medium`}
                            disabled={item.status === 'RESOLVED'}
                          >
                            {item.status === 'RESOLVED' ? '✅ Resolved' : (item.type === 'lost' ? 'I Found This!' : 'This Is Mine!')}
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleSaveItem(item.id)}
                            className="border-gray-300 hover:border-red-300 hover:text-red-600"
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
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
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
                          
                          <div className="flex items-center gap-3">
                            <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                              <div>{item.views} views</div>
                              {item.contactAttempts > 0 && <div>{item.contactAttempts} contacts</div>}
                            </div>
                            
                            <div className="flex gap-2">
                              <Button 
                                onClick={() => handleContact(item)}
                                className={`${
                                  item.type === 'lost' 
                                    ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700' 
                                    : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700'
                                } text-white`}
                                disabled={item.status === 'RESOLVED'}
                              >
                                {item.status === 'RESOLVED' ? 'Resolved' : 'Contact'}
                              </Button>
                              
                              <Button variant="outline" size="icon" onClick={() => handleSaveItem(item.id)}>
                                <Heart className="h-4 w-4" />
                              </Button>
                            </div>
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
                      setStatusFilter('ACTIVE')
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