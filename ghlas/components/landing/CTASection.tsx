'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Shield, Clock, Headphones } from 'lucide-react'

export function CTASection() {
  return (
    <section className="py-10 bg-gradient-to-r from-neutral-warmCream to-neutral-paleMint">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex p-4 bg-brand-darkForest rounded-md mb-6 shadow-xl">
            <Shield className="w-10 h-10 text-accent-golden" />
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-brand-darkForest mb-4">
            Ready to Secure Your Land?
          </h2>
          <p className="text-md text-brand-muted mb-8 leading-relaxed">
            Join over 250,000 Ghanaians who have already secured their land ownership 
            through our digital land administration system. Start your registration today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-10 sm:mb-12 w-full">
  
  <Link
    href="/register"
    className="btn-accent w-full sm:w-auto inline-flex items-center justify-center gap-2 text-base sm:text-lg px-5 sm:px-8 py-3 group"
  >
    <span>Register Now</span>
    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
  </Link>

  <Link
    href="/contact"
    className="btn-secondary w-full sm:w-auto inline-flex items-center justify-center gap-2 text-base sm:text-lg px-5 sm:px-8 py-3 group"
  >
    <Headphones className="w-4 h-4 sm:w-5 sm:h-5" />
    <span>Contact Support</span>
  </Link>

</div>

          
          <div className="grid sm:grid-cols-3 gap-6 pt-8 border-t border-neutral-coolGray">
            <div className="flex items-center justify-center gap-2 text-brand-muted">
              <Shield className="w-5 h-5 text-accent-golden" />
              <span>Title Deed Certified</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-brand-muted">
              <Clock className="w-5 h-5 text-accent-golden" />
              <span>5-7 Day Processing</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-brand-muted">
              <Headphones className="w-5 h-5 text-accent-golden" />
              <span>24/7 Support</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}