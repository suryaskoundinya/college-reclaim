"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Loading } from "@/components/ui/loading"
import { Navbar } from "@/components/navbar"
import { BackButton } from "@/components/ui/back-button"
import { ArrowLeft, Upload, Camera, MapPin, Clock, AlertCircle, CheckCircle, Trash2, Eye, EyeOff, DollarSign } from "lucide-react"
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

const commonLocations = [
  "Central Library",
  "Student Center",
  "Engineering Building",
  "Science Building",
  "Business Building",
  "Arts Building",
  "Cafeteria/Food Court",
  "Gym/Sports Complex",
  "Dormitory/Residence Hall",
  "Parking Lot",
  "Campus Quad",
  "Computer Lab",
  "Lecture Hall",
  "Other"
]

export default function ReportLost() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    specificLocation: "",
    dateLost: "",
    timeLost: "",
    contactInfo: "",
    email: "",
    phone: "",
    reward: "",
    isUrgent: false,
    agreeToTerms: false,
    isAnonymous: false
  })

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState(1)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const fileArray = Array.from(files)
      if (uploadedFiles.length + fileArray.length > 5) {
        toast.error("You can upload maximum 5 images")
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.agreeToTerms) {
      toast.error("Please agree to the terms and conditions")
      return
    }

    setIsSubmitting(true)
    
    try {
      // Combine date and time with Z suffix for UTC timezone
      const dateTime = formData.dateLost + (formData.timeLost ? 'T' + formData.timeLost : 'T00:00:00') + 'Z'
      
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
      
      const response = await fetch('/api/lost-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          location: formData.specificLocation || formData.location,
          dateLost: dateTime,
          imageUrl: imageUrl,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to report item')
      }
      
      toast.success("Lost item reported successfully! We'll notify you if we find any matches.", {
        duration: 5000,
        action: {
          label: "View Report",
          onClick: () => window.location.href = "/search"
        }
      })
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        location: "",
        specificLocation: "",
        dateLost: "",
        timeLost: "",
        contactInfo: "",
        email: "",
        phone: "",
        reward: "",
        isUrgent: false,
        agreeToTerms: false,
        isAnonymous: false
      })
      setUploadedFiles([])
      setStep(1)
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to report item. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (step === 1 && (!formData.title || !formData.category || !formData.description)) {
      toast.error("Please fill in all required fields")
      return
    }
    if (step === 2 && (!formData.location || !formData.dateLost)) {
      toast.error("Please provide location and date information")
      return
    }
    setStep(step + 1)
  }

  const prevStep = () => setStep(step - 1)

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden transition-colors duration-300">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <BackButton showHomeButton showBackButton className="mb-6" />
          
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-6xl mb-4"
            >
              😢
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Report a Lost Item
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto transition-colors duration-300">
              Provide detailed information to help our community identify and return your lost item
            </p>
          </div>

          {/* Progress Bar */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                    step >= stepNumber 
                      ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}>
                    {stepNumber < step ? <CheckCircle className="h-5 w-5" /> : stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div className={`w-16 h-2 mx-2 rounded-full transition-all duration-300 ${
                      step > stepNumber ? 'bg-gradient-to-r from-red-500 to-pink-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-2xl border border-white/20 dark:border-gray-700/20 transition-colors duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-center">
                {step === 1 && "Item Details"}
                {step === 2 && "Location & Time"}
                {step === 3 && "Contact & Additional Info"}
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400 text-center text-sm transition-colors duration-300">
                Step {step} of 3
              </p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1: Item Details */}
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-sm font-medium">
                        Item Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="title"
                        type="text"
                        placeholder="e.g., iPhone 14 Pro, Blue Jansport Backpack, Calculus Textbook"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="h-11"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-sm font-medium">
                        Category <span className="text-red-500">*</span>
                      </Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select the type of item you lost" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category.value} value={category.value}>
                              <span className="flex items-center gap-2">
                                <span>{category.icon}</span>
                                {category.label}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-sm font-medium">
                        Detailed Description <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your item in detail: color, brand, size, model, distinctive features, any unique identifiers, etc. The more details you provide, the easier it will be to identify your item."
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        rows={5}
                        className="resize-none"
                        minLength={10}
                        required
                      />
                      <p className={`text-xs ${formData.description.length < 10 ? 'text-red-500' : 'text-gray-500'}`}>
                        {formData.description.length}/500 characters (minimum 10 required)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Upload Photos (Optional)</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-violet-400 transition-colors duration-200">
                        <Camera className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-sm text-gray-600 mb-3">
                          Photos help others identify your item more easily
                        </p>
                        <p className="text-xs text-gray-500 mb-4">
                          Maximum 5 images, 10MB each. Supported formats: JPG, PNG, WebP
                        </p>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => fileInputRef.current?.click()}
                          className="hover:border-violet-400 hover:text-violet-600"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Choose Files
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </div>
                      
                      {/* Uploaded Files Preview */}
                      {uploadedFiles.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mt-4">
                          {uploadedFiles.map((file, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                                <img 
                                  src={URL.createObjectURL(file)} 
                                  alt={`Upload ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{file.name}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
                {/* Step 2: Location & Time */}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-sm font-medium">
                          General Location <span className="text-red-500">*</span>
                        </Label>
                        <Select value={formData.location} onValueChange={(value) => setFormData({...formData, location: value})}>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select general area" />
                          </SelectTrigger>
                          <SelectContent>
                            {commonLocations.map(location => (
                              <SelectItem key={location} value={location}>
                                <span className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-violet-500" />
                                  {location}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="specificLocation" className="text-sm font-medium">
                          Specific Location
                        </Label>
                        <Input
                          id="specificLocation"
                          type="text"
                          placeholder="e.g., 3rd floor study area, Room 205"
                          value={formData.specificLocation}
                          onChange={(e) => setFormData({...formData, specificLocation: e.target.value})}
                          className="h-11"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dateLost" className="text-sm font-medium">
                          Date Lost <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="dateLost"
                          type="date"
                          value={formData.dateLost}
                          onChange={(e) => setFormData({...formData, dateLost: e.target.value})}
                          className="h-11"
                          max={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="timeLost" className="text-sm font-medium">
                          Approximate Time
                        </Label>
                        <Input
                          id="timeLost"
                          type="time"
                          value={formData.timeLost}
                          onChange={(e) => setFormData({...formData, timeLost: e.target.value})}
                          className="h-11"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Additional Options</Label>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="isUrgent" 
                            checked={formData.isUrgent}
                            onCheckedChange={(checked) => setFormData({...formData, isUrgent: checked as boolean})}
                          />
                          <Label htmlFor="isUrgent" className="text-sm font-normal flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-red-500" />
                            Mark as urgent (contains important documents, keys, etc.)
                          </Label>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="reward" className="text-sm font-medium flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-500" />
                            Reward Offered (Optional)
                          </Label>
                          <Input
                            id="reward"
                            type="text"
                            placeholder="e.g., $50, Coffee and donuts, etc."
                            value={formData.reward}
                            onChange={(e) => setFormData({...formData, reward: e.target.value})}
                            className="h-11"
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400">Offering a reward may increase the chances of recovery</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Contact Info */}
                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Contact Information</Label>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="isAnonymous" 
                            checked={formData.isAnonymous}
                            onCheckedChange={(checked) => setFormData({...formData, isAnonymous: checked as boolean})}
                          />
                          <Label htmlFor="isAnonymous" className="text-sm font-normal flex items-center gap-2">
                            {formData.isAnonymous ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            Post anonymously
                          </Label>
                        </div>
                      </div>
                      
                      {!formData.isAnonymous && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">
                              Email <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="your.email@university.edu"
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                              className="h-11"
                              required={!formData.isAnonymous}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm font-medium">
                              Phone Number (Optional)
                            </Label>
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="(555) 123-4567"
                              value={formData.phone}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                              className="h-11"
                            />
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="contactInfo" className="text-sm font-medium">
                          Additional Contact Info (Optional)
                        </Label>
                        <Textarea
                          id="contactInfo"
                          placeholder="Any additional contact information or special instructions for return..."
                          value={formData.contactInfo}
                          onChange={(e) => setFormData({...formData, contactInfo: e.target.value})}
                          rows={3}
                          className="resize-none"
                        />
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700/50 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-blue-800 dark:text-blue-200">
                          <p className="font-medium mb-2">Privacy & Safety Notice</p>
                          <ul className="space-y-1 text-xs">
                            <li>• Your contact information will only be shared with verified users who claim to have found your item</li>
                            <li>• We recommend meeting in public campus locations for item exchanges</li>
                            <li>• Report any suspicious activity to campus security</li>
                            <li>• You can edit or remove your listing at any time</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="agreeToTerms" 
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) => setFormData({...formData, agreeToTerms: checked as boolean})}
                        required
                      />
                      <Label htmlFor="agreeToTerms" className="text-sm font-normal">
                        I agree to the{" "}
                        <a href="#" className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 underline">
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 underline">
                          Privacy Policy
                        </a>
                        <span className="text-red-500"> *</span>
                      </Label>
                    </div>
                  </motion.div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t">
                  {step > 1 ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="flex items-center gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Previous
                    </Button>
                  ) : (
                    <div></div>
                  )}

                  {step < 3 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 flex items-center gap-2"
                    >
                      Next
                      <ArrowLeft className="h-4 w-4 rotate-180" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 flex items-center gap-2 px-8"
                    >
                      {isSubmitting ? (
                        <>
                          <Loading size="sm" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          Report Lost Item
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Help Section */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 border border-violet-100 dark:border-violet-700/50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-violet-800 dark:text-violet-200">Tips for Better Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-violet-700 dark:text-violet-300">
                <div className="space-y-2">
                  <h4 className="font-medium">📸 Photos</h4>
                  <p>Upload clear, well-lit photos from multiple angles to help others identify your item easily.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">📝 Description</h4>
                  <p>Include brand names, colors, distinctive features, and any unique identifiers or damage.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">📍 Location</h4>
                  <p>Be as specific as possible about where you last remember having the item.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">🔄 Follow Up</h4>
                  <p>Check back regularly and respond quickly to potential matches from other users.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}