'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix default marker icon broken by webpack
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

interface LandParcel {
  id?: string
  parcelId?: string
  owner?: string
  location?: string
  lat?: number
  lng?: number
}

interface MapComponentProps {
  results: LandParcel[]
}

export default function MapComponent({ results }: MapComponentProps) {
  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden mb-6 shadow-md">
      <MapContainer
        center={[7.9465, -1.0232]}
        zoom={7}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {results.map((parcel, i) => (
          parcel.lat && parcel.lng && (
            <Marker key={parcel.id ?? i} position={[parcel.lat, parcel.lng]}>
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold">{parcel.parcelId ?? `Parcel ${i + 1}`}</p>
                  {parcel.owner && <p>{parcel.owner}</p>}
                  {parcel.location && <p>{parcel.location}</p>}
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  )
}
