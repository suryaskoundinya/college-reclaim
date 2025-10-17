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
import { ArrowLeft, CalendarDays, Clock, MapPin, Users, User, Edit3, Trash2, Share2, Heart } from "lucide-react"
import { toast } from "sonner"

interface Event {
  id: string
  title: string
  description: string
  category: string
  date: string
  time: string
  location: string
  maxParticipants?: number
  club?: string
  department?: string
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

interface EventInterest {
  id: string
  createdAt: string
  user: {
    id: string
    name: string
    email: string
    image?: string
  }
}

const EVENT_CATEGORIES = {
  TECHNICAL: { label: '💻 Technical', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
  CULTURAL: { label: '🎭 Cultural', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' },
  SPORTS: { label: '⚽ Sports', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
  ACADEMIC: { label: '📚 Academic', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
  SOCIAL: { label: '👥 Social', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300' },
  WORKSHOP: { label: '🔧 Workshop', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300' },
  SEMINAR: { label: '🎤 Seminar', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' },
  OTHER: { label: '📌 Other', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300' }
}

export default function EventDetailsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const [event, setEvent] = useState<Event | null>(null)
  const [interests, setInterests] = useState<EventInterest[]>([])
  const [loading, setLoading] = useState(true)

  const eventId = params.id as string

  useEffect(() => {
    if (status === "loading") return
    
    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }

    fetchEvent()
  }, [status, eventId])

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}`)
      if (!response.ok) {
        if (response.status === 404) {
          router.push("/events")
          toast.error("Event not found")
          return
        }
        throw new Error('Failed to fetch event')
      }

      const data = await response.json()
      setEvent(data.event)
      setInterests(data.interests || [])
    } catch (error) {
      console.error('Error fetching event:', error)
      toast.error("Failed to load event details")
    } finally {
      setLoading(false)
    }
  }

  const handleShowInterest = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}/interest`, {
        method: 'POST'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update interest')
      }

      const data = await response.json()
      
      // Update event state
      setEvent(prev => prev ? {
        ...prev,
        isInterestedByUser: data.isInterested,
        _count: {
          ...prev._count,
          interests: prev._count.interests + (data.isInterested ? 1 : -1)
        }
      } : null)

      toast.success(data.isInterested ? "Interest added!" : "Interest removed!")
      
      // Refresh interests list
      fetchEvent()
      
    } catch (error) {
      console.error('Error updating interest:', error)
      toast.error(error instanceof Error ? error.message : "Failed to update interest")
    }
  }

  const handleDeleteEvent = async () => {
    if (!confirm("Are you sure you want to delete this event?")) return

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete event')
      }

      toast.success("Event deleted successfully")
      router.push("/events")
      
    } catch (error) {
      console.error('Error deleting event:', error)
      toast.error("Failed to delete event")
    }
  }

  const handleShareEvent = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event?.title,
          text: `Join me at ${event?.title} on ${event?.date}`,
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

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':')
    const date = new Date()
    date.setHours(parseInt(hours), parseInt(minutes))
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const isEventPassed = () => {
    if (!event) return false
    const eventDateTime = new Date(`${event.date}T${event.time}`)
    return eventDateTime < new Date()
  }

  const isEventFull = () => {
    if (!event || !event.maxParticipants) return false
    return event._count.interests >= event.maxParticipants
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <CalendarDays className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Event not found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">The event you're looking for doesn't exist or has been removed.</p>
          <Link href="/events">
            <Button>Back to Events</Button>
          </Link>
        </div>
      </div>
    )
  }

  const isOrganizer = session?.user?.id === event.organizer.id
  const categoryInfo = EVENT_CATEGORIES[event.category as keyof typeof EVENT_CATEGORIES] || EVENT_CATEGORIES.OTHER
  const eventPassed = isEventPassed()
  const eventFull = isEventFull()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link href="/events" className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="shadow-xl border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge className={categoryInfo.color}>
                          {categoryInfo.label}
                        </Badge>
                        {eventPassed && (
                          <Badge variant="secondary">Past Event</Badge>
                        )}
                        {eventFull && !eventPassed && (
                          <Badge variant="destructive">Full</Badge>
                        )}
                      </div>

                      <CardTitle className="text-2xl font-bold mb-4">{event.title}</CardTitle>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="w-5 h-5 text-purple-600" />
                          <span className="font-medium">{formatEventDate(event.date)}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-purple-600" />
                          <span className="font-medium">{formatTime(event.time)}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-purple-600" />
                          <span className="font-medium">{event.location}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-purple-600" />
                          <span className="font-medium">
                            {event._count.interests} interested
                            {event.maxParticipants && ` / ${event.maxParticipants} max`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleShareEvent}
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                      
                      {isOrganizer && (
                        <>
                          <Link href={`/events/${eventId}/edit`}>
                            <Button variant="outline" size="sm">
                              <Edit3 className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleDeleteEvent}
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
                      <h3 className="font-semibold mb-2">About this event</h3>
                      <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                        {event.description}
                      </p>
                    </div>

                    {(event.club || event.department) && (
                      <div>
                        <h3 className="font-semibold mb-2">Organizers</h3>
                        <div className="flex flex-wrap gap-2">
                          {event.club && (
                            <Badge variant="outline" className="text-purple-600 border-purple-300">
                              {event.club}
                            </Badge>
                          )}
                          {event.department && (
                            <Badge variant="outline" className="text-indigo-600 border-indigo-300">
                              {event.department}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Event created on {new Date(event.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Organizer Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Event Organizer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={event.organizer.image} />
                      <AvatarFallback>
                        {event.organizer.name?.charAt(0) || <User className="w-6 h-6" />}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{event.organizer.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{event.organizer.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Action Button */}
            {!isOrganizer && !eventPassed && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button 
                  onClick={handleShowInterest}
                  disabled={eventFull && !event.isInterestedByUser}
                  className={`w-full ${
                    event.isInterestedByUser 
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  }`}
                >
                  <Heart className={`w-4 h-4 mr-2 ${event.isInterestedByUser ? 'fill-current' : ''}`} />
                  {event.isInterestedByUser ? 'Interested' : eventFull ? 'Event Full' : 'Show Interest'}
                </Button>
              </motion.div>
            )}

            {/* Interested People */}
            {interests.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">Interested People ({interests.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {interests.map((interest) => (
                        <div key={interest.id} className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={interest.user.image} />
                            <AvatarFallback>
                              {interest.user.name?.charAt(0) || <User className="w-4 h-4" />}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{interest.user.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Interested on {new Date(interest.createdAt).toLocaleDateString()}
                            </p>
                          </div>
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