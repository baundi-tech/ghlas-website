'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Users, Handshake, Scale, Award, Shield } from 'lucide-react'

const scenes = [
  {
    id: 1,
    title: "Dispute Detected",
    description: "Two parties disputing land boundary",
    icon: Users,
    action: "arguing",
    color: "from-red-500/20 to-orange-500/20"
  },
  {
    id: 2,
    title: "System Mediation",
    description: "AI analyzes digital records and GPS data",
    icon: Scale,
    action: "mediating",
    color: "from-blue-500/20 to-cyan-500/20"
  },
  {
    id: 3,
    title: "Evidence Presented",
    description: "Blockchain records verify ownership",
    icon: Shield,
    action: "verifying",
    color: "from-green-500/20 to-emerald-500/20"
  },
  {
    id: 4,
    title: "Dispute Resolved",
    description: "Both parties agree on resolution",
    icon: Handshake,
    action: "resolving",
    color: "from-accent-golden/20 to-orange-500/20"
  },
  {
    id: 5,
    title: "Title Secured",
    description: "Ownership permanently recorded",
    icon: Award,
    action: "secured",
    color: "from-purple-500/20 to-pink-500/20"
  }
]

export function AnimatedAvatars() {
  const [currentScene, setCurrentScene] = useState(0)
  const SceneIcon = scenes[currentScene].icon

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentScene((prev) => (prev + 1) % scenes.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative h-[500px] w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene}
          initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <div className={`bg-gradient-to-br ${scenes[currentScene].color} backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20`}>
            {/* Avatar Group */}
            <div className="flex justify-around items-center h-64">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  animate={
                    currentScene === 0
                      ? { x: [-15, 15, -15], rotate: [-8, 8, -8] }
                      : currentScene === 2
                      ? { scale: [1, 1.15, 1] }
                      : currentScene === 3
                      ? { y: [0, -15, 0] }
                      : { y: [0, -10, 0] }
                  }
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  className="relative"
                >
                  <div className="w-28 h-28 bg-gradient-to-br from-accent-golden to-accent-orange rounded-full flex items-center justify-center shadow-xl">
                    <Users className="w-14 h-14 text-white" />
                  </div>
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-20 h-3 bg-black/30 rounded-full blur-sm" />
                </motion.div>
              ))}
            </div>
            
            {/* Scene Description */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center mt-8"
            >
              <div className="inline-block p-3 bg-white/10 rounded-full mb-4 backdrop-blur-sm">
                <SceneIcon className="w-8 h-8 text-accent-golden" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {scenes[currentScene].title}
              </h3>
              <p className="text-neutral-sage text-lg">
                {scenes[currentScene].description}
              </p>
            </motion.div>
            
            {/* Progress Indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {scenes.map((_, idx) => (
                <motion.div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentScene ? 'w-8 bg-accent-golden' : 'w-4 bg-white/30'
                  }`}
                  onClick={() => setCurrentScene(idx)}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}