'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const slides = [
  { src: '/images/1.png', alt: 'Disagreement — land dispute begins' },
  { src: '/images/2.png', alt: 'Mediation — neutral ground is found' },
  { src: '/images/3.png', alt: 'Understanding — records are reviewed together' },
  { src: '/images/4.png', alt: 'Agreement — both parties reach a resolution' },
  { src: '/images/5.png', alt: 'Handshake — ownership is confirmed' },
  { src: '/images/6.png', alt: 'Unity — community land rights secured' },
]

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
}

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

export function HeroSlider() {
  const [index, setIndex] = useState(0)
  const [dir, setDir]     = useState(1)

  const go = useCallback((next: number) => {
    setDir(next > index ? 1 : -1)
    setIndex(next)
  }, [index])

  const prev = () => go((index - 1 + slides.length) % slides.length)
  const next = () => go((index + 1) % slides.length)

  useEffect(() => {
    const t = setInterval(() => {
      setDir(1)
      setIndex(i => (i + 1) % slides.length)
    }, 4500)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10">
      <AnimatePresence custom={dir} mode="wait">
        <motion.div
          key={index}
          custom={dir}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.45, ease: EASE }}
          className="absolute inset-0"
        >
          <Image
            src={slides[index].src}
            alt={slides[index].alt}
            fill
            className="object-fill"
            priority={index === 0}
          />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/65 to-transparent" />
          <p className="absolute bottom-14 left-5 text-sm text-white/80 font-medium tracking-wide">
            {slides[index].alt}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Prev / Next buttons */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white hover:bg-black/50 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white hover:bg-black/50 transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? 'w-6 bg-accent-golden' : 'w-1.5 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
