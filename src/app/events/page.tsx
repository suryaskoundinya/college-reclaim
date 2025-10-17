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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, MapPin, Users, Plus, Search, Filter, CalendarDays, User } from "lucide-react"
import { toast } from "sonner"
import { CLUBS } from "@/data/clubs"
import { DEPARTMENTS } from "@/data/departments"
import { mockEvents } from "@/data/mockData"
import { BackButton } from "@/components/ui/back-button"

interface Event {
  id: string
  title: string
  description: string
  category: string
  date: string
  time: string
  location: string
  maxParticipants?: number
  club?: string | null
  department?: string | null
  createdAt: string
  organizer: {
    id: string
    name: string
    email: string
    image?: string
  }
  _count: {
    interests: number
  }
  isInterestedByUser?: boolean
}

const EVENT_CATEGORIES = [
  { value: 'TECHNICAL', label: '💻 Technical', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
  { value: 'CULTURAL', label: '🎭 Cultural', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' },
  { value: 'SPORTS', label: '⚽ Sports', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
  { value: 'ACADEMIC', label: '📚 Academic', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
  { value: 'SOCIAL', label: '👥 Social', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300' },
  { value: 'WORKSHOP', label: '🔧 Workshop', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300' },
  { value: 'SEMINAR', label: '🎤 Seminar', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' },
  { value: 'OTHER', label: '📌 Other', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300' }
]

export default function EventsPage() {
  const { data: session, status } = useSession()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClub, setSelectedClub] = useState("all")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [filterUpcoming, setFilterUpcoming] = useState(false)

  useEffect(() => {
    fetchEvents()
  }, [searchTerm, selectedClub, selectedDepartment, selectedCategory, filterUpcoming])

  const fetchEvents = async () => {
    // Simulate API loading delay for demo purposes
    setLoading(true)
    setTimeout(() => {
      filterEvents()
      setLoading(false)
    }, 500)
  }

  const filterEvents = () => {
    let filtered = [...mockEvents]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply club filter
    if (selectedClub && selectedClub !== "all") {
      filtered = filtered.filter(event => event.club === selectedClub)
    }

    // Apply department filter
    if (selectedDepartment && selectedDepartment !== "all") {
      filtered = filtered.filter(event => event.department === selectedDepartment)
    }

    // Apply category filter
    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter(event => event.category === selectedCategory)
    }

    // Apply upcoming filter
    if (filterUpcoming) {
      const now = new Date()
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date)
        return eventDate >= now
      })
    }

    setEvents(filtered)
  }

  const handleShowInterest = async (eventId: string) => {
    if (status !== "authenticated") {
      toast.error("Please sign in to show interest in events")
      return
    }

    try {
      const response = await fetch(`/api/events/${eventId}/interest`, {
        method: 'POST'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update interest')
      }

      const data = await response.json()
      
      // Update local state
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === eventId 
            ? { 
                ...event, 
                isInterestedByUser: data.isInterested,
                _count: { 
                  ...event._count, 
                  interests: event._count.interests + (data.isInterested ? 1 : -1)
                }
              }
            : event
        )
      )

      toast.success(data.isInterested ? "Interest added!" : "Interest removed!")
      
    } catch (error) {
      console.error('Error updating interest:', error)
      toast.error(error instanceof Error ? error.message : "Failed to update interest")
    }
  }

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  const isEventPassed = (dateString: string, timeString: string) => {
    const eventDateTime = new Date(`${dateString}T${timeString}`)
    return eventDateTime < new Date()
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedClub("all")
    setSelectedDepartment("all")
    setSelectedCategory("all")
    setFilterUpcoming(false)
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <BackButton showHomeButton showBackButton className="mb-4" />
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl">
                <CalendarDays className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Campus Events
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Discover and join exciting events happening around campus
                </p>
              </div>
            </div>
            
            {status === "authenticated" && (
              <Link href="/events/new">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Event
                </Button>
              </Link>
            )}
          </div>

          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Button
                variant="outline"
                onClick={clearFilters}
                className="px-6"
              >
                <Filter className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {EVENT_CATEGORIES.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedClub} onValueChange={setSelectedClub}>
                <SelectTrigger>
                  <SelectValue placeholder="All Clubs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clubs</SelectItem>
                  {CLUBS.map((club: string) => (
                    <SelectItem key={club} value={club}>
                      {club}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {DEPARTMENTS.map((dept: string) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterUpcoming ? "upcoming" : "all"} onValueChange={(value) => setFilterUpcoming(value === "upcoming")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="upcoming">Upcoming Events</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <CalendarDays className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No events found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchTerm || selectedClub || selectedDepartment || selectedCategory
                ? "Try adjusting your filters to find more events."
                : "Be the first to create an event for your college community!"}
            </p>
            {status === "authenticated" && (
              <Link href="/events/new">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Event
                </Button>
              </Link>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => {
              const isPassed = isEventPassed(event.date, event.time)
              const categoryInfo = EVENT_CATEGORIES.find(cat => cat.value === selectedCategory) || EVENT_CATEGORIES[EVENT_CATEGORIES.length - 1]
              
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`h-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${isPassed ? 'opacity-75' : ''}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between mb-2">
                        <Badge className={categoryInfo.color}>
                          {categoryInfo.label}
                        </Badge>
                        {isPassed && (
                          <Badge variant="secondary">Past Event</Badge>
                        )}
                      </div>
                      
                      <CardTitle className="text-lg font-semibold line-clamp-2 mb-2">
                        {event.title}
                      </CardTitle>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                        {event.description}
                      </p>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {/* Date and Time */}
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <span>{formatEventDate(event.date)}</span>
                          <Clock className="w-4 h-4 text-blue-500 ml-2" />
                          <span>{event.time}</span>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-red-500" />
                          <span className="truncate">{event.location}</span>
                        </div>

                        {/* Club/Department */}
                        {(event.club || event.department) && (
                          <div className="flex items-center gap-2 text-sm">
                            <div className="w-4 h-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full"></div>
                            <span className="truncate">
                              {event.club || event.department}
                            </span>
                          </div>
                        )}

                        {/* Organizer */}
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={event.organizer.image} />
                            <AvatarFallback>
                              {event.organizer.name?.charAt(0) || <User className="w-3 h-3" />}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-gray-600 dark:text-gray-300 truncate">
                            by {event.organizer.name}
                          </span>
                        </div>

                        {/* Participants and Actions */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Users className="w-4 h-4" />
                            <span>{event._count.interests} interested</span>
                            {event.maxParticipants && (
                              <span>/ {event.maxParticipants} max</span>
                            )}
                          </div>

                          <div className="flex gap-2">
                            {status === "authenticated" && !isPassed && (
                              <Button
                                size="sm"
                                variant={event.isInterestedByUser ? "default" : "outline"}
                                onClick={() => handleShowInterest(event.id)}
                                className={event.isInterestedByUser ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" : ""}
                              >
                                {event.isInterestedByUser ? "Interested" : "Show Interest"}
                              </Button>
                            )}
                            
                            <Link href={`/events/${event.id}`}>
                              <Button size="sm" variant="outline">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}