'use client'

import { useState } from 'react'
import { AccountSidebar } from '@/components/organisms/account/account-sidebar'
import { AccountBottomBar } from '@/components/organisms/account/account-bottom-bar'
import { AccountAppBar } from '@/components/organisms/account/account-app-bar'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'

export function AccountLayoutClient({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const isMobile = useIsMobile()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="flex min-h-screen flex-col md:flex-row">
        <AccountSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
        <section
          className={cn(
            'flex-1 px-4 md:px-10 py-10 space-y-10 transition-all duration-300 pt-20 md:pt-10 pb-24 md:pb-10',
            !isMobile && (collapsed ? 'md:ml-[72px]' : 'md:ml-[260px]'),
          )}
        >
          {children}
        </section>
      </main>
      {isMobile && <AccountAppBar />}
      {isMobile && <AccountBottomBar />}
    </div>
  )
}
