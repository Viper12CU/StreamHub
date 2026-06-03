import type { Metadata } from 'next'
import { AuthGuard } from '@/components/organisms/account/auth-guard'
import { AccountLayoutClient } from '@/components/organisms/account/account-layout-client'

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
    <AuthGuard>
      <AccountLayoutClient>{children}</AccountLayoutClient>
    </AuthGuard>
  )
}
