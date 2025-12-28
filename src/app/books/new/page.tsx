"use client"

import { useState, useRef } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, BookOpen, Upload, Clock, ShoppingCart, Info, X, IndianRupee } from "lucide-react"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

const BOOK_CONDITIONS = [
  { value: 'NEW', label: 'New', description: 'Brand new, never used' },
  { value: 'LIKE_NEW', label: 'Like New', description: 'Excellent condition, minimal wear' },
  { value: 'GOOD', label: 'Good', description: 'Good condition, some wear but fully functional' },
  { value: 'FAIR', label: 'Fair', description: 'Shows wear but still usable' },
  { value: 'POOR', label: 'Poor', description: 'Heavy wear, may have damage but still readable' }
]

export default function NewBookPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    condition: "",
    priceOrRent: "",
    type: "",
    contactPhone: ""
  })

  // Redirect if not authenticated
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Skeleton className="h-6 w-32 mb-6" />
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <div>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-24 w-full" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    router.push("/auth/signin")
    return null
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB")
        return
      }
      setUploadedFile(file)
      toast.success("Image selected successfully")
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    toast.success("Image removed")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate form
      if (!formData.title || !formData.author || !formData.description || 
          !formData.condition || !formData.priceOrRent || !formData.type) {
        toast.error("Please fill in all required fields")
        return
      }

      const priceValue = parseFloat(formData.priceOrRent)
      if (isNaN(priceValue) || priceValue < 0) {
        toast.error("Please enter a valid price")
        return
      }

      // Upload image if exists
      let imageUrl = undefined
      if (uploadedFile) {
        const formDataUpload = new FormData()
        formDataUpload.append('file', uploadedFile)
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formDataUpload,
        })
        
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json()
          imageUrl = uploadData.url
        }
      }

      const bookData = {
        title: formData.title.trim(),
        author: formData.author.trim(),
        description: formData.description.trim(),
        condition: formData.condition,
        priceOrRent: priceValue,
        type: formData.type,
        contactPhone: formData.contactPhone,
        imageUrl: imageUrl || undefined
      }

      const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create book listing')
      }

      const newBook = await response.json()
      
      toast.success("Book listed successfully!", {
        description: `Your book "${newBook.title}" is now available for ${newBook.type.toLowerCase()}.`
      })

      router.push(`/books/${newBook.id}`)

    } catch (error) {
      console.error('Error creating book:', error)
      toast.error(error instanceof Error ? error.message : "Failed to create book listing")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/books" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Books
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              List a Book
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Share your books with fellow students. List them for rent or sale to help others while earning some money.
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-xl border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Book Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Book Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Introduction to Computer Science"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                </div>

                {/* Author */}
                <div className="space-y-2">
                  <Label htmlFor="author">Author *</Label>
                  <Input
                    id="author"
                    placeholder="e.g., John Smith"
                    value={formData.author}
                    onChange={(e) => handleInputChange('author', e.target.value)}
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the book's content, condition, and any additional details..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    required
                  />
                </div>

                {/* Contact Phone */}
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone Number *</Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    placeholder="e.g., +1234567890 or 9876543210"
                    value={formData.contactPhone}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500">This number will be displayed so buyers/renters can contact you</p>
                </div>

                {/* Type and Price Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Listing Type *</Label>
                    <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="How do you want to list this book?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RENT" className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-purple-600" />
                            <div>
                              <div className="font-medium">For Rent</div>
                              <div className="text-xs text-gray-500">Lend temporarily for monthly payment</div>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="SELL" className="space-y-1">
                          <div className="flex items-center gap-2">
                            <ShoppingCart className="h-4 w-4 text-green-600" />
                            <div>
                              <div className="font-medium">For Sale</div>
                              <div className="text-xs text-gray-500">Sell permanently for one-time payment</div>
                            </div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {formData.type && (
                      <div className={`text-xs p-2 rounded-md ${
                        formData.type === 'RENT' 
                          ? 'bg-purple-50 text-purple-700 border border-purple-200' 
                          : 'bg-green-50 text-green-700 border border-green-200'
                      }`}>
                        <Info className="h-3 w-3 inline mr-1" />
                        {formData.type === 'RENT' 
                          ? 'You\'ll get monthly payments and the book back eventually'
                          : 'You\'ll receive a one-time payment and transfer ownership'
                        }
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">
                      Price * 
                      <span className="text-sm text-gray-500 ml-1">
                        ({formData.type === 'RENT' ? 'per month' : 'one-time payment'})
                      </span>
                    </Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="price"
                        type="number"
                        placeholder="0.00"
                        className="pl-10"
                        value={formData.priceOrRent}
                        onChange={(e) => handleInputChange('priceOrRent', e.target.value)}
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>

                {/* Upload Book Image (Optional) */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Upload Book Image (Optional)</Label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
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
                    {uploadedFile && (
                      <div className="mt-3 relative group">
                        <img
                          src={URL.createObjectURL(uploadedFile)}
                          alt={uploadedFile.name}
                          className="w-full h-48 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={removeFile}
                          className="absolute top-2 right-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <p className="text-xs text-gray-500 mt-2">{uploadedFile.name}</p>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    Add a photo to make your listing more attractive to potential renters/buyers. Max 5MB.
                  </p>
                </div>

                {/* Condition */}
                <div className="space-y-2">
                  <Label htmlFor="condition">Condition *</Label>
                  <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {BOOK_CONDITIONS.map(condition => (
                        <SelectItem key={condition.value} value={condition.value}>
                          <div>
                            <div className="font-medium">{condition.label}</div>
                            <div className="text-sm text-gray-500">{condition.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating...
                      </div>
                    ) : (
                      "List Book"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
                💡 Tips for a successful listing:
              </h3>
              <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <li>• Be honest about the book's condition to build trust</li>
                <li>• Price competitively by checking similar books</li>
                <li>• Include detailed descriptions to attract the right buyers</li>
                <li>• Add a clear photo if possible to increase interest</li>
                <li>• Respond promptly to requests for better results</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}