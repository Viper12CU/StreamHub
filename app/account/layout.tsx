import type { Metadata } from 'next'
import { AccountSidebar } from '@/components/organisms/account/account-sidebar'

export const metadata: Metadata = {
  title: 'Mi Cuenta | StreamHub Cuba',
  description: 'Panel de cuenta y servicios activos en StreamHub Cuba.',
}

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="flex min-h-screen">
        <AccountSidebar />
        <section className="flex-1 md:ml-[260px] px-4 md:px-10 py-10 space-y-10">
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
