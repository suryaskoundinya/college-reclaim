"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Coffee, Smartphone, QrCode, Heart, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CoffeeModalProps {
  isOpen: boolean
  onClose: () => void
}

const UPI_DETAILS = {
  upiId: "surya1@fam",
  name: "Surya S Koundinya",
  currency: "INR",
  note: "Coffee for College Reclaim"
}

const PRESET_AMOUNTS = [30, 50, 100, 200]

export function CoffeeModal({ isOpen, onClose }: CoffeeModalProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState<number>(50)

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const mobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      const touchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      setIsMobile(mobile || touchDevice)
    }
    checkMobile()
  }, [])

  // Generate UPI payment link with proper encoding
  const generateUpiLink = (amount: number) => {
    const params = new URLSearchParams({
      pa: UPI_DETAILS.upiId,
      pn: UPI_DETAILS.name,
      am: amount.toString(),
      cu: UPI_DETAILS.currency,
      tn: UPI_DETAILS.note
    })
    return `upi://pay?${params.toString()}`
  }

  const handlePayment = (amount: number) => {
    try {
      const upiLink = generateUpiLink(amount)
      
      if (isMobile) {
        // Create a hidden link and trigger click for better mobile compatibility
        const link = document.createElement('a')
        link.href = upiLink
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        // Show success message
        setTimeout(() => {
          alert('Opening UPI app... If it doesn\'t open automatically, please install a UPI app like Google Pay, PhonePe, or Paytm.')
        }, 100)
      } else {
        // Desktop - just try to open
        window.location.href = upiLink
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('Failed to open UPI app. Please try again or use the QR code.')
    }
  }

  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEsc)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleEsc)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>

          {/* Header with gradient */}
          <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-500 p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-4"
            >
              <Coffee className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Buy Me a Coffee ☕
            </h2>
            <p className="text-white/90 text-sm">
              Support College Reclaim Development
            </p>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Preset Amount Selection */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 text-center">
                Choose Amount
              </p>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setSelectedAmount(amount)}
                    className={`
                      py-3 px-2 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200
                      ${selectedAmount === amount
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }
                    `}
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile: Direct payment button */}
            {isMobile ? (
              <div className="space-y-4">
                <Button
                  onClick={() => handlePayment(selectedAmount)}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-6 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <Smartphone className="w-6 h-6 mr-2" />
                  Pay ₹{selectedAmount} with UPI
                </Button>
                <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                  👆 Tap to open Google Pay / PhonePe / Paytm
                </p>
              </div>
            ) : (
              /* Desktop: QR Code */
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2 text-gray-700 dark:text-gray-300 mb-3">
                  <QrCode className="w-5 h-5" />
                  <span className="font-medium">Scan with any UPI app</span>
                </div>
                
                <div className="flex justify-center p-4 bg-white rounded-xl border-2 border-gray-200 dark:border-gray-700">
                  <img
                    src="/upi-qr.jpeg"
                    alt="UPI QR Code"
                    className="w-48 h-48 sm:w-64 sm:h-64 object-contain rounded-lg"
                  />
                </div>

                <div className="text-center space-y-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    UPI ID: <span className="font-mono text-violet-600 dark:text-violet-400">{UPI_DETAILS.upiId}</span>
                  </p>
                  <p className="text-base font-bold text-amber-600 dark:text-amber-400">
                    Enter Amount: ₹{selectedAmount}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Scan the QR code and enter ₹{selectedAmount} manually
                  </p>
                  
                  {/* Desktop UPI Link Button */}
                  <Button
                    onClick={() => handlePayment(selectedAmount)}
                    variant="outline"
                    className="mt-4 w-full"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Open UPI App (₹{selectedAmount})
                  </Button>
                </div>
              </div>
            )}

            {/* Safety Notice */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-blue-900 dark:text-blue-100 leading-relaxed">
                    <strong>Safe & Secure:</strong> Payments are processed directly through your UPI app.
                    No card or login information is stored. Supporting the developer is completely optional.
                    But greatly appreciated! lol
                  </p>
                </div>
              </div>
            </div>

            {/* Appreciation Message */}
            <div className="text-center space-y-2 pt-2">
              <div className="flex items-center justify-center space-x-2 text-pink-600 dark:text-pink-400">
                <Heart className="w-5 h-5 fill-current" />
                <span className="font-medium">Thank you for your support!</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your contribution helps keep College Reclaim free and ad-free for everyone.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
