"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export default function ReportFound() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    date: "",
    contactInfo: "",
    handedToAdmin: false
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    alert("Found item reported successfully! Thank you for helping a fellow student.")
    console.log("Form submitted:", formData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Navigation */}
      <nav className="border-b bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CR</span>
                </div>
                <span className="font-bold text-xl text-gray-900">College Reclaim</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/search">
                <Button variant="ghost" size="sm">🔍 Search</Button>
              </Link>
              <Link href="/auth/signin">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-green-600 hover:text-green-700">
            <span className="mr-2">←</span>
            Back to Home
          </Link>
        </div>

        {/* Form Card */}
        <Card className="border-green-200 shadow-lg">
          <CardHeader className="bg-green-50">
            <CardTitle className="text-2xl text-center text-green-700 flex items-center justify-center">
              <span className="mr-2">✅</span>
              Report a Found Item
            </CardTitle>
            <p className="text-center text-green-600 mt-2">
              Help someone recover their lost belongings by reporting what you found
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Item Title */}
              <div>
                <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                  Item Name / Title *
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="e.g., Blue iPhone 14, Black Backpack, Silver Watch"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                  className="mt-1"
                />
              </div>

              {/* Category */}
              <div>
                <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                  Category *
                </Label>
                <Select onValueChange={(value) => handleInputChange("category", value)} required>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select item category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">📱 Electronics</SelectItem>
                    <SelectItem value="clothing">👕 Clothing & Accessories</SelectItem>
                    <SelectItem value="bags">🎒 Bags & Backpacks</SelectItem>
                    <SelectItem value="books">📚 Books & Stationery</SelectItem>
                    <SelectItem value="jewelry">💍 Jewelry & Watches</SelectItem>
                    <SelectItem value="keys">🔑 Keys & Cards</SelectItem>
                    <SelectItem value="sports">⚽ Sports Equipment</SelectItem>
                    <SelectItem value="other">📦 Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Detailed Description *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the item in detail - color, brand, size, any unique features, condition, etc."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  required
                  rows={4}
                  className="mt-1"
                />
                <p className="text-sm text-gray-500 mt-1">
                  The more details you provide, the easier it will be for the owner to identify their item.
                </p>
              </div>

              {/* Location Found */}
              <div>
                <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                  Where did you find it? *
                </Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="e.g., Library 2nd floor, Student Center cafeteria, Parking lot B"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  required
                  className="mt-1"
                />
              </div>

              {/* Date Found */}
              <div>
                <Label htmlFor="date" className="text-sm font-medium text-gray-700">
                  Date Found *
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  required
                  className="mt-1"
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Contact Information */}
              <div>
                <Label htmlFor="contactInfo" className="text-sm font-medium text-gray-700">
                  Your Contact Information *
                </Label>
                <Input
                  id="contactInfo"
                  type="text"
                  placeholder="Email or phone number for the owner to contact you"
                  value={formData.contactInfo}
                  onChange={(e) => handleInputChange("contactInfo", e.target.value)}
                  required
                  className="mt-1"
                />
                <p className="text-sm text-gray-500 mt-1">
                  This will be shared with verified owners to arrange pickup.
                </p>
              </div>

              {/* Photo Upload Placeholder */}
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Photos (Optional but recommended)
                </Label>
                <div className="mt-1 border-2 border-dashed border-green-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                  <div className="text-green-500 mb-2">
                    <span className="text-3xl">📷</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Click to upload photos of the item (Coming soon)
                  </p>
                </div>
              </div>

              {/* Admin Handoff Checkbox */}
              <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
                <Checkbox
                  id="handedToAdmin"
                  checked={formData.handedToAdmin}
                  onCheckedChange={(checked) => setFormData({...formData, handedToAdmin: !!checked})}
                />
                <div className="flex-1">
                  <Label htmlFor="handedToAdmin" className="text-sm font-medium text-green-700 cursor-pointer">
                    I have handed this item to campus security/lost & found office
                  </Label>
                  <p className="text-xs text-green-600 mt-1">
                    Check this if you've already given the item to campus authorities
                  </p>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button 
                  type="submit" 
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  size="lg"
                >
                  <span className="mr-2">✅</span>
                  Report Found Item
                </Button>
                <Link href="/" className="flex-1">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full border-green-300 text-green-700 hover:bg-green-50"
                    size="lg"
                  >
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>

            {/* Help Text */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">💡 Tips for reporting found items:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Be as descriptive as possible - include colors, brands, and unique features</li>
                <li>• If it's valuable, consider taking it to campus security immediately</li>
                <li>• Take clear photos from multiple angles if possible</li>
                <li>• Include the exact location and time when you found it</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Additional Actions */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Looking for something you lost?</p>
          <Link href="/report/lost">
            <Button variant="outline" className="mr-4">
              <span className="mr-2">📋</span>
              Report Lost Item
            </Button>
          </Link>
          <Link href="/search">
            <Button variant="outline">
              <span className="mr-2">🔍</span>
              Search Found Items
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}