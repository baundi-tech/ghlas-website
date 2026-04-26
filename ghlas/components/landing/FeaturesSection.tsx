'use client'

import { motion } from 'framer-motion'
import { Shield, FileCheck, MapPin, Bell, Lock, Users } from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'Title Deed Registry',
    description: 'Tamper-proof government-issued title deeds backed by the Lands Commission of Ghana',
    color: 'text-brand-leaf'
  },
  {
    icon: FileCheck,
    title: 'Automatic Overlap Detection',
    description: 'Real-time detection of duplicate or conflicting registrations',
    color: 'text-accent-golden'
  },
  {
    icon: MapPin,
    title: 'GPS Survey Integration',
    description: 'Licensed surveyors can submit GPS boundary data directly',
    color: 'text-brand-leaf'
  },
  {
    icon: Bell,
    title: 'SMS Notifications',
    description: 'Real-time alerts to affected parties during transactions',
    color: 'text-accent-orange'
  },
  {
    icon: Lock,
    title: 'Secure Ownership',
    description: 'Verified ownership through GhanaCard integration',
    color: 'text-accent-golden'
  },
  {
    icon: Users,
    title: 'Multi-role Access',
    description: 'Role-based access for public, owners, surveyors, and officers',
    color: 'text-brand-leaf'
  },
]

export function FeaturesSection() {
  return (
    <section className="py-10 bg-neutral-paleMint">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-brand-darkForest mb-4">
            Powerful Features
          </h2>
          <p className="text-md text-brand-muted max-w-3xl mx-auto">
            Everything you need to manage land records securely and efficiently in one unified platform
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className="card group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`${feature.color} mb-4 transition-transform group-hover:scale-110 duration-300`}>
                <feature.icon className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-semibold text-brand-darkForest mb-2">
                {feature.title}
              </h3>
              <p className="text-brand-muted leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}