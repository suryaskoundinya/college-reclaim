"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loading } from "@/components/ui/loading"
import { 
  Shield, Search, Mail, CheckCircle, XCircle, AlertTriangle, 
  Users, Package, TrendingUp, Activity, Calendar, MapPin, 
  User, Tag, Clock, Eye, Settings, LogOut, Home,
  BarChart3, Download, Bell, Filter, RefreshCw
} from "lucide-react"
import { toast } from "sonner"

// Enhanced mock data for demonstration
const mockLostItems = [
  {
    id: "L001",
    title: "iPhone 14 Pro",
    description: "Black iPhone 14 Pro with cracked screen protector and blue case",
    category: "Electronics",
    location: "Library 3rd floor",
    dateReported: "2025-01-10",
    status: "active",
    priority: "high",
    reporter: "john.doe@university.edu",
    reporterName: "John Doe",
    matchScore: 95,
    views: 156
  },
  {
    id: "L002", 
    title: "Blue Nike Backpack",
    description: "Navy blue Nike backpack with white logo, has university keychain",
    category: "Bags & Luggage",
    location: "Student Center",
    dateReported: "2025-01-09",
    status: "matched",
    priority: "medium",
    reporter: "jane.smith@university.edu",
    reporterName: "Jane Smith",
    matchScore: 88,
    views: 89
  },
  {
    id: "L003",
    title: "Silver MacBook Air",
    description: "13-inch MacBook Air with university stickers",
    category: "Electronics",
    location: "Computer Lab B",
    dateReported: "2025-01-08",
    status: "resolved",
    priority: "high",
    reporter: "alex.wilson@university.edu",
    reporterName: "Alex Wilson",
    matchScore: 92,
    views: 234
  }
]

const mockFoundItems = [
  {
    id: "F001",
    title: "Black Smartphone",
    description: "Black smartphone with blue case, found at charging station",
    category: "Electronics", 
    location: "Library charging station",
    dateFound: "2025-01-10",
    status: "pending",
    priority: "high",
    handedToAdmin: true,
    finder: "admin@university.edu",
    finderName: "Campus Security",
    matchScore: 95,
    claimRequests: 3
  },
  {
    id: "F002",
    title: "Blue Backpack",
    description: "Blue backpack with books inside, Nike brand with keychain",
    category: "Bags & Luggage",
    location: "Student Center lost & found",
    dateFound: "2025-01-09", 
    status: "claimed",
    priority: "medium",
    handedToAdmin: true,
    finder: "security@university.edu",
    finderName: "Security Team",
    matchScore: 88,
    claimRequests: 1
  },
  {
    id: "F003",
    title: "Wireless Earbuds",
    description: "White AirPods Pro with charging case",
    category: "Electronics",
    location: "Gymnasium",
    dateFound: "2025-01-07",
    status: "pending",
    priority: "low",
    handedToAdmin: false,
    finder: "sport.staff@university.edu",
    finderName: "Sports Staff",
    matchScore: 0,
    claimRequests: 7
  }
]

const recentActivity = [
  {
    id: 1,
    type: "match",
    message: "New match found: Blue Nike Backpack - 95% confidence",
    timestamp: "5 min ago",
    status: "success"
  },
  {
    id: 2,
    type: "report",
    message: "New lost item: iPhone 14 Pro reported by john.doe@university.edu",
    timestamp: "1 hour ago",
    status: "info"
  },
  {
    id: 3,
    type: "claim",
    message: "Item claimed: Silver MacBook Air successfully returned",
    timestamp: "2 hours ago",
    status: "success"
  },
  {
    id: 4,
    type: "admin",
    message: "Item handed to security: Wireless earbuds",
    timestamp: "3 hours ago",
    status: "warning"
  }
]

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-blue-100 text-blue-800 border-blue-200"
      case "matched": return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "resolved": return "bg-gray-100 text-gray-800 border-gray-200"
      case "claimed": return "bg-green-100 text-green-800 border-green-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600"
      case "medium": return "text-yellow-600"
      case "low": return "text-green-600"
      default: return "text-gray-600"
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "match": return <CheckCircle className="h-4 w-4 text-emerald-600" />
      case "report": return <Package className="h-4 w-4 text-blue-600" />
      case "claim": return <Users className="h-4 w-4 text-green-600" />
      case "admin": return <Shield className="h-4 w-4 text-yellow-600" />
      default: return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const handleAction = async (action: string, itemId: string) => {
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success(`${action} completed for item ${itemId}`, {
        duration: 3000,
      })
    } catch (error) {
      toast.error(`Failed to ${action.toLowerCase()} item ${itemId}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBulkAction = async (action: string) => {
    setIsLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success(`${action} completed successfully`)
    } catch (error) {
      toast.error(`Failed to ${action.toLowerCase()}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Navigation */}
      <motion.nav 
        className="relative z-10 bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="text-white w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    College Reclaim
                  </span>
                  <Badge variant="secondary" className="ml-2">Admin</Badge>
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Notifications</span>
              </Button>
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Public Site</span>
                </Button>
              </Link>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Settings</span>
              </Button>
              <Button variant="ghost" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Header */}
      <motion.div 
        className="relative z-10 bg-white/60 backdrop-blur-sm border-b border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-2">Manage lost and found items across campus</p>
            </div>
            <div className="flex space-x-3">
              <Button 
                onClick={() => handleBulkAction("Send Notifications")}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                disabled={isLoading}
              >
                {isLoading ? <Loading size="sm" /> : <Mail className="h-4 w-4 mr-2" />}
                Send Notifications
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm shadow-lg">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="lost" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
              <Package className="h-4 w-4 mr-2" />
              Lost Items
            </TabsTrigger>
            <TabsTrigger value="found" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
              <CheckCircle className="h-4 w-4 mr-2" />
              Found Items
            </TabsTrigger>
            <TabsTrigger value="matches" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
              <Users className="h-4 w-4 mr-2" />
              Matches
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Lost Items</p>
                      <p className="text-3xl font-bold text-red-600">127</p>
                      <p className="text-xs text-gray-500 mt-1">+12 this week</p>
                    </div>
                    <div className="p-3 bg-red-100 rounded-full">
                      <Package className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Found Items</p>
                      <p className="text-3xl font-bold text-green-600">89</p>
                      <p className="text-xs text-gray-500 mt-1">+8 this week</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Successful Matches</p>
                      <p className="text-3xl font-bold text-blue-600">76</p>
                      <p className="text-xs text-gray-500 mt-1">+5 this week</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Success Rate</p>
                      <p className="text-3xl font-bold text-purple-600">85%</p>
                      <p className="text-xs text-gray-500 mt-1">
                        <TrendingUp className="inline h-3 w-3 mr-1" />
                        +2% from last month
                      </p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <TrendingUp className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <motion.div
                        key={activity.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all duration-200"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center space-x-3">
                          {getActivityIcon(activity.type)}
                          <div>
                            <p className="font-medium text-gray-800">{activity.message}</p>
                            <p className="text-xs text-gray-500 flex items-center mt-1">
                              <Clock className="h-3 w-3 mr-1" />
                              {activity.timestamp}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className={
                          activity.status === 'success' ? 'border-green-300 text-green-700' :
                          activity.status === 'warning' ? 'border-yellow-300 text-yellow-700' :
                          'border-blue-300 text-blue-700'
                        }>
                          {activity.status}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Lost Items Tab */}
          <TabsContent value="lost" className="space-y-6">
            <motion.div 
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-gray-800">Lost Items Management</h2>
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search lost items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="matched">Matched</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction("Refresh Data")}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>

            <motion.div 
              className="grid gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {mockLostItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-l-4 border-l-red-400 hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                            <Badge className={getStatusColor(item.status)}>
                              {item.status}
                            </Badge>
                            <div className={`flex items-center text-xs ${getPriorityColor(item.priority)}`}>
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              {item.priority} priority
                            </div>
                          </div>
                          <p className="text-gray-600 mb-4 leading-relaxed">{item.description}</p>
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2" />
                              {item.location}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              {item.dateReported}
                            </div>
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-2" />
                              {item.reporterName}
                            </div>
                            <div className="flex items-center">
                              <Tag className="h-4 w-4 mr-2" />
                              {item.category}
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <div className="flex items-center">
                                <Eye className="h-3 w-3 mr-1" />
                                {item.views} views
                              </div>
                              {item.matchScore > 0 && (
                                <div className="flex items-center">
                                  <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                                  {item.matchScore}% match found
                                </div>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                onClick={() => handleAction("Contact Reporter", item.id)}
                                disabled={isLoading}
                              >
                                <Mail className="h-4 w-4 mr-2" />
                                Contact
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleAction("Find Matches", item.id)}
                                disabled={isLoading}
                              >
                                <Search className="h-4 w-4 mr-2" />
                                Find Matches
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleAction("Mark Resolved", item.id)}
                                disabled={isLoading}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Resolve
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          {/* Found Items Tab */}
          <TabsContent value="found" className="space-y-6">
            <motion.div 
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-gray-800">Found Items Management</h2>
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search found items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="claimed">Claimed</SelectItem>
                    <SelectItem value="matched">Matched</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction("Refresh Data")}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>

            <motion.div 
              className="grid gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {mockFoundItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-l-4 border-l-green-400 hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                            <Badge className={getStatusColor(item.status)}>
                              {item.status}
                            </Badge>
                            {item.handedToAdmin && (
                              <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                                <Shield className="h-3 w-3 mr-1" />
                                With Security
                              </Badge>
                            )}
                            <div className={`flex items-center text-xs ${getPriorityColor(item.priority)}`}>
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              {item.priority} priority
                            </div>
                          </div>
                          <p className="text-gray-600 mb-4 leading-relaxed">{item.description}</p>
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2" />
                              {item.location}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              {item.dateFound}
                            </div>
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-2" />
                              {item.finderName}
                            </div>
                            <div className="flex items-center">
                              <Tag className="h-4 w-4 mr-2" />
                              {item.category}
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <div className="flex items-center">
                                <Users className="h-3 w-3 mr-1" />
                                {item.claimRequests} claim requests
                              </div>
                              {item.matchScore > 0 && (
                                <div className="flex items-center">
                                  <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                                  {item.matchScore}% match confidence
                                </div>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                onClick={() => handleAction("Contact Finder", item.id)}
                                disabled={isLoading}
                              >
                                <Mail className="h-4 w-4 mr-2" />
                                Contact
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleAction("Find Owner", item.id)}
                                disabled={isLoading}
                              >
                                <Search className="h-4 w-4 mr-2" />
                                Find Owner
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleAction("Mark Returned", item.id)}
                                disabled={isLoading}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Returned
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          {/* Matches Tab */}
          <TabsContent value="matches" className="space-y-6">
            <motion.div 
              className="flex items-center justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-gray-800">Potential Matches</h2>
              <Button 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                onClick={() => handleBulkAction("Run Auto-Match")}
                disabled={isLoading}
              >
                {isLoading ? <Loading size="sm" /> : <Search className="h-4 w-4 mr-2" />}
                Run Auto-Match
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-l-4 border-l-blue-400">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-6">
                        <h3 className="text-xl font-bold text-gray-800">📱 Smartphone Match</h3>
                        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                          95% Confidence
                        </Badge>
                        <Badge variant="outline" className="border-blue-300 text-blue-700">
                          High Priority
                        </Badge>
                      </div>
                      
                      <div className="grid lg:grid-cols-2 gap-6">
                        <motion.div 
                          className="p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200"
                          whileHover={{ scale: 1.02 }}
                        >
                          <h4 className="font-semibold text-red-800 mb-3 flex items-center">
                            <Package className="h-4 w-4 mr-2" />
                            Lost Item
                          </h4>
                          <p className="font-medium text-gray-800 mb-2">iPhone 14 Pro</p>
                          <p className="text-sm text-gray-600 mb-4">Black iPhone with cracked screen protector and blue case</p>
                          <div className="space-y-2 text-xs text-gray-600">
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-2" />
                              Library 3rd floor
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-2" />
                              January 10, 2025
                            </div>
                            <div className="flex items-center">
                              <User className="h-3 w-3 mr-2" />
                              john.doe@university.edu
                            </div>
                          </div>
                        </motion.div>

                        <motion.div 
                          className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200"
                          whileHover={{ scale: 1.02 }}
                        >
                          <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Found Item
                          </h4>
                          <p className="font-medium text-gray-800 mb-2">Black Smartphone</p>
                          <p className="text-sm text-gray-600 mb-4">Black phone with blue case, found at charging station</p>
                          <div className="space-y-2 text-xs text-gray-600">
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-2" />
                              Library charging station
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-2" />
                              January 10, 2025
                            </div>
                            <div className="flex items-center">
                              <Shield className="h-3 w-3 mr-2" />
                              Campus Security
                            </div>
                          </div>
                        </motion.div>
                      </div>

                      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <h5 className="font-medium text-blue-800 mb-2">Match Analysis</h5>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• Location proximity: Same building</li>
                          <li>• Time correlation: Same day</li>
                          <li>• Description similarity: 95% match</li>
                          <li>• Category match: Electronics</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 ml-6">
                      <Button 
                        onClick={() => handleAction("Approve Match", "M001")}
                        className="bg-emerald-600 hover:bg-emerald-700"
                        disabled={isLoading}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve Match
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => handleAction("Reject Match", "M001")}
                        disabled={isLoading}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleAction("Contact Both Parties", "M001")}
                        disabled={isLoading}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Contact Both
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}