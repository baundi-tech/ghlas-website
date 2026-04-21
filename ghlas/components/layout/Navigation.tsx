'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Map, Menu, X, Search, LayoutDashboard, LogIn, FileText } from 'lucide-react'

const navLinks = [
  { href: '/search', label: 'Search', icon: Search },
  { href: '/register', label: 'Register Land', icon: FileText },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
]

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-deepCanopy/95 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl">
          <Map className="w-6 h-6 text-accent-golden" />
          GHLAS
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium transition-colors ${
                pathname === href
                  ? 'text-accent-golden'
                  : 'text-neutral-sage hover:text-white'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="btn-accent py-2 px-4 text-sm flex items-center gap-2">
            <LogIn className="w-4 h-4" />
            Sign In
          </Link>
        </div>

        <button
          className="md:hidden text-white p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-brand-deepCanopy border-t border-white/10 px-4 py-4 space-y-3">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 text-sm font-medium py-2 transition-colors ${
                pathname === href ? 'text-accent-golden' : 'text-neutral-sage hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={() => setMobileOpen(false)}
            className="btn-accent w-full py-2 text-sm flex items-center justify-center gap-2 mt-2"
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </Link>
        </div>
      )}
    </nav>
  )
}
