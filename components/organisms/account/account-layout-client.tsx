'use client'

import { useState } from 'react'
import { AccountSidebar } from '@/components/organisms/account/account-sidebar'
import { cn } from '@/lib/utils'

export function AccountLayoutClient({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="flex min-h-screen">
        <AccountSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
        <section
          className={cn(
            'flex-1 px-4 md:px-10 py-10 space-y-10 transition-all duration-300',
            collapsed ? 'md:ml-[72px]' : 'md:ml-[260px]',
          )}
        >
          <header className="flex items-center justify-between md:hidden">
            <span className="font-black text-2xl text-primary tracking-tight">StreamHub</span>
            <button className="material-symbols-outlined text-foreground" data-icon="menu">
              menu
            </button>
          </header>
          {children}
        </section>
      </main>
    </div>
  )
}
