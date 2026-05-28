"use client"

import { cn } from "@/lib/utils"

interface TabButtonProps {
  children: React.ReactNode
  isActive?: boolean
  onClick?: () => void
  className?: string
}

export function TabButton({ children, isActive, onClick, className }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-6 py-2 rounded-full text-xs font-semibold tracking-wider transition-all",
        isActive 
          ? "bg-primary text-primary-foreground" 
          : "text-muted-foreground hover:text-foreground",
        className
      )}
    >
      {children}
    </button>
  )
}
