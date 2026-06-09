'use client'

import { useTheme } from 'next-themes'
import { Toaster as SileoToaster } from 'sileo'

export function Toaster() {
  const { theme = 'system' } = useTheme()

  return (
    <SileoToaster
      position="top-center"
      theme={theme as 'light' | 'dark' | 'system'}
      options={{
        duration: 4000,
        fill: 'rgba(17, 24, 39, 0.8)',
        roundness: 16,
        styles: {
          title: 'text-[13px] font-semibold text-white tracking-[-0.01em]',
          description: 'text-[12px] text-white/75! font-semibold',
          badge:
            'text-[10px] uppercase tracking-[0.2em] text-primary bg-primary/10 px-2 py-0.5 rounded-full',
          button:
            'text-[12px] font-semibold text-white/80 hover:text-primary transition-colors',
        },
      }}
    />
  )
}
