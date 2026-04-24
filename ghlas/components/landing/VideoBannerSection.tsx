'use client'

import { motion } from 'framer-motion'
import { MapPin, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function VideoBannerSection() {
  return (
    <section className="relative w-full overflow-hidden">
      {/*
        aspect-video on mobile keeps the full 16:9 frame visible — no cropping.
        On md+ we switch to a fixed viewport height for a cinematic look.
      */}
      <div className="relative w-full aspect-video md:aspect-auto md:h-[70vh]">
        <video
          src="/videos/banner.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-deepCanopy/40 via-black/40 to-brand-deepCanopy/80" />

        {/* Overlay content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="max-w-3xl"
          >
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <MapPin className="w-4 h-4 text-accent-golden" />
              <span className="text-white/90 text-sm font-medium tracking-wide">
                Ghana Land Administration System
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              Every Plot.{' '}
              <span className="text-accent-golden">Every Owner.</span>
              <br className="hidden sm:block" /> Secured Forever.
            </h2>

            <p className="text-base sm:text-lg text-white/75 max-w-xl mx-auto mb-8 leading-relaxed">
              From the Northern Savanna to the Volta Basin — GHLAS brings
              transparent, blockchain-backed land rights to all 16 regions.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-accent-golden text-brand-deepCanopy font-semibold hover:bg-accent-yellow transition-colors shadow-[0_0_24px_rgba(199,148,62,0.4)]"
              >
                Register Your Land
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/search"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-white/30 text-white font-semibold hover:bg-white/10 backdrop-blur-sm transition-colors"
              >
                Search Parcels
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
