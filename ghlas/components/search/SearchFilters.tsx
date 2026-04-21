'use client'

import { useState } from 'react'
import { ChevronDown, Filter, DollarSign, Ruler, Calendar } from 'lucide-react'

interface SearchFiltersProps {
  onFilterChange: (filters: any) => void
}

export function SearchFilters({ onFilterChange }: SearchFiltersProps) {
  const [filters, setFilters] = useState({
    minArea: '',
    maxArea: '',
    minPrice: '',
    maxPrice: '',
    registrationDate: '',
    status: ''
  })

  const handleChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6 pb-2 border-b border-neutral-coolGray">
        <Filter className="w-5 h-5 text-accent-golden" />
        <h3 className="font-semibold text-brand-darkForest">Filters</h3>
      </div>
      
      {/* Area Filter */}
      <div className="mb-6">
        <label className="label flex items-center gap-2">
          <Ruler className="w-4 h-4" />
          Area (Acres)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minArea}
            onChange={(e) => handleChange('minArea', e.target.value)}
            className="input text-sm"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxArea}
            onChange={(e) => handleChange('maxArea', e.target.value)}
            className="input text-sm"
          />
        </div>
      </div>
      
      {/* Price Filter */}
      <div className="mb-6">
        <label className="label flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          Price Range (GHS)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => handleChange('minPrice', e.target.value)}
            className="input text-sm"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => handleChange('maxPrice', e.target.value)}
            className="input text-sm"
          />
        </div>
      </div>
      
      {/* Registration Date */}
      <div className="mb-6">
        <label className="label flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Registration Date
        </label>
        <input
          type="date"
          value={filters.registrationDate}
          onChange={(e) => handleChange('registrationDate', e.target.value)}
          className="input text-sm"
        />
      </div>
      
      {/* Status Filter */}
      <div className="mb-6">
        <label className="label">Status</label>
        <select
          value={filters.status}
          onChange={(e) => handleChange('status', e.target.value)}
          className="input text-sm"
        >
          <option value="">All</option>
          <option value="registered">Registered</option>
          <option value="pending">Pending</option>
          <option value="disputed">Disputed</option>
          <option value="transferred">Transferred</option>
        </select>
      </div>
      
      {/* Reset Button */}
      <button
        onClick={() => {
          setFilters({
            minArea: '', maxArea: '', minPrice: '', maxPrice: '', registrationDate: '', status: ''
          })
          onFilterChange({})
        }}
        className="w-full btn-secondary text-sm"
      >
        Reset Filters
      </button>
    </div>
  )
}