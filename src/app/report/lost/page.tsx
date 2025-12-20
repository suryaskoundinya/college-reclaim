"use client"

import { useState, useRef } from "react"
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
import { AlertCircle, MapPin, Upload, X } from "lucide-react"
import { toast } from "sonner"
import { locations } from "@/data/locations"

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
    locationSelect: "",
    customLocation: "",
    location: "",
    dateLost: ""
  })
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate location
    const finalLocation = formData.locationSelect === "other" ? formData.customLocation : formData.locationSelect
    if (!formData.title || !formData.category || !formData.description || !finalLocation || !formData.dateLost) {
      toast.error("Please fill in all required fields")
      return
    }
    
    if (formData.locationSelect === "other" && !formData.customLocation.trim()) {
      toast.error("Please specify the location")
      return
    }

    setIsSubmitting(true)
    
    try {
      // Upload image if exists
      let imageUrl = undefined
      if (uploadedFiles.length > 0) {
        const formDataUpload = new FormData()
        formDataUpload.append('file', uploadedFiles[0])
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formDataUpload,
        })
        
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json()
          imageUrl = uploadData.url
        }
      }
      
      const dateTime = formData.dateLost + 'T00:00:00Z'
      const finalLocation = formData.locationSelect === "other" ? formData.customLocation : formData.locationSelect
      
      const response = await fetch('/api/lost-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          location: finalLocation,
          dateLost: dateTime,
          imageUrl: imageUrl,
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
        locationSelect: "",
        customLocation: "",
        location: "",
        dateLost: ""
      })
      setUploadedFiles([])
      
      setTimeout(() => {
        window.location.href = "/search"
      }, 1500)
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to report item")
    } finally {
      setIsSubmitting(false)
    }
  }
const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const fileArray = Array.from(files)
      if (uploadedFiles.length + fileArray.length > 3) {
        toast.error("You can upload maximum 3 images")
        return
      }
      setUploadedFiles(prev => [...prev, ...fileArray])
      toast.success(`${fileArray.length} file(s) uploaded successfully`)
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
    toast.success("File removed")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-pink-50 dark:from-red-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <BackButton />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <Card className="shadow-2xl border-2 border-red-200 dark:border-red-900/30 bg-white dark:bg-gray-900">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="text-3xl font-bold flex items-center gap-3 text-red-600 dark:text-red-400">
                <AlertCircle className="h-8 w-8" />
                Report Lost Item
              </CardTitle>
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
                  <Label htmlFor="locationSelect" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Location Where Lost *
                  </Label>
                  <Select 
                    value={formData.locationSelect} 
                    onValueChange={(value) => setFormData({...formData, locationSelect: value, customLocation: value !== "other" ? "" : formData.customLocation})}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {locations.map((loc) => (
                        <SelectItem key={loc.id} value={loc.id}>
                          {loc.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {formData.locationSelect === "other" && (
                    <div className="relative mt-3">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="customLocation"
                        placeholder="Please specify the location"
                        value={formData.customLocation}
                        onChange={(e) => setFormData({...formData, customLocation: e.target.value})}
                        className="pl-10 h-11"
                        required
                      />
                    </div>
                  )}
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

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Upload Image (Optional)
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 hover:border-red-400 dark:hover:border-red-500 transition-colors">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      multiple
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Image
                    </Button>
                    {uploadedFiles.length > 0 && (
                      <div className="mt-3 grid grid-cols-2 gap-3">
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="w-full h-32 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeFile(index)}
                              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">{file.name}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">Max 3 images, 10MB each</p>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-12 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 dark:from-red-700 dark:to-rose-700 dark:hover:from-red-800 dark:hover:to-rose-800 text-white font-semibold text-lg shadow-lg"
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
