"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loading } from "@/components/ui/loading"
import { Navbar } from "@/components/navbar"
import { BackButton } from "@/components/ui/back-button"
import { AlertCircle, MapPin } from "lucide-react"
import { toast } from "sonner"

const categories = [
  { value: "ELECTRONICS", label: "Electronics", icon: "📱" },
  { value: "BOOK", label: "Books & Notebooks", icon: "📚" },
  { value: "ID_CARD", label: "ID Cards & Documents", icon: "🆔" },
  { value: "ACCESSORIES", label: "Accessories & Jewelry", icon: "💍" },
  { value: "CLOTHING", label: "Clothing & Shoes", icon: "👕" },
  { value: "KEYS", label: "Keys & Keychains", icon: "🔑" },
  { value: "BAGS", label: "Bags & Backpacks", icon: "🎒" },
  { value: "SPORTS", label: "Sports Equipment", icon: "⚽" },
  { value: "OTHER", label: "Other Items", icon: "📦" }
]

export default function ReportLost() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    dateLost: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.category || !formData.description || !formData.location || !formData.dateLost) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    
    try {
      const dateTime = formData.dateLost + 'T00:00:00Z'
      
      const response = await fetch('/api/lost-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          location: formData.location,
          dateLost: dateTime,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to report item')
      }
      
      toast.success("Lost item reported successfully!", {
        duration: 5000,
      })
      
      setFormData({
        title: "",
        description: "",
        category: "",
        location: "",
        dateLost: ""
      })
      
      setTimeout(() => {
        window.location.href = "/search"
      }, 1500)
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to report item")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <BackButton />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <Card className="shadow-2xl border-2 border-red-100 dark:border-red-900/50">
            <CardHeader className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <AlertCircle className="h-6 w-6" />
                Report Lost Item
              </CardTitle>
              <p className="text-red-100 text-sm mt-2">Help us find your lost item by providing the details below</p>
            </CardHeader>
            
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Item Name */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Item Name *
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g., iPhone 14, Blue Backpack, Student ID"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="h-11"
                    required
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Category *
                  </Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.icon} {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the item in detail (color, brand, distinctive features...)"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={4}
                    className="resize-none"
                    required
                  />
                  <p className="text-xs text-gray-500">Minimum 10 characters</p>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Location Where Lost *
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="location"
                      placeholder="e.g., Library 3rd Floor, Cafeteria, Parking Lot"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="pl-10 h-11"
                      required
                    />
                  </div>
                </div>

                {/* Date Lost */}
                <div className="space-y-2">
                  <Label htmlFor="dateLost" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Date Lost *
                  </Label>
                  <Input
                    id="dateLost"
                    type="date"
                    value={formData.dateLost}
                    onChange={(e) => setFormData({...formData, dateLost: e.target.value})}
                    max={new Date().toISOString().split('T')[0]}
                    className="h-11"
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-12 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold text-lg shadow-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loading size="sm" />
                        Submitting...
                      </>
                    ) : (
                      "Report Lost Item"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
