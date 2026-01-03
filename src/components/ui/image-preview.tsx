"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ZoomIn, ZoomOut, Download } from "lucide-react"
import { Button } from "./button"
import { cn } from "@/lib/utils"

interface ImagePreviewModalProps {
  src: string
  alt: string
  isOpen: boolean
  onClose: () => void
}

export function ImagePreviewModal({ src, alt, isOpen, onClose }: ImagePreviewModalProps) {
  const [zoom, setZoom] = useState(1)

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      setZoom(1)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5))
  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = src
    link.download = alt || 'image'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999]" style={{ isolation: 'isolate' }}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                onClose()
              }
            }}
            className="absolute inset-0 bg-black/90 cursor-zoom-out"
          />

          {/* Controls */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md"
            >
              <ZoomOut className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md"
            >
              <ZoomIn className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDownload}
              className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md"
            >
              <Download className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Image Container */}
          <div 
            className="absolute inset-0 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                onClose()
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative max-w-full max-h-full pointer-events-none"
              style={{ transform: `scale(${zoom})`, transition: 'transform 0.2s ease-out' }}
            >
              <img
                src={src}
                alt={alt}
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl pointer-events-auto"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                draggable={false}
              />
            </motion.div>
          </div>

          {/* Alt Text Display */}
          {alt && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-lg text-sm max-w-md text-center">
              {alt}
            </div>
          )}
        </div>
      )}
    </AnimatePresence>
  )
}

// Clickable Image Component
interface ClickableImageProps {
  src: string
  alt: string
  className?: string
  containerClassName?: string
  onClick?: () => void
}

export function ClickableImage({ src, alt, className, containerClassName, onClick }: ClickableImageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      setIsModalOpen(true)
    }
  }

  return (
    <>
      <div
        onClick={handleClick}
        className={cn(
          "relative cursor-zoom-in group overflow-hidden",
          containerClassName
        )}
      >
        <img
          src={src}
          alt={alt}
          className={cn(
            "transition-transform duration-300 group-hover:scale-110",
            className
          )}
        />
        {/* Zoom Indicator Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
          <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>

      <ImagePreviewModal
        src={src}
        alt={alt}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
