'use client'

import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div
      className={cn(
        'bg-[rgba(17,24,39,0.8)] backdrop-blur-[12px] border border-white/10 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.35)]',
        className,
      )}
    >
      {children}
    </div>
  )
}
