'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

const GHANA_DEFAULT: [number, number] = [7.9465, -1.0232]

const markerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

interface Props {
  center: [number, number]
  zoom: number
  markerLabel?: string
}

export function GhanaMap({ center, zoom, markerLabel }: Props) {
  // Guard against NaN values before they reach Leaflet
  const safeCenter: [number, number] =
    Array.isArray(center) && !isNaN(center[0]) && !isNaN(center[1])
      ? center
      : GHANA_DEFAULT
  const safeZoom = isNaN(zoom) ? 7 : zoom

  return (
    // key forces a clean remount whenever the center changes,
    // avoiding the Strict-Mode double-effect NaN crash entirely
    <MapContainer
      key={`${safeCenter[0]},${safeCenter[1]},${safeZoom}`}
      center={safeCenter}
      zoom={safeZoom}
      scrollWheelZoom={false}
      style={{ width: '100%', height: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {markerLabel && (
        <Marker position={safeCenter} icon={markerIcon}>
          <Popup>{markerLabel}</Popup>
        </Marker>
      )}
    </MapContainer>
  )
}
