"use client"

import { cn } from "@/lib/utils"
import { CheckCircle, X } from "lucide-react"
import { useEffect, useState } from "react"

interface ToastNotificationProps {
  message: string
  visible: boolean
  onClose: () => void
  autoHideDuration?: number
  className?: string
}

export function ToastNotification({ 
  message, 
  visible, 
  onClose, 
  autoHideDuration = 5000,
  className 
}: ToastNotificationProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (visible) {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        onClose()
      }, autoHideDuration)
      return () => clearTimeout(timer)
    }
  }, [visible, autoHideDuration, onClose])

  if (!visible && !isAnimating) return null

  return (
    <div 
      className={cn(
        "fixed bottom-16 left-1/2 -translate-x-1/2 z-[100]",
        visible ? "animate-in slide-in-from-bottom fade-in duration-500" : "animate-out slide-out-to-bottom fade-out duration-300",
        className
      )}
      onAnimationEnd={() => {
        if (!visible) setIsAnimating(false)
      }}
    >
      <div className="glass-panel px-8 py-4 rounded-full flex items-center gap-3 border-2 border-primary/30">
        <CheckCircle className="w-5 h-5 text-primary fill-primary" />
        <span className="text-base text-foreground">{message}</span>
        <button 
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground ml-2"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
