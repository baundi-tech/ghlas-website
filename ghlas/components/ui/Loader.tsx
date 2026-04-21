'use client'

import { Loader2 } from 'lucide-react'

export function Loader() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-accent-golden animate-spin mx-auto mb-4" />
        <p className="text-brand-muted">Loading...</p>
      </div>
    </div>
  )
}