'use client'

import { motion } from 'framer-motion'
import { AnimatedAvatars } from '@/components/ui/AnimatedAvatars'
import { MeshGeospatial } from '@/components/ui/MeshGeospatial'
import { Search, MapPin, Shield, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-brand-deepCanopy via-brand-darkForest to-brand-shadow">
      {/* Background Mesh */}
      <div className="absolute inset-0 opacity-15">
        <MeshGeospatial region="upper-west" />
      </div>
      
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-deepCanopy via-transparent to-transparent" />
      
      <div className="relative container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            
            
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Secure Your Land
              <span className="text-accent-golden"> Ownership</span>
            </h1>
            
            <p className="text-xl text-neutral-sage mb-8 leading-relaxed">
              Ghana's premier digital land administration system. Eliminate disputes, 
              verify ownership, and secure your property rights with blockchain-backed technology.
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
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-accent-golden/30 border-2 border-white flex items-center justify-center text-xs">
                      ✓
                    </div>
                  ))}
                </div>
                <span>10k+ Owners</span>
              </div>
            </div>
          </motion.div>
          
          {/* Right Content - Animated Avatars */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <AnimatedAvatars />
          </motion.div>
        </div>
      </div>
      
     
    </section>
  )
}