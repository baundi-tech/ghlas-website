'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { Search, LayoutDashboard, FileText, LogIn, Menu, X, ChevronRight, Home } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { href: '/',          label: 'Home',           icon: Home },
  { href: '/search',    label: 'Search Parcels', icon: Search },
  { href: '/register',  label: 'Register Land',  icon: FileText },
  { href: '/dashboard', label: 'Dashboard',       icon: LayoutDashboard },
]

// ─── Desktop Navbar ──────────────────────────────────────────────────────────

function DesktopNav({ pathname, scrolled }: { pathname: string; scrolled: boolean }) {
  return (
    <div
      className={`hidden md:flex items-center justify-between h-16 px-8 transition-all duration-300 ${
        scrolled
          ? 'bg-brand-deepCanopy/60 backdrop-blur-xl shadow-[0_1px_40px_rgba(0,0,0,0.4)] border-b border-white/8'
          : 'bg-transparent'
      }`}
    >
      {/* Left — Logo (crossfades on scroll) */}
      <Link href="/" className="flex-shrink-0 relative w-[140px] h-[36px]">
        <AnimatePresence mode="wait" initial={false}>
          {scrolled ? (
            <motion.span
              key="logo-scrolled"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0"
            >
              <Image
                src="/images/logo1.png"
                alt="GHLAS"
                fill
                className="object-contain object-left"
                priority
              />
            </motion.span>
          ) : (
            <motion.span
              key="logo-default"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0"
            >
              <Image
                src="/images/logo.png"
                alt="GHLAS"
                fill
                className="object-contain object-left"
                priority
              />
            </motion.span>
          )}
        </AnimatePresence>
      </Link>

      {/* Right — Nav links + CTA */}
      <div className="flex items-center gap-1">
        {navLinks.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`group relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                active
                  ? 'text-accent-golden font-semibold'
                  : scrolled
                  ? 'text-white/70 hover:text-white hover:bg-white/6'
                  : 'text-green-900 hover:text-black hover:bg-black/6'
              }`}
            >
              <Icon
                className={`w-4 h-4 transition-colors ${
                  active
                    ? 'text-accent-golden'
                    : scrolled
                    ? 'text-white/50 group-hover:text-white/80'
                    : 'text-green-900 group-hover:text-black/80'
                }`}
              />
              {label}
              {active && (
                <>
                  {/* sliding underline */}
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-accent-golden"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                  {/* pulse glow */}
                  <motion.span
                    className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-accent-golden"
                    animate={{ opacity: [0.6, 1, 0.6], scaleX: [0.85, 1, 0.85] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ filter: 'blur(3px)' }}
                  />
                </>
              )}
            </Link>
          )
        })}

        

        <Link
          href="/login"
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white bg-green-800 hover:bg-accent-yellow transition-all duration-200 hover:translate-y-[-2px]"
        >
          <LogIn className="w-4 h-4" />
          Sign In
        </Link>
      </div>
    </div>
  )
}

// ─── Mobile Navbar ────────────────────────────────────────────────────────────

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.32 } },
  exit:   { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
}

const EASE_OUT = [0.22, 1, 0.36, 1] as [number, number, number, number]

const itemVariants = {
  hidden:  { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { ease: EASE_OUT, duration: 0.45 } },
  exit:    { opacity: 0, x: 40, transition: { ease: 'easeIn' as const, duration: 0.2 } },
}

function MobileNav({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false)

  // Lock body scroll while overlay is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Top bar — always visible on mobile */}
      <div className="flex md:hidden items-center justify-between h-18 px-5 bg-brand-deepCanopy backdrop-blur-xl border-b border-white/8 relative z-50">
        <Link href="/" onClick={() => setOpen(false)}>
          <Image src="/images/logo.png" alt="GHLAS" width={120} height={32} priority />
        </Link>

        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          className="relative z-50 w-15 h-15 flex items-center justify-center rounded-full text-white transition-colors"
        >
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0,   opacity: 1 }}
                exit={{   rotate:  90,  opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-5 h-5" />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ rotate: 90,  opacity: 0 }}
                animate={{ rotate: 0,   opacity: 1 }}
                exit={{   rotate: -90,  opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="w-5 h-5" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Full-viewport overlay with circular reveal from top-right */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-overlay"
            initial={{ clipPath: 'circle(0% at calc(100% - 2.5rem) 2rem)' }}
            animate={{ clipPath: 'circle(170% at calc(100% - 2.5rem) 2rem)' }}
            exit={{    clipPath: 'circle(0% at calc(100% - 2.5rem) 2rem)' }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
            className="md:hidden fixed inset-0 z-40 bg-brand-deepCanopy flex flex-col"
          >
           

            {/* Content — offset by top bar height */}
            <div className="flex flex-col justify-center flex-1 px-8 pt-16 pb-12">
              <motion.ul
                variants={listVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-2"
              >
                {navLinks.map(({ href, label, icon: Icon }) => {
                  const active = href === '/' ? pathname === '/' : pathname === href
                  return (
                    <motion.li key={href} variants={itemVariants}>
                      <Link
                        href={href}
                        onClick={() => setOpen(false)}
                        className={`group relative flex items-center gap-4 px-5 py-4 rounded-2xl transition-colors overflow-hidden ${
                          active ? 'bg-white/8 text-accent-golden font-semibold' : 'text-white/60 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <span className={`flex items-center justify-center w-10 h-10 rounded-xl ${
                          active ? 'bg-accent-golden/15 text-accent-golden' : 'bg-white/6 text-white/40 group-hover:text-white/70'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </span>
                        <span className="text-xl font-semibold tracking-tight">{label}</span>
                        <ChevronRight className={`ml-auto w-5 h-5 transition-transform group-hover:translate-x-1 ${active ? 'text-accent-golden/60' : 'text-white/20'}`} />
                        {active && (
                          <>
                            <motion.span
                              layoutId="mobile-nav-bar"
                              className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full bg-accent-golden"
                              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                            />
                            <motion.span
                              className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full bg-accent-golden"
                              animate={{ opacity: [0.5, 1, 0.5], scaleY: [0.8, 1, 0.8] }}
                              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                              style={{ filter: 'blur(4px)' }}
                            />
                          </>
                        )}
                      </Link>
                    </motion.li>
                  )
                })}

                {/* Sign In */}
                <motion.li variants={itemVariants} className="pt-4">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-3 w-full px-5 py-4 rounded-sm text-base font-semibold text-green-900 bg-white  hover:bg-accent-yellow transition-colors "
                  >
                    <LogIn className="w-5 h-5" />
                    Sign In
                  </Link>
                </motion.li>
              </motion.ul>

              {/* Footer note */}
              <motion.p
                variants={itemVariants}
                className="text-center text-xs text-white/20 mt-12"
              >
                Ghana Land Administration 
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ─── Root ────────────────────────────────────────────────────────────────────

export function Navigation() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <DesktopNav pathname={pathname} scrolled={scrolled} />
      <MobileNav pathname={pathname} />
    </nav>
  )
}