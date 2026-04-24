'use client'

import { motion } from 'framer-motion'
import { Upload, FileSearch, CheckCircle, Users, ClipboardCheck, Award } from 'lucide-react'

const workflows = [
  {
    step: 1,
    title: 'Submit Application',
    description: 'Fill registration form and upload required documents including proof of ownership',
    icon: Upload,
    role: 'Land Owner',
    color: 'from-brand-darkForest to-brand-forest'
  },
  {
    step: 2,
    title: 'Surveyor Verification',
    description: 'Licensed surveyor submits GPS boundary data and certifies parcel dimensions',
    icon: Users,
    role: 'Licensed Surveyor',
    color: 'from-brand-darkForest to-brand-forest'
  },
  {
    step: 3,
    title: 'Officer Review',
    description: 'Registration officer verifies documents, runs overlap detection, and validates data',
    icon: FileSearch,
    role: 'Registration Officer',
    color: 'from-brand-darkForest to-brand-forest'
  },
  {
    step: 4,
    title: 'Quality Assurance',
    description: 'Senior officer conducts final checks and conflict resolution',
    icon: ClipboardCheck,
    role: 'Senior Officer',
    color: 'from-brand-darkForest to-brand-forest'
  },
  {
    step: 5,
    title: 'Final Approval',
    description: 'Registrar approves, issues digital title, and records on blockchain',
    icon: CheckCircle,
    role: 'Registrar',
    color: 'from-brand-darkForest to-brand-forest'
  }
]

export function WorkflowSection() {
  return (
    <section className="py-10 bg-neutral-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-brand-darkForest mb-4">
            Registration Workflow
          </h2>
          <p className="text-md text-brand-muted max-w-3xl mx-auto">
            Streamlined 5-step process from application to secure ownership, ensuring transparency at every stage
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection Line */}
          <div className="absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-brand-darkForest via-brand-forest to-brand-darkForest hidden lg:block" />
          
          <div className="grid lg:grid-cols-5 gap-6 relative">
            {workflows.map((workflow, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                <div className="card text-center relative z-10 hover:shadow-2xl transition-all duration-300">
                  {/* Step Number */}
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${workflow.color} flex items-center justify-center text-white font-bold shadow-lg`}>
                      {workflow.step}
                    </div>
                  </div>
                  
                  {/* Icon */}
                  <div className="mt-6 mb-4">
                    <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${workflow.color} bg-opacity-10 flex items-center justify-center`}>
                      <workflow.icon className="w-10 h-10 text-accent-golden" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-brand-darkForest mb-2">
                    {workflow.title}
                  </h3>
                  <p className="text-brand-muted text-sm mb-3 leading-relaxed">
                    {workflow.description}
                  </p>
                  
                  {/* Role Badge */}
                  <span className="inline-block px-3 py-1 bg-gradient-to-r from-brand-darkForest/10 to-brand-forest/10 text-brand-darkForest text-xs rounded-full font-medium">
                    {workflow.role}
                  </span>
                </div>
                
                {/* Connector Arrow (mobile) */}
                {index < workflows.length - 1 && (
                  <div className="lg:hidden text-center my-2">
                    <div className="inline-block w-8 h-0.5 bg-brand-leaf" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
        
        
      </div>
    </section>
  )
}