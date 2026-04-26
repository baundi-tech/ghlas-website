'use client'

import dynamic from 'next/dynamic'
import { Loader } from '@/components/ui/Loader'
import type { LandRecord } from '@/lib/land-records'

const MapComponent = dynamic(
  () => import('../../app/search/MapComponent'),
  { ssr: false, loading: () => <Loader /> }
)

const GHANA_CENTER: [number, number] = [7.9465, -1.0232]

interface SearchMapProps {
  results: LandRecord[]
  selected?: LandRecord | null
  onSelect?: (r: LandRecord) => void
  mapCenter?: [number, number]
  mapZoom?: number
}

export function SearchMap({
  results,
  selected = null,
  onSelect = () => {},
  mapCenter = GHANA_CENTER,
  mapZoom = 7,
}: SearchMapProps) {
  return (
    <MapComponent
      results={results}
      selected={selected}
      onSelect={onSelect}
      mapCenter={mapCenter}
      mapZoom={mapZoom}
    />
  )
}