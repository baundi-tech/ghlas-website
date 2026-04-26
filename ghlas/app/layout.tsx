import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers/Providers'
import { AppShell } from '@/components/layout/AppShell'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ghana Land Administration System | Secure Land Ownership',
  description: 'Digital land records management, eliminating disputes, securing ownership in Ghana',
  keywords: 'land administration, Ghana, property records, land registry, digital land',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <AppShell>
            {children}
          </AppShell>
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  )
}