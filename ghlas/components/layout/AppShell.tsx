'use client'

import { usePathname } from 'next/navigation'
import { Navigation } from './Navigation'
import { Footer } from './Footer'

const BARE_ROUTES = ['/search']

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const bare = BARE_ROUTES.some(r => pathname === r || pathname.startsWith(r + '/'))

  if (bare) {
    return <>{children}</>
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-16">{children}</main>
      <Footer />
    </>
  )
}
