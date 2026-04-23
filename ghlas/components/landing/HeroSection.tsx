'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { HeroSlider } from '@/components/ui/HeroSlider'
import { Search, MapPin, Shield, ArrowRight } from 'lucide-react'
import { FaCheck } from 'react-icons/fa'
import Image from 'next/image'
import Link from 'next/link'

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollY } = useScroll()
  // 3-layer depth: bg drifts down (slowest), slider lifts moderately, text races up
  const bgY    = useTransform(scrollY, [0, 600], [0,  80])
  const rightY = useTransform(scrollY, [0, 600], [0, -80])
  const leftY  = useTransform(scrollY, [0, 600], [0, -220])

  return (
    <section ref={sectionRef} className="relative min-h-screen bg-brand-deepCanopy">
      {/* Background layers — own overflow-hidden so clipping doesn't kill parallax on content */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div className="absolute inset-0 scale-110" style={{ y: bgY }}>
          <Image
            src="/images/hero-3.png"
            alt=""
            fill
            className="object-cover object-center"
            priority
          />
        </motion.div>
        <div className="absolute inset-0 bg-brand-deepCanopy/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-deepCanopy via-transparent to-transparent" />
      </div>
      
      <div className="relative container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            style={{ y: leftY }}
          >
            
            
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Secure Your Land
              <span className="text-accent-golden"> Ownership</span>
            </h1>
            
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Ghana's premier digital land administration system. Eliminate disputes, 
              verify ownership and secure your property rights with blockchain-backed technology.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/search" className="btn-accent inline-flex items-center gap-2 group">
                Search Parcels
                <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </Link>
              <Link href="/register" className="btn-secondary border-white text-white hover:bg-white hover:text-brand-darkForest inline-flex items-center gap-2 group">
                Register Land
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="mt-12 flex flex-wrap items-center gap-8 text-white">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-accent-golden" />
                <span>Blockchain Secured</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-accent-golden" />
                <span>GPS Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, ].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-accent-golden/30 border-2 border-white flex items-center justify-center">
                      <FaCheck className="w-3 h-3 text-white" />
                    </div>
                  ))}
                </div>
                <span>10k+ Owners</span>
              </div>
            </div>
          </motion.div>
          
          {/* Right Content - Image Slider */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ y: rightY }}
            className="relative"
          >
            <HeroSlider />
          </motion.div>
        </div>
      </div>
      
     
    </section>
  )
}