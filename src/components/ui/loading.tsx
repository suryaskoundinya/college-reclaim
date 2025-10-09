"use client"

import { motion } from "framer-motion"
import { Loader2, Sparkles } from "lucide-react"

interface LoadingProps {
  size?: "sm" | "md" | "lg"
  text?: string
  className?: string
}

export function Loading({ size = "md", text, className = "" }: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  }

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className={`${sizeClasses[size]} text-violet-600 animate-spin`} />
      </motion.div>
      {text && (
        <motion.span 
          className="text-gray-600 font-medium"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
        >
          {text}
        </motion.span>
      )}
    </div>
  )
}

export function PageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-indigo-50 to-cyan-50">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <Sparkles className="text-white w-8 h-8 animate-pulse" />
          </div>
        </motion.div>
        <motion.h2 
          className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          College Reclaim
        </motion.h2>
        <motion.p 
          className="text-gray-600 loading-dots"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Loading your lost & found platform
        </motion.p>
      </div>
    </div>
  )
}