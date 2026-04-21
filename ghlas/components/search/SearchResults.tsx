'use client'

import { MapPin, User, Calendar, FileText, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface SearchResultsProps {
  results: any[]
}

export function SearchResults({ results }: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-12 text-center">
        <FileText className="w-16 h-16 text-neutral-coolGray mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-brand-darkForest mb-2">No Results Found</h3>
        <p className="text-brand-muted">
          Try adjusting your search criteria or browse the map to find parcels
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-brand-muted mb-2">
        Found {results.length} parcel{results.length !== 1 ? 's' : ''}
      </div>
      
      {results.map((parcel) => (
        <div key={parcel.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-brand-darkForest mb-1">
                {parcel.ownerName}
              </h3>
              <p className="text-brand-muted text-sm">Parcel ID: {parcel.parcelId}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              parcel.status === 'registered' ? 'bg-green-100 text-green-700' :
              parcel.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {parcel.status}
            </span>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm text-brand-muted">
              <MapPin className="w-4 h-4" />
              <span>{parcel.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-brand-muted">
              <User className="w-4 h-4" />
              <span>Owner: {parcel.ownerName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-brand-muted">
              <Calendar className="w-4 h-4" />
              <span>Registered: {parcel.registrationDate}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-brand-muted">
              <FileText className="w-4 h-4" />
              <span>Area: {parcel.area} acres</span>
            </div>
          </div>
          
          <Link
            href={`/parcels/${parcel.id}`}
            className="inline-flex items-center gap-2 text-accent-golden hover:text-accent-darkGold transition-colors"
          >
            View Details
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      ))}
    </div>
  )
}