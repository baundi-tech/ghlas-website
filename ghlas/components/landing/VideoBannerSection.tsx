'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function VideoBannerSection() {
  return (
    <section className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden">

  <div className="relative w-full h-[70vh] sm:h-[80vh] lg:h-[90vh]">

    {/* Video */}
    <video
      src="/videos/hero-video.mp4"
      autoPlay
      muted
      loop
      playsInline
      className="absolute inset-0 w-full h-full object-fill"
    />

    {/* Gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-r from-[#14141D]/95 via-[#14141D]/70 to-transparent" />
    <div className="absolute inset-0 bg-gradient-to-t from-[#14141D]/70 via-transparent to-transparent" />

    {/* Content */}
    <div className="relative z-10 h-full flex items-center">
      <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">

        <div className="max-w-xl text-left">
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Every Plot.{" "}
            <span className="text-accent-golden">Every Owner.</span>
            <br className="hidden sm:block" />
            Secured Forever.
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-white/80 mb-6">
            From the Northern Savanna to the Volta Basin, GHLAS brings
            transparent, government-certified land rights to all 16 regions.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-accent-golden text-brand-deepCanopy font-semibold"
            >
              Register Your Land
            </Link>

            <Link
              href="/search"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-white/30 text-white"
            >
              Search Parcels
            </Link>
          </div>
        </div>

      </div>
    </div>

  </div>
</section>

  )
}
