"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { ArrowRight, Sparkles, Users, TrendingUp, Shield, Trophy, BookOpen, CalendarDays, FileText, CheckCircle, Search, Coffee, Clock } from "lucide-react"
import { useSession } from "next-auth/react"
import { CoffeeModal } from "@/components/coffee-modal"
import { useState, useEffect } from "react"
import { Loading } from "@/components/ui/loading"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function Home() {
  const { data: session } = useSession()
  const [showCoffeeModal, setShowCoffeeModal] = useState(false)
  const [recentItems, setRecentItems] = useState<any[]>([])
  const [isLoadingItems, setIsLoadingItems] = useState(true)

  // Fetch recent items
  useEffect(() => {
    const fetchRecentItems = async () => {
      setIsLoadingItems(true)
      try {
        const [lostResponse, foundResponse] = await Promise.all([
          fetch('/api/lost-items?limit=3'),
          fetch('/api/found-items?limit=3')
        ])

        if (lostResponse.ok && foundResponse.ok) {
          const lostData = await lostResponse.json()
          const foundData = await foundResponse.json()
          
          // Combine and sort by creation date (most recent first)
          const combined = [
            ...lostData.items.map((item: any) => ({ ...item, type: 'lost', date: item.dateLost })),
            ...foundData.items.map((item: any) => ({ ...item, type: 'found', date: item.dateFound }))
          ]
          
          // Sort by creation date descending and take top 6
          const sorted = combined
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 6)
          
          setRecentItems(sorted)
        }
      } catch (error) {
        console.error('Error fetching recent items:', error)
      } finally {
        setIsLoadingItems(false)
      }
    }

    fetchRecentItems()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden transition-colors duration-300">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      {/* Enhanced Navigation */}
      <Navbar />
      
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 md:pt-20 pb-12 sm:pb-16 relative z-10">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h1 
            className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 leading-tight px-2 transition-colors duration-300"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Lost something?{" "}
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Found something?
            </span>
          </motion.h1>
          <motion.p 
            className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg leading-6 sm:leading-7 md:leading-8 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4 transition-colors duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            College Reclaim is your comprehensive platform for reporting and finding lost items on campus. 
            Join our trusted community of students helping each other recover their belongings safely and efficiently.
          </motion.p>
          <motion.div 
            className="mt-6 sm:mt-8 md:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Link href="/report/lost" prefetch={true} className="w-full sm:w-auto">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto text-white bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base"
                  aria-label="Report a lost item"
                >
                  <FileText className="mr-2 h-4 w-4" aria-hidden="true" />
                  Report Lost Item
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              </motion.div>
            </Link>
            <Link href="/report/found" prefetch={true} className="w-full sm:w-auto">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto border-2 border-emerald-500 dark:border-emerald-400 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-600 dark:hover:border-emerald-300 shadow-md hover:shadow-lg transition-all duration-300 font-semibold px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-white dark:bg-transparent"
                  aria-label="Report a found item"
                >
                  <CheckCircle className="mr-2 h-4 w-4" aria-hidden="true" />
                  Report Found Item
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              </motion.div>
            </Link>
            <Link href="/search" prefetch={true} className="w-full sm:w-auto">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="w-full sm:w-auto bg-gradient-to-r from-violet-100 to-indigo-100 hover:from-violet-200 hover:to-indigo-200 text-violet-800 dark:text-violet-700 shadow-md hover:shadow-lg transition-all duration-300 font-semibold px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base"
                  aria-label="Browse all lost and found items"
                >
                  <Search className="mr-2 h-4 w-4" aria-hidden="true" />
                  Browse All Items
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>

        {/* Quick Actions */}
        <motion.section 
          className="mt-10 sm:mt-12 md:mt-16 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border border-white/20 dark:border-gray-700/20 transition-colors duration-300"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          aria-labelledby="quick-actions-heading"
        >
          <motion.div 
            className="text-center mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <h2 id="quick-actions-heading" className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-100 dark:via-gray-200 dark:to-gray-300 bg-clip-text text-transparent transition-colors duration-300">Quick Actions</h2>
            <p className="text-gray-700 dark:text-gray-400 mt-2 text-xs sm:text-sm md:text-base transition-colors duration-300">What would you like to do today?</p>
          </motion.div>
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6"
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={fadeInUp}>
              <Link href="/report/lost" prefetch={true} className="group">
                <motion.div
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Card className="hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 border-red-200 dark:border-red-100 hover:border-red-300 dark:hover:border-red-200 bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-50 dark:to-pink-50 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-pink-500/10 dark:from-red-500/5 dark:to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <CardContent className="p-4 sm:p-6 md:p-8 text-center relative z-10">
                      <motion.div 
                        className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        😢
                      </motion.div>
                      <h3 className="font-bold text-base sm:text-lg md:text-xl text-red-800 dark:text-red-700 group-hover:text-red-900 dark:group-hover:text-red-800 mb-2">I Lost Something</h3>
                      <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-600 transition-colors duration-300">Report your lost item with details and get help from the community</p>
                      <div className="mt-3 sm:mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ArrowRight className="mx-auto h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <Link href="/report/found" prefetch={true} className="group">
                <motion.div
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Card className="hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 border-emerald-200 dark:border-emerald-100 hover:border-emerald-300 dark:hover:border-emerald-200 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-50 dark:to-green-50 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/10 dark:from-emerald-500/5 dark:to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <CardContent className="p-4 sm:p-6 md:p-8 text-center relative z-10">
                      <motion.div 
                        className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4"
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        🎉
                      </motion.div>
                      <h3 className="font-bold text-base sm:text-lg md:text-xl text-emerald-800 dark:text-emerald-700 group-hover:text-emerald-900 dark:group-hover:text-emerald-800 mb-2">I Found Something</h3>
                      <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-600 transition-colors duration-300">Help someone recover their item and make their day better</p>
                      <div className="mt-3 sm:mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ArrowRight className="mx-auto h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <Link href="/search" prefetch={true} className="group">
                <motion.div
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Card className="hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 border-violet-200 dark:border-violet-100 hover:border-violet-300 dark:hover:border-violet-200 bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-50 dark:to-indigo-50 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-indigo-500/10 dark:from-violet-500/5 dark:to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <CardContent className="p-4 sm:p-6 md:p-8 text-center relative z-10">
                      <motion.div 
                        className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        🔍
                      </motion.div>
                      <h3 className="font-bold text-base sm:text-lg md:text-xl text-violet-800 dark:text-violet-700 group-hover:text-violet-900 dark:group-hover:text-violet-800 mb-2">Browse Items</h3>
                      <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-600 transition-colors duration-300">Search through all lost & found items in the database</p>
                      <div className="mt-3 sm:mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ArrowRight className="mx-auto h-4 w-4 sm:h-5 sm:w-5 text-violet-600" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* New Modules Section */}
        <motion.section 
          className="mt-10 sm:mt-12 md:mt-16 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border border-white/20 dark:border-gray-700/20 transition-colors duration-300"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          aria-labelledby="new-modules-heading"
        >
          <motion.div 
            className="text-center mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <h2 id="new-modules-heading" className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-100 dark:via-gray-200 dark:to-gray-300 bg-clip-text text-transparent transition-colors duration-300">Campus Community</h2>
            <p className="text-gray-700 dark:text-gray-400 mt-2 text-xs sm:text-sm md:text-base transition-colors duration-300">Explore books and events on campus</p>
          </motion.div>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={fadeInUp}>
              <Link href="/books" prefetch={true} className="group">
                <motion.div
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Card className="hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 border-blue-200 dark:border-blue-100 hover:border-blue-300 dark:hover:border-blue-200 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-50 dark:to-indigo-50 overflow-hidden relative h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-500/5 dark:to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <CardContent className="p-4 sm:p-6 md:p-8 text-center relative z-10">
                      <motion.div 
                        className="mx-auto flex h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg group-hover:shadow-xl transition-all duration-300 mb-3 sm:mb-4"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <BookOpen className="text-white w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                      </motion.div>
                      <h3 className="font-bold text-base sm:text-lg md:text-xl text-blue-800 dark:text-blue-700 group-hover:text-blue-900 dark:group-hover:text-blue-800 mb-2">Book Marketplace</h3>
                      <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-600 transition-colors duration-300 mb-3 sm:mb-4">
                        Buy, sell, or rent textbooks from fellow students. Find affordable study materials and declutter your bookshelf.
                      </p>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center mb-3 sm:mb-4">
                        <span className="px-2 py-0.5 sm:py-1 bg-blue-200 dark:bg-blue-100 text-blue-800 dark:text-blue-700 text-[10px] sm:text-xs rounded-full font-medium">Textbooks</span>
                        <span className="px-2 py-0.5 sm:py-1 bg-indigo-200 dark:bg-indigo-100 text-indigo-800 dark:text-indigo-700 text-[10px] sm:text-xs rounded-full font-medium">Rent/Buy</span>
                        <span className="px-2 py-0.5 sm:py-1 bg-purple-200 dark:bg-purple-100 text-purple-800 dark:text-purple-700 text-[10px] sm:text-xs rounded-full font-medium">Student-to-Student</span>
                      </div>
                      <div className="mt-3 sm:mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ArrowRight className="mx-auto h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <Link href="/events" prefetch={true} className="group">
                <motion.div
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Card className="hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 border-purple-200 dark:border-purple-100 hover:border-purple-300 dark:hover:border-purple-200 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-50 dark:to-pink-50 overflow-hidden relative h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/5 dark:to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <CardContent className="p-4 sm:p-6 md:p-8 text-center relative z-10">
                      <motion.div 
                        className="mx-auto flex h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg group-hover:shadow-xl transition-all duration-300 mb-3 sm:mb-4"
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <CalendarDays className="text-white w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                      </motion.div>
                      <h3 className="font-bold text-base sm:text-lg md:text-xl text-purple-800 dark:text-purple-700 group-hover:text-purple-900 dark:group-hover:text-purple-800 mb-2">Campus Events</h3>
                      <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-600 transition-colors duration-300 mb-3 sm:mb-4">
                        Discover exciting events, workshops, and activities happening around campus. Join clubs and build connections.
                      </p>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center mb-3 sm:mb-4">
                        <span className="px-2 py-0.5 sm:py-1 bg-purple-200 dark:bg-purple-100 text-purple-800 dark:text-purple-700 text-[10px] sm:text-xs rounded-full font-medium">Workshops</span>
                        <span className="px-2 py-0.5 sm:py-1 bg-pink-200 dark:bg-pink-100 text-pink-800 dark:text-pink-700 text-[10px] sm:text-xs rounded-full font-medium">Club Events</span>
                        <span className="px-2 py-0.5 sm:py-1 bg-indigo-200 dark:bg-indigo-100 text-indigo-800 dark:text-indigo-700 text-[10px] sm:text-xs rounded-full font-medium">Networking</span>
                      </div>
                      <div className="mt-3 sm:mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ArrowRight className="mx-auto h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Recently Added Items Section */}
        <motion.section 
          className="mt-10 sm:mt-12 md:mt-16 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border border-white/20 dark:border-gray-700/20 transition-colors duration-300"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <motion.div 
            className="flex items-center justify-between mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
          >
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-100 dark:via-gray-200 dark:to-gray-300 bg-clip-text text-transparent transition-colors duration-300 flex items-center gap-2">
                <Clock className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                Recently Added Items
              </h2>
              <p className="text-gray-700 dark:text-gray-400 mt-2 text-xs sm:text-sm md:text-base transition-colors duration-300">Latest lost and found items from the community</p>
            </div>
            <Link href="/search">
              <Button variant="outline" size="sm" className="text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          {isLoadingItems ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loading size="lg" />
              <p className="text-gray-600 dark:text-gray-400 mt-4 text-sm font-medium">Loading recent items...</p>
            </div>
          ) : recentItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-base font-medium">No items reported yet. Be the first to report!</p>
              <div className="flex gap-3 justify-center mt-6">
                <Link href="/report/lost">
                  <Button variant="outline" size="sm" className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-600">
                    Report Lost Item
                  </Button>
                </Link>
                <Link href="/report/found">
                  <Button variant="outline" size="sm" className="text-green-600 dark:text-green-400 border-green-200 dark:border-green-600">
                    Report Found Item
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {recentItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 1.4 + index * 0.1 }}
                >
                  <Link href="/search">
                    <Card className={`hover:shadow-xl transition-all duration-300 cursor-pointer h-full ${
                      item.type === 'lost' 
                        ? 'border-l-4 border-l-red-400 bg-gradient-to-br from-red-50/50 to-pink-50/50 dark:from-red-900/20 dark:to-pink-900/20' 
                        : 'border-l-4 border-l-emerald-400 bg-gradient-to-br from-emerald-50/50 to-green-50/50 dark:from-emerald-900/20 dark:to-green-900/20'
                    } dark:bg-gray-800/90`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 line-clamp-1">
                            {item.title}
                          </CardTitle>
                          <Badge variant={item.type === 'lost' ? 'destructive' : 'default'} className="text-xs shrink-0">
                            {item.type === 'lost' ? '❌ Lost' : '✅ Found'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                          <span className="flex items-center gap-1">
                            📍 {item.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>


        {/* CTA Section */}
        <motion.div 
          className="mt-12 sm:mt-16 md:mt-20 text-center px-2"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 text-white border-none shadow-2xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/50 to-indigo-600/50"></div>
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
              <CardHeader className="relative z-10 pb-3 sm:pb-6">
                <CardTitle className="text-xl sm:text-2xl md:text-3xl text-white mb-2">Ready to get started?</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 pt-0">
                <p className="text-violet-100 mb-6 sm:mb-8 text-sm sm:text-base md:text-lg px-2">
                  Join thousands of students helping each other recover lost items every day.
                </p>
                <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap px-2">
                  {!session && (
                    <Link href="/auth/signup" prefetch={true}>
                      <motion.div
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button variant="secondary" size="lg" className="bg-white text-violet-700 hover:bg-gray-50 shadow-lg font-semibold text-sm sm:text-base px-4 sm:px-6">
                          Create Account
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </motion.div>
                    </Link>
                  )}
                  <Link href="/search" prefetch={true}>
                    <motion.div
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button variant="outline" size="lg" className="text-white border-2 border-white hover:bg-white hover:text-violet-600 shadow-lg font-semibold transition-all duration-300 text-sm sm:text-base px-4 sm:px-6">
                        Browse Items
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </motion.div>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm relative z-10 transition-colors duration-300 mt-8 sm:mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.6 }}
            >
              <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-lg overflow-hidden">
                  <Image 
                    src="/logo.webp" 
                    alt="College Reclaim Logo" 
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="font-bold text-base sm:text-lg bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">College Reclaim</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300 text-sm sm:text-base">
                Helping college communities recover lost items and build trust through technology.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.7 }}
            >
              <h4 className="font-bold mb-3 sm:mb-4 text-gray-900 dark:text-gray-100 transition-colors duration-300 text-sm sm:text-base">Quick Links</h4>
              <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                <div><Link href="/report/lost" className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200">Report Lost Item</Link></div>
                <div><Link href="/report/found" className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200">Report Found Item</Link></div>
                <div><Link href="/search" className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200">Search Items</Link></div>
                <div><Link href="/books" className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200">Books Marketplace</Link></div>
                <div><Link href="/events" className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200">Campus Events</Link></div>
                {!session && (
                  <div><Link href="/auth/signup" className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200">Join Community</Link></div>
                )}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.8 }}
            >
              <h4 className="font-bold mb-3 sm:mb-4 text-gray-900 dark:text-gray-100 transition-colors duration-300 text-sm sm:text-base">Support</h4>
              <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                <div><Link href="/support" className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200">Help Center</Link></div>
                <div><Link href="/support" className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200">Contact Us</Link></div>
                <div><Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200">Privacy Policy</Link></div>
                <div><Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200">Terms of Service</Link></div>
              </div>
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-bold mb-3 sm:mb-4 text-gray-900 dark:text-gray-100 transition-colors duration-300 text-sm sm:text-base">Connect With Us</h4>
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-pink-600 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    </svg>
                    <a href="https://instagram.com/college_reclaim" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors duration-200 break-all">@college_reclaim</a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-violet-600 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                      <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                    </svg>
                    <a href="mailto:collegereclaimjc@gmail.com" className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200 break-all">collegereclaimjc@gmail.com</a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          <motion.div 
            className="border-t mt-6 sm:mt-8 pt-6 sm:pt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.9 }}
          >
            <motion.button
              onClick={() => setShowCoffeeModal(true)}
              className="inline-flex items-center space-x-2 px-6 py-3 mb-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Coffee className="w-5 h-5" />
              <span>Buy Me a Coffee ☕</span>
            </motion.button>
            <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300 text-xs sm:text-sm">&copy; 2025 College Reclaim. Made with ❤️ by Surya.</p>
          </motion.div>
        </div>
      </footer>

      {/* Coffee Modal */}
      <CoffeeModal isOpen={showCoffeeModal} onClose={() => setShowCoffeeModal(false)} />
    </div>
  )
}
