'use client'

import { HeroSection } from '@/components/landing/HeroSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { SearchSection } from '@/components/landing/SearchSection'
import { WorkflowSection } from '@/components/landing/WorkflowSection'
import { StatsSection } from '@/components/landing/StatsSection'
import { CTASection } from '@/components/landing/CTASection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SearchSection />
      <FeaturesSection />
      <WorkflowSection />
      <StatsSection />
      <CTASection />
    </>
  )
}