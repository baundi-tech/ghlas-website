'use client'

import { useState } from 'react'
import { Search, MapPin, User, CreditCard, Building, Filter } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export function SearchSection() {
  const [searchType, setSearchType] = useState('owner')
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const searchOptions = [
    { id: 'owner', label: 'Owner Name', icon: User, placeholder: 'e.g., John Mensah' },
    { id: 'ghanaCard', label: 'GhanaCard Number', icon: CreditCard, placeholder: 'e.g., GHA-123456789-1' },
    { id: 'location', label: 'Map Location', icon: MapPin, placeholder: 'e.g., Coordinates or address' },
    { id: 'district', label: 'District', icon: Building, placeholder: 'e.g., Accra Metropolitan' },
  ]

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?type=${searchType}&q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <section className="py-20 bg-gradient-to-b from-neutral-white to-neutral-paleMint">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-brand-darkForest mb-4">
            Search Land Parcels
          </h2>
          <p className="text-xl text-brand-muted max-w-2xl mx-auto">
            Instantly verify land ownership and search by owner name, GhanaCard number, 
            location on map, or district
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Search Type Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {searchOptions.map((option) => (
              <motion.button
                key={option.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSearchType(option.id)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full transition-all duration-200 ${
                  searchType === option.id
                    ? 'bg-brand-darkForest text-white shadow-lg'
                    : 'bg-neutral-white text-brand-muted hover:bg-brand-sage/20'
                }`}
              >
                <option.icon className="w-4 h-4" />
                <span className="font-medium">{option.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-leaf to-accent-golden rounded-xl blur opacity-0 group-hover:opacity-25 transition-opacity duration-300" />
            <div className="relative bg-white rounded-xl shadow-xl">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={searchOptions.find(o => o.id === searchType)?.placeholder}
                className="w-full px-6 py-4 text-lg rounded-xl border-2 border-transparent focus:border-brand-leaf focus:outline-none transition-all"
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-accent inline-flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
          </div>

          {/* Quick Search Examples */}
          <div className="mt-8 flex flex-wrap gap-2 justify-center">
            <span className="text-sm text-brand-muted flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Popular searches:
            </span>
            {['John Mensah', 'GHA-123456-789', 'Greater Accra', 'Tema District'].map((example) => (
              <button
                key={example}
                onClick={() => setSearchQuery(example)}
                className="text-sm px-4 py-1.5 bg-white rounded-full hover:bg-brand-leaf hover:text-white transition-all duration-200 shadow-sm"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}