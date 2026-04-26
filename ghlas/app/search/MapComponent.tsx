'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { fmtCoords, type LandRecord } from '@/lib/land-records'

// ── icons ──────────────────────────────────────────────────────────────────────
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
})

const activeIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
})

// ── fly-to controller (only fires when selected changes, not on mount) ─────────
function FlyToSelected({ selected }: { selected: LandRecord | null }) {
  const map = useMap()
  useEffect(() => {
    if (!selected || isNaN(selected.lat) || isNaN(selected.lng)) return
    map.flyTo([selected.lat, selected.lng], 14, { duration: 1.0 })
  }, [selected, map])
  return null
}

// ── status badge colours ───────────────────────────────────────────────────────
const statusColor: Record<string, string> = {
  registered: '#16a34a',
  pending:    '#d97706',
  disputed:   '#dc2626',
  transferred:'#2563eb',
}

interface Props {
  results:    LandRecord[]
  selected:   LandRecord | null
  onSelect:   (r: LandRecord) => void
  mapCenter:  [number, number]
  mapZoom:    number
}

export default function MapComponent({ results, selected, onSelect, mapCenter, mapZoom }: Props) {
  return (
    <div className="relative w-full h-full">
      <MapContainer
        key={`${mapCenter[0]},${mapCenter[1]},${mapZoom}`}
        center={mapCenter}
        zoom={mapZoom}
        scrollWheelZoom
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <FlyToSelected selected={selected} />

        {results.map(r => (
          <Marker
            key={r.id}
            position={[r.lat, r.lng]}
            icon={selected?.id === r.id ? activeIcon : defaultIcon}
            eventHandlers={{ click: () => onSelect(r) }}
          >
            <Popup>
              <div className="text-sm min-w-[180px]">
                <p className="font-semibold text-gray-900">{r.name}</p>
                <p className="text-gray-500 text-xs mt-0.5">{r.district}, {r.region}</p>
                <p className="text-gray-500 text-xs">Parcel: <span className="font-mono">{r.id}</span></p>
                <p className="text-gray-500 text-xs">Area: {r.area} · {r.title}</p>
                <p className="text-xs font-mono mt-1" style={{ color: statusColor[r.status] ?? '#555' }}>
                  {fmtCoords(r.lat, r.lng)}
                </p>
                <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: `${statusColor[r.status] ?? '#888'}22`, color: statusColor[r.status] ?? '#555' }}>
                  {r.status}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Coordinates overlay */}
      {selected && (
        <div className="absolute bottom-3 left-3 z-[500] bg-gray-900/80 backdrop-blur-sm text-white rounded-lg px-3 py-2 text-xs pointer-events-none">
          <span className="opacity-70">Selected · </span>
          <span className="font-mono text-yellow-400">{fmtCoords(selected.lat, selected.lng)}</span>
        </div>
      )}
    </div>
  )
}
