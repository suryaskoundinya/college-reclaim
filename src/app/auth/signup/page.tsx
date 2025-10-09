"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loading } from "@/components/ui/loading"
import { Eye, EyeOff, ArrowLeft, User, Mail, Lock, GraduationCap, CheckCircle, AlertCircle, Sparkles } from "lucide-react"
import { toast } from "sonner"

const departments = [
  "Computer Science", "Electrical Engineering", "Mechanical Engineering",
  "Civil Engineering", "Business Administration", "Biology", "Chemistry",
  "Physics", "Mathematics", "English Literature", "Psychology", "Economics",
  "Political Science", "History", "Philosophy", "Art & Design"
]

const years = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Graduate", "PhD"]

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    studentId: "",
    department: "",
    year: "",
    password: "",
    confirmPassword: ""
  })
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (formData.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters"
    }
    
    if (formData.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters"
    }
    
    if (!formData.email.includes("@") || !formData.email.includes(".")) {
      newErrors.email = "Please enter a valid email address"
    }
    
    if (formData.studentId.length < 5) {
      newErrors.studentId = "Student ID must be at least 5 characters"
    }
    
    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }
    
    if (!acceptTerms) {
      newErrors.terms = "You must accept the terms and conditions"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form")
      return
    }
    
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success("Account created successfully! Please check your email for verification.", {
        duration: 5000,
      })
      
      // Simulate redirect
      setTimeout(() => {
        window.location.href = "/auth/signin"
      }, 1500)
      
    } catch (error) {
      toast.error("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialSignUp = (provider: string) => {
    toast.info(`${provider} signup will be implemented with NextAuth.js`)
  }

  const getPasswordStrength = () => {
    const password = formData.password
    let strength = 0
    let feedback = ""
    
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    
    switch (strength) {
      case 0:
      case 1:
        feedback = "Very Weak"
        break
      case 2:
        feedback = "Weak"
        break
      case 3:
        feedback = "Fair"
        break
      case 4:
        feedback = "Good"
        break
      case 5:
        feedback = "Strong"
        break
    }
    
    return { strength, feedback }
  }

  const passwordStrength = getPasswordStrength()

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden transition-colors duration-300">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="flex items-center justify-center min-h-screen p-4 relative z-10">
        <div className="w-full max-w-lg">
          {/* Header */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/" className="inline-flex items-center text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 mb-6 transition-colors duration-200">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </motion.div>

          {/* Sign Up Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm shadow-2xl border border-white/20 dark:border-gray-700/50 transition-colors duration-300">
              <CardHeader className="text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="w-16 h-16 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                >
                  <Sparkles className="text-white w-8 h-8" />
                </motion.div>
                <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  Join College Reclaim
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-300 mt-2 transition-colors duration-300">Create your account to start finding your lost items</p>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                        First Name
                      </Label>
                      <div className="relative">
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="John"
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          className="pl-10 h-11"
                          required
                        />
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                      {errors.firstName && (
                        <p className="text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.firstName}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="h-11"
                        required
                      />
                      {errors.lastName && (
                        <p className="text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                      College Email
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        placeholder="student@university.edu"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="pl-10 h-11"
                        required
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Student ID */}
                  <div className="space-y-2">
                    <Label htmlFor="studentId" className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                      Student ID
                    </Label>
                    <div className="relative">
                      <Input
                        id="studentId"
                        type="text"
                        placeholder="STU123456"
                        value={formData.studentId}
                        onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                        className="pl-10 h-11"
                        required
                      />
                      <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                    {errors.studentId && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.studentId}
                      </p>
                    )}
                  </div>

                  {/* Department and Year */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="department" className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                        Department
                      </Label>
                      <Select value={formData.department} onValueChange={(value) => setFormData({...formData, department: value})}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="year" className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                        Academic Year
                      </Label>
                      <Select value={formData.year} onValueChange={(value) => setFormData({...formData, year: value})}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem key={year} value={year}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="pl-10 pr-10 h-11"
                        required
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                    {formData.password && (
                      <div className="flex items-center gap-2 text-xs">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              passwordStrength.strength <= 2 ? 'bg-red-500' :
                              passwordStrength.strength <= 3 ? 'bg-yellow-500' :
                              passwordStrength.strength <= 4 ? 'bg-blue-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                          />
                        </div>
                        <span className={`font-medium ${
                          passwordStrength.strength <= 2 ? 'text-red-600' :
                          passwordStrength.strength <= 3 ? 'text-yellow-600' :
                          passwordStrength.strength <= 4 ? 'text-blue-600' : 'text-green-600'
                        }`}>
                          {passwordStrength.feedback}
                        </span>
                      </div>
                    )}
                    {errors.password && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        className="pl-10 pr-10 h-11"
                        required
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                    {formData.confirmPassword && formData.password === formData.confirmPassword && (
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Passwords match
                      </p>
                    )}
                    {errors.confirmPassword && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  {/* Terms and Conditions */}
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <Checkbox 
                        id="terms" 
                        checked={acceptTerms}
                        onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                        className="mt-1"
                      />
                      <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                        <Label htmlFor="terms" className="font-normal cursor-pointer">
                          I agree to the{" "}
                          <Link href="/terms" className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium transition-colors duration-200">
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link href="/privacy" className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium transition-colors duration-200">
                            Privacy Policy
                          </Link>
                        </Label>
                      </div>
                    </div>
                    {errors.terms && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.terms}
                      </p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 h-11 font-semibold shadow-lg" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loading size="sm" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200 dark:border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400 font-medium transition-colors duration-300">Or sign up with</span>
                  </div>
                </div>

                {/* Social Signup Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSocialSignUp("Google")}
                    className="h-11 font-medium border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-200 transition-colors duration-300"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSocialSignUp("Microsoft")}
                    className="h-11 font-medium border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-200 transition-colors duration-300"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="#f35325" d="M1 1h10v10H1z"/>
                      <path fill="#81bc06" d="M13 1h10v10H13z"/>
                      <path fill="#05a6f0" d="M1 13h10v10H1z"/>
                      <path fill="#ffba08" d="M13 13h10v10H13z"/>
                    </svg>
                    Microsoft
                  </Button>
                </div>

                {/* Sign In Link */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                    Already have an account?{" "}
                    <Link 
                      href="/auth/signin" 
                      className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-semibold transition-colors duration-200"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}