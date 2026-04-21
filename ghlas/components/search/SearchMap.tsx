'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Loader } from '@/components/ui/Loader'

// Dynamically import Leaflet to avoid SSR issues
const MapComponent = dynamic(
  () => import('../../app/search/MapComponent'),
  { 
    ssr: false,
    loading: () => <Loader />
  }
)

interface SearchMapProps {
  results: any[]
}

export function SearchMap({ results }: SearchMapProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <Loader />
  }

  return <MapComponent results={results} />
}