'use client'

import Link from 'next/link'
import { Mail, Phone, MapPin, Globe, Bird, Briefcase } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-brand-deepCanopy text-white pt-12 pb-6">
      <div className="container mx-auto px-4">

        {/* GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">

          {/* About */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/images/logo1.png"
                alt="GHLAS Logo"
                className="h-10 w-auto object-contain"
              />
            
            </div>
            <p className="text-neutral-sage text-sm">
              Ghana's premier digital land administration system, securing land ownership and eliminating disputes through blockchain technology.
            </p>
          </div>

          {/* Quick Links */}
          <div className="order-1 md:order-none">
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/search" className="text-neutral-sage hover:text-accent-golden">Search Parcels</Link></li>
              <li><Link href="/register" className="text-neutral-sage hover:text-accent-golden">Register Land</Link></li>
              <li><Link href="/dashboard" className="text-neutral-sage hover:text-accent-golden">Dashboard</Link></li>
              <li><Link href="/contact" className="text-neutral-sage hover:text-accent-golden">Contact Us</Link></li>
            </ul>
          </div>

          {/* Resources (moves beside Quick Links on mobile) */}
          <div className="order-2 md:order-none">
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/faq" className="text-neutral-sage hover:text-accent-golden">FAQ</Link></li>
              <li><Link href="/guides" className="text-neutral-sage hover:text-accent-golden">User Guides</Link></li>
              <li><Link href="/support" className="text-neutral-sage hover:text-accent-golden">Support</Link></li>
              <li><Link href="/privacy" className="text-neutral-sage hover:text-accent-golden">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact (forced to bottom on mobile) */}
          <div className="col-span-2 md:col-span-1 order-3 md:order-none">
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-neutral-sage">
                <MapPin className="w-4 h-4" />
                <span>Accra, Ghana</span>
              </li>
              <li className="flex items-center gap-2 text-neutral-sage">
                <Phone className="w-4 h-4" />
                <span>+233 30 123 4567</span>
              </li>
              <li className="flex items-center gap-2 text-neutral-sage">
                <Mail className="w-4 h-4" />
                <span>info@ghlas.gov.gh</span>
              </li>
            </ul>

            <div className="flex gap-3 mt-4">
              <a href="#" className="text-neutral-sage hover:text-accent-golden">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="text-neutral-sage hover:text-accent-golden">
                <Bird className="w-5 h-5" />
              </a>
              <a href="#" className="text-neutral-sage hover:text-accent-golden">
                <Briefcase className="w-5 h-5" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-neutral-coolGray/20 pt-6 text-center text-sm text-neutral-sage">
          <p>&copy; {currentYear} Ghana Land Administration System. All rights reserved.</p>
        </div>

      </div>
    </footer>
  )
}
