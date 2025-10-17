"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"

interface BackButtonProps {
  showHomeButton?: boolean
  showBackButton?: boolean
  className?: string
}

export function BackButton({ 
  showHomeButton = true, 
  showBackButton = true,
  className = "" 
}: BackButtonProps) {
  const router = useRouter()

  return (
    <div className={`flex gap-2 ${className}`}>
      {showBackButton && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      )}
      {showHomeButton && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/")}
          className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Home className="w-4 h-4 mr-2" />
          Home
        </Button>
      )}
    </div>
  )
}
