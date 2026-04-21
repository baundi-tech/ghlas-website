'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { SearchBar } from '@/components/search/SearchBar'
import { SearchFilters } from '@/components/search/SearchFilters'
import { SearchResults } from '@/components/search/SearchResults'
import { SearchMap } from '@/components/search/SearchMap'
import { Loader } from '@/components/ui/Loader'

function SearchContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const initialType = searchParams.get('type') || 'owner'
  
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  return (
    <div className="min-h-screen bg-neutral-paleMint">
      <div className="bg-brand-darkForest text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4">Search Land Parcels</h1>
          <p className="text-neutral-sage">
            Search by owner name, GhanaCard number, location, or district
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <SearchBar initialQuery={initialQuery} initialType={initialType} />
        </div>
        
        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <SearchFilters onFilterChange={(filters) => console.log(filters)} />
          </div>
          <div className="lg:col-span-3">
            <SearchMap results={results} />
            {loading ? (
              <Loader />
            ) : (
              <SearchResults results={results} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<Loader />}>
      <SearchContent />
    </Suspense>
  )
}
