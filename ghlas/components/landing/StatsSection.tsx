'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { Users, FileText, MapPin, CheckCircle, TrendingUp, Building } from 'lucide-react'

const stats = [
  {
    icon: Users,
    value: 250000,
    label: 'Registered Landowners',
    suffix: '+',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: FileText,
    value: 500000,
    label: 'Digital Records',
    suffix: '+',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: MapPin,
    value: 16,
    label: 'Regions Covered',
    suffix: '',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: CheckCircle,
    value: 98,
    label: 'Dispute Resolution Rate',
    suffix: '%',
    color: 'from-accent-golden to-orange-500'
  },
  {
    icon: Building,
    value: 260,
    label: 'Districts Active',
    suffix: '+',
    color: 'from-red-500 to-orange-500'
  },
  {
    icon: TrendingUp,
    value: 150,
    label: 'Efficiency Increase',
    suffix: '%',
    color: 'from-teal-500 to-green-500'
  }
]

function Counter({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref)

  useEffect(() => {
    if (isInView) {
      let startTime: number
      let animationFrame: number

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / duration, 1)
        setCount(Math.floor(progress * end))
        
        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate)
        }
      }
      
      animationFrame = requestAnimationFrame(animate)
      return () => cancelAnimationFrame(animationFrame)
    }
  }, [isInView, end, duration])

  return <span ref={ref}>{count.toLocaleString()}</span>
}

export function StatsSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-brand-darkForest via-brand-forest to-brand-deepCanopy relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
      </div>
      
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Our Impact So Far
          </h2>
          <p className="text-xl text-neutral-sage max-w-2xl mx-auto">
            Transforming land administration across Ghana with measurable results
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center text-white"
            >
              <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${stat.color} bg-opacity-20 mb-4`}>
                <stat.icon className="w-8 h-8 text-accent-golden" />
              </div>
              <div className="text-4xl font-bold mb-2">
                <Counter end={stat.value} />
                {stat.suffix}
              </div>
              <p className="text-neutral-sage text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
        
        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full">
            <CheckCircle className="w-5 h-5 text-accent-golden" />
            <span className="text-white text-sm">Trusted by Government of Ghana</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}