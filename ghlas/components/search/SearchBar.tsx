'use client'

import { useState } from 'react'
import { Search, MapPin, User, CreditCard, Building } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface SearchBarProps {
  initialQuery?: string
  initialType?: string
}

const searchTypes = [
  { id: 'owner', label: 'Owner Name', icon: User },
  { id: 'ghanaCard', label: 'GhanaCard', icon: CreditCard },
  { id: 'location', label: 'Location', icon: MapPin },
  { id: 'district', label: 'District', icon: Building },
]

export function SearchBar({ initialQuery = '', initialType = 'owner' }: SearchBarProps) {
  const [searchType, setSearchType] = useState(initialType)
  const [query, setQuery] = useState(initialQuery)
  const router = useRouter()

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/search?type=${searchType}&q=${encodeURIComponent(query)}`)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {searchTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSearchType(type.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                searchType === type.id
                  ? 'bg-brand-darkForest text-white'
                  : 'bg-neutral-paleMint text-brand-muted hover:bg-brand-sage/20'
              }`}
            >
              <type.icon className="w-4 h-4" />
              <span>{type.label}</span>
            </button>
          ))}
        </div>
        
        <div className="flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Search by ${searchTypes.find(t => t.id === searchType)?.label.toLowerCase()}...`}
            className="w-full px-4 py-2 pr-12 border border-neutral-coolGray rounded-lg focus:outline-none focus:border-brand-leaf"
          />
          <button
            onClick={handleSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-brand-darkForest hover:text-accent-golden"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}