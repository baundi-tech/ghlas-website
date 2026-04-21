'use client'

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useEffect } from 'react'

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface MapComponentProps {
  results: any[]
}

function MapController({ results }: MapComponentProps) {
  const map = useMap()
  
  useEffect(() => {
    if (results.length > 0 && results[0].latitude && results[0].longitude) {
      map.setView([results[0].latitude, results[0].longitude], 13)
    }
  }, [results, map])
  
  return null
}

export default function MapComponent({ results }: MapComponentProps) {
  const defaultCenter: [number, number] = [7.9465, -1.0232] // Ghana center

  return (
    <MapContainer
      center={defaultCenter}
      zoom={7}
      style={{ height: '400px', width: '100%', borderRadius: '0.75rem', zIndex: 1 }}
      className="rounded-xl shadow-lg"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {results.map((result: any) => (
        result.latitude && result.longitude && (
          <Marker key={result.id} position={[result.latitude, result.longitude]}>
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-semibold text-brand-darkForest">{result.ownerName}</h3>
                <p className="text-sm text-brand-muted">Parcel ID: {result.parcelId}</p>
                <p className="text-sm text-brand-muted">Area: {result.area} acres</p>
                <p className="text-sm text-brand-muted">Status: {result.status}</p>
              </div>
            </Popup>
          </Marker>
        )
      ))}
      <MapController results={results} />
    </MapContainer>
  )
}