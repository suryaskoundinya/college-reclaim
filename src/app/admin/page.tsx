"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Shield, Mail, Trash2, BookOpen, Package, 
  Calendar, UserCheck, ThumbsUp, ThumbsDown,
  Moon, Sun, Home, LogOut, RefreshCw
} from "lucide-react"
import { toast } from "sonner"
import { useTheme } from "@/components/providers"

export default function AdminDashboard() {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const [activeTab, setActiveTab] = useState("books")
  const [isLoading, setIsLoading] = useState(false)
  const [coordinatorRequests, setCoordinatorRequests] = useState<any[]>([])
  const [books, setBooks] = useState<any[]>([])
  const [lostItems, setLostItems] = useState<any[]>([])
  const [foundItems, setFoundItems] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  
  // Notification form
  const [notificationSubject, setNotificationSubject] = useState("")
  const [notificationMessage, setNotificationMessage] = useState("")
  const [recipientEmail, setRecipientEmail] = useState("")
  const [sendToAll, setSendToAll] = useState(true)

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    try {
      if (activeTab === "coordinators") {
        const res = await fetch("/api/coordinator-requests")
        const data = await res.json()
        setCoordinatorRequests(data.requests || [])
      } else if (activeTab === "books") {
        const res = await fetch("/api/books")
        const data = await res.json()
        setBooks(Array.isArray(data) ? data : data.books || data.items || [])
      } else if (activeTab === "lost") {
        const res = await fetch("/api/lost-items")
        const data = await res.json()
        setLostItems(Array.isArray(data) ? data : data.items || data.lostItems || [])
      } else if (activeTab === "found") {
        const res = await fetch("/api/found-items")
        const data = await res.json()
        setFoundItems(Array.isArray(data) ? data : data.items || data.foundItems || [])
      } else if (activeTab === "events") {
        const res = await fetch("/api/events")
        const data = await res.json()
        setEvents(Array.isArray(data) ? data : data.events || [])
      } else if (activeTab === "notify") {
        const res = await fetch("/api/admin/users")
        const data = await res.json()
        setUsers(data.users || [])
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  const handleDelete = async (type: string, id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return
    
    setIsLoading(true)
    try {
      const endpoint = type === "book" ? `/api/admin/books/${id}` 
        : type === "lost" ? `/api/admin/lost-items/${id}`
        : type === "found" ? `/api/admin/found-items/${id}`
        : `/api/admin/events/${id}`
      
      const res = await fetch(endpoint, { method: "DELETE" })
      
      if (res.ok) {
        toast.success("Item deleted successfully")
        fetchData()
      } else {
        toast.error("Failed to delete item")
      }
    } catch (error) {
      toast.error("Error deleting item")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCoordinatorAction = async (requestId: string, action: "approve" | "reject") => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/coordinator-requests/${requestId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action })
      })

      const data = await res.json()

      if (res.ok) {
        if (action === "approve" && data.emailSent === false) {
          // Email failed, show warning with OTP
          toast.warning(
            `Request approved but email failed! Manually send this setup code to ${data.email}: ${data.otp}`,
            { duration: 10000 }
          )
        } else {
          toast.success(data.message || `Request ${action}d successfully`)
        }
        fetchData()
      } else {
        console.error(`Failed to ${action} request:`, data)
        toast.error(data.error || `Failed to ${action} request`)
      }
    } catch (error) {
      console.error("Error processing request:", error)
      toast.error("Error processing request")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendNotification = async () => {
    if (!notificationSubject || !notificationMessage) {
      toast.error("Please enter subject and message")
      return
    }
    
    if (!sendToAll && !recipientEmail) {
      toast.error("Please select a recipient")
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/admin/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          subject: notificationSubject, 
          message: notificationMessage,
          recipientEmail: sendToAll ? null : recipientEmail
        })
      })
      
      const data = await res.json()
      
      if (res.ok) {
        toast.success(data.message || "Notification sent successfully!")
        setNotificationSubject("")
        setNotificationMessage("")
        setRecipientEmail("")
      } else {
        toast.error(data.error || "Failed to send notification")
      }
    } catch (error) {
      console.error("Error sending notification:", error)
      toast.error("Failed to send notification")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b-2 border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="text-white w-6 h-6" />
              </div>
              <div>
                <span className="font-bold text-xl text-gray-900 dark:text-white">College Reclaim</span>
                <Badge className="ml-2 bg-purple-600 text-white border-0">Admin</Badge>
              </div>
            </Link>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleTheme}
                className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => router.push("/auth/signin")}
                className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-700 dark:text-gray-300">Manage books, found items, events, and coordinators</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 p-1">
            <TabsTrigger 
              value="books" 
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-900 dark:text-white font-medium"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Books
            </TabsTrigger>
            <TabsTrigger 
              value="lost"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-900 dark:text-white font-medium"
            >
              <Package className="h-4 w-4 mr-2" />
              Lost Items
            </TabsTrigger>
            <TabsTrigger 
              value="found"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-900 dark:text-white font-medium"
            >
              <Package className="h-4 w-4 mr-2" />
              Found Items
            </TabsTrigger>
            <TabsTrigger 
              value="events"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-900 dark:text-white font-medium"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Events
            </TabsTrigger>
            <TabsTrigger 
              value="coordinators"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-900 dark:text-white font-medium relative"
            >
              <UserCheck className="h-4 w-4 mr-2" />
              Coordinators
              {coordinatorRequests.filter(r => r.status === "PENDING").length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {coordinatorRequests.filter(r => r.status === "PENDING").length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="notifications"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-900 dark:text-white font-medium"
            >
              <Mail className="h-4 w-4 mr-2" />
              Notify
            </TabsTrigger>
          </TabsList>

          {/* Books Tab */}
          <TabsContent value="books">
            <Card className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Manage Books</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {!Array.isArray(books) || books.length === 0 ? (
                    <p className="text-center py-8 text-gray-700 dark:text-gray-300">No books listed</p>
                  ) : (
                    books.map((book: any) => (
                      <motion.div
                        key={book.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{book.title}</h3>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{book.author}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {book.type} • ₹{book.price} • {book.condition}
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete("book", book.id)}
                          disabled={isLoading}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </motion.div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Lost Items Tab */}
          <TabsContent value="lost">
            <Card className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Manage Lost Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {!Array.isArray(lostItems) || lostItems.length === 0 ? (
                    <p className="text-center py-8 text-gray-700 dark:text-gray-300">No lost items</p>
                  ) : (
                    lostItems.map((item: any) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{item.title}</h3>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{item.description}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {item.category} • {item.location} • {new Date(item.dateLost).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete("lost", item.id)}
                          disabled={isLoading}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </motion.div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Found Items Tab */}
          <TabsContent value="found">
            <Card className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Manage Found Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {!Array.isArray(foundItems) || foundItems.length === 0 ? (
                    <p className="text-center py-8 text-gray-700 dark:text-gray-300">No found items</p>
                  ) : (
                    foundItems.map((item: any) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{item.title}</h3>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{item.description}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {item.category} • {item.location} • {new Date(item.dateFound).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete("found", item.id)}
                          disabled={isLoading}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </motion.div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events">
            <Card className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Manage Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {!Array.isArray(events) || events.length === 0 ? (
                    <p className="text-center py-8 text-gray-700 dark:text-gray-300">No events</p>
                  ) : (
                    events.map((event: any) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{event.title}</h3>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{event.description}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {event.clubOrDept} • {event.venue} • {new Date(event.date).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete("event", event.id)}
                          disabled={isLoading}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </motion.div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Coordinators Tab */}
          <TabsContent value="coordinators">
            <Card className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-gray-900 dark:text-white">Coordinator Requests</CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={fetchData}
                  disabled={isLoading}
                  className="ml-auto"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {!Array.isArray(coordinatorRequests) || coordinatorRequests.length === 0 ? (
                    <p className="text-center py-8 text-gray-700 dark:text-gray-300">No coordinator requests</p>
                  ) : (
                    coordinatorRequests.map((request: any) => (
                      <motion.div
                        key={request.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`p-4 border-2 rounded-lg ${
                          request.status === "PENDING" 
                            ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20" 
                            : request.status === "APPROVED"
                            ? "border-green-400 bg-green-50 dark:bg-green-900/20"
                            : "border-red-400 bg-red-50 dark:bg-red-900/20"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{request.name}</h3>
                              <Badge className={
                                request.status === "PENDING"
                                  ? "bg-yellow-600 text-white border-0"
                                  : request.status === "APPROVED"
                                  ? "bg-green-600 text-white border-0"
                                  : "bg-red-600 text-white border-0"
                              }>
                                {request.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-1"><strong>Email:</strong> {request.email}</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-1"><strong>Department:</strong> {request.department}</p>
                            {request.phoneNumber && (
                              <p className="text-sm text-gray-700 dark:text-gray-300 mb-1"><strong>Phone:</strong> {request.phoneNumber}</p>
                            )}
                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-2"><strong>Message:</strong> {request.message}</p>
                          </div>
                          {request.status === "PENDING" && (
                            <div className="flex flex-col space-y-2 ml-4">
                              <Button
                                size="sm"
                                onClick={() => handleCoordinatorAction(request.id, "approve")}
                                disabled={isLoading}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <ThumbsUp className="w-4 h-4 mr-2" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleCoordinatorAction(request.id, "reject")}
                                disabled={isLoading}
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                <ThumbsDown className="w-4 h-4 mr-2" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Send Email Notification</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Send to All or Specific User Toggle */}
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={sendToAll}
                        onChange={() => { setSendToAll(true); setRecipientEmail("") }}
                        className="w-4 h-4 text-purple-600"
                      />
                      <span className="text-gray-900 dark:text-white font-medium">Send to All Users</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={!sendToAll}
                        onChange={() => setSendToAll(false)}
                        className="w-4 h-4 text-purple-600"
                      />
                      <span className="text-gray-900 dark:text-white font-medium">Send to Specific User</span>
                    </label>
                  </div>

                  {/* Recipient Selection */}
                  {!sendToAll && (
                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Recipient Email Address
                      </label>
                      <Input
                        type="email"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        placeholder="Enter recipient email address..."
                        className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Subject
                    </label>
                    <Input
                      value={notificationSubject}
                      onChange={(e) => setNotificationSubject(e.target.value)}
                      placeholder="Enter email subject..."
                      className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Message
                    </label>
                    <Textarea
                      value={notificationMessage}
                      onChange={(e) => setNotificationMessage(e.target.value)}
                      placeholder="Enter your message..."
                      rows={6}
                      className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  {users.length > 0 && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-md">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>Total Users in Database:</strong> {users.length}
                        {sendToAll && <span className="ml-2">(All will receive this email)</span>}
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={handleSendNotification}
                    disabled={isLoading}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    {sendToAll ? "Send to All Users" : "Send to Selected User"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}



