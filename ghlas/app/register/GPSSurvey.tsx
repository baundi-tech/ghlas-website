'use client'

import { useState } from 'react'
import {
  MapPin, Navigation, Crosshair, Loader2, CheckCircle, AlertTriangle,
  X, Hash, RefreshCw, Search,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface BoundaryPoint { lat: number; lng: number }

export interface GPSFormSlice {
  gpsCoordinates:  string
  gpsAccuracy:     number | null
  digitalAddress:  string
  street:          string
  suburb:          string
  landmark:        string
  surveyorName:    string
  surveyDate:      string
  boundaryPoints:  BoundaryPoint[]
}

interface GPSSurveyProps {
  formData:       GPSFormSlice
  updateFormData: (patch: Partial<GPSFormSlice>) => void
}

interface NominatimAddr {
  road?:          string
  suburb?:        string
  neighbourhood?: string
  quarter?:       string
  city?:          string
  town?:          string
  village?:       string
  county?:        string
  state?:         string
  postcode?:      string
}
interface NominatimResult {
  display_name: string
  address:      NominatimAddr
}

// ─── Ghana Post GPS helpers ───────────────────────────────────────────────────

const REGION_CODES: Record<string, string> = {
  'Greater Accra': 'GA', 'Ashanti': 'AS', 'Western': 'WE', 'Western North': 'WN',
  'Eastern': 'EA', 'Central': 'CE', 'Volta': 'VO', 'Oti': 'OT',
  'Bono': 'BO', 'Bono East': 'BE', 'Ahafo': 'AH', 'Northern': 'NO',
  'Savannah': 'SA', 'North East': 'NE', 'Upper East': 'UE', 'Upper West': 'UW',
}

function regionCode(state?: string): string {
  if (!state) return 'GH'
  for (const [name, code] of Object.entries(REGION_CODES)) {
    if (state.toLowerCase().includes(name.toLowerCase())) return code
  }
  return 'GH'
}

function makeDigitalAddress(lat: number, lng: number, code: string): string {
  // Approximates the Ghana Post GPS XX-NNN-NNNN format from coordinates
  const p1 = Math.abs(Math.round((Math.abs(lat) % 1) * 1000)).toString().padStart(3, '0').slice(0, 3)
  const p2 = Math.abs(Math.round((Math.abs(lng) % 1) * 10000)).toString().padStart(4, '0').slice(0, 4)
  return `${code}-${p1}-${p2}`
}

// ─── Main component ───────────────────────────────────────────────────────────

export function GPSSurvey({ formData, updateFormData }: GPSSurveyProps) {
  const [gettingLocation, setGettingLocation] = useState(false)
  const [geocoding,       setGeocoding]       = useState(false)
  const [gpsError,        setGpsError]        = useState<string | null>(null)
  const [geocodeResult,   setGeocodeResult]   = useState<NominatimResult | null>(null)

  const boundaryPoints: BoundaryPoint[] = formData.boundaryPoints ?? []

  const parsed: BoundaryPoint | null = formData.gpsCoordinates
    ? JSON.parse(formData.gpsCoordinates)
    : null

  // ── Reverse geocode → auto-fill address fields ──────────────────────────────
  const reverseGeocode = async (lat: number, lng: number, overwriteDigital = false) => {
    setGeocoding(true)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
        { headers: { 'User-Agent': 'GHLAS-LandRegistration/1.0' } },
      )
      if (!res.ok) throw new Error()
      const data: NominatimResult = await res.json()
      setGeocodeResult(data)

      const addr   = data.address
      const street = addr.road ?? ''
      const suburb = addr.suburb ?? addr.neighbourhood ?? addr.quarter ?? addr.city ?? addr.town ?? addr.village ?? ''
      const code   = regionCode(addr.state)
      const digital = makeDigitalAddress(lat, lng, code)

      updateFormData({
        street,
        suburb,
        // Only overwrite digital address if explicitly requested or not yet filled
        ...(overwriteDigital || !formData.digitalAddress ? { digitalAddress: digital } : {}),
      })
    } catch {
      // Silently degrade — user can still fill manually
    } finally {
      setGeocoding(false)
    }
  }

  // ── GPS device ──────────────────────────────────────────────────────────────
  const getCurrentLocation = () => {
    setGettingLocation(true)
    setGpsError(null)

    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by this browser.')
      setGettingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude, accuracy } }) => {
        updateFormData({
          gpsCoordinates: JSON.stringify({ lat: latitude, lng: longitude }),
          gpsAccuracy: accuracy,
        })
        setGettingLocation(false)
        reverseGeocode(latitude, longitude)
      },
      err => { setGpsError(err.message); setGettingLocation(false) },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    )
  }

  // ── Manual coordinate entry ─────────────────────────────────────────────────
  const handleManualEntry = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const els = (e.target as HTMLFormElement).elements
    const lat = parseFloat((els.namedItem('lat') as HTMLInputElement).value)
    const lng = parseFloat((els.namedItem('lng') as HTMLInputElement).value)
    if (!isNaN(lat) && !isNaN(lng)) {
      updateFormData({ gpsCoordinates: JSON.stringify({ lat, lng }), gpsAccuracy: null })
      reverseGeocode(lat, lng)
    }
  }

  // ── Boundary points ─────────────────────────────────────────────────────────
  const addBoundaryPoint = () => {
    if (!parsed) return
    updateFormData({ boundaryPoints: [...boundaryPoints, parsed] })
  }

  const removeBoundaryPoint = (i: number) => {
    updateFormData({ boundaryPoints: boundaryPoints.filter((_, idx) => idx !== i) })
  }

  // ── Keyboard nav ────────────────────────────────────────────────────────────
  const onEnterNext = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return
    e.preventDefault()
    const fields = Array.from(document.querySelectorAll<HTMLElement>(
      'input:not([type="hidden"]):not([type="file"]):not([type="radio"]):not([type="checkbox"]):not([disabled]),' +
      'select:not([disabled])',
    ))
    const idx = fields.indexOf(e.currentTarget)
    if (idx !== -1) fields[idx + 1]?.focus()
  }

  // ── Shared input class ──────────────────────────────────────────────────────
  const inp = 'w-full py-2.5 px-3 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:border-brand-leaf focus:ring-2 focus:ring-brand-leaf/20 transition-all'
  const lbl = 'block text-xs font-bold text-brand-darkForest/60 uppercase tracking-wider mb-1.5'

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">

        {/* ── LEFT: GPS capture ──────────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Device GPS */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-100">
            <h3 className="font-semibold text-brand-darkForest mb-1">Get Current Location</h3>
            <p className="text-xs text-brand-muted mb-4">
              Stand at the property and tap the button for the most accurate GPS reading.
            </p>

            <button type="button" onClick={getCurrentLocation} disabled={gettingLocation}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand-darkForest text-white text-sm font-bold hover:bg-brand-forest transition-colors disabled:opacity-50"
            >
              {gettingLocation
                ? <><Loader2 className="w-4 h-4 animate-spin" />Getting Location…</>
                : <><Crosshair className="w-4 h-4" />Get GPS Coordinates</>
              }
            </button>

            {gpsError && (
              <div className="mt-3 flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
                <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-red-700">{gpsError}</p>
              </div>
            )}

            {parsed && (
              <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-xs font-semibold text-green-700">Coordinates Captured</span>
                </div>
                <p className="text-xs font-mono text-green-700">
                  {parsed.lat.toFixed(6)}, {parsed.lng.toFixed(6)}
                </p>
                {formData.gpsAccuracy != null && (
                  <p className="text-[11px] text-green-500 mt-0.5">±{Math.round(formData.gpsAccuracy)} m accuracy</p>
                )}
              </div>
            )}
          </div>

          {/* Manual entry */}
          <div className="border border-neutral-200 rounded-xl p-5">
            <h3 className="font-semibold text-brand-darkForest mb-3">Manual Coordinate Entry</h3>
            <form onSubmit={handleManualEntry} className="space-y-3">
              <div>
                <label className={lbl}>Latitude</label>
                <input name="lat" type="number" step="any" placeholder="e.g., 5.6037" className={inp} required />
              </div>
              <div>
                <label className={lbl}>Longitude</label>
                <input name="lng" type="number" step="any" placeholder="e.g., -0.1870" className={inp} required />
              </div>
              <button type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-brand-darkForest text-brand-darkForest text-sm font-bold hover:bg-brand-darkForest hover:text-white transition-colors"
              >
                <Search className="w-4 h-4" /> Set & Look Up Location
              </button>
            </form>
          </div>

          {/* Geocode result card */}
          {geocoding && (
            <div className="border border-neutral-200 rounded-xl p-4 flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-brand-darkForest/40 animate-spin flex-shrink-0" />
              <p className="text-sm text-brand-muted">Looking up address details…</p>
            </div>
          )}
          {geocodeResult && !geocoding && (
            <div className="border border-brand-leaf/30 bg-brand-leaf/5 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-brand-leaf flex-shrink-0" />
                <p className="text-xs font-bold text-brand-darkForest/60 uppercase tracking-wider">Location Found</p>
              </div>
              <p className="text-xs text-brand-darkForest leading-relaxed line-clamp-2">{geocodeResult.display_name}</p>
              {geocodeResult.address.state && (
                <p className="text-[11px] text-brand-muted mt-1.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {[geocodeResult.address.county, geocodeResult.address.state].filter(Boolean).join(' · ')}
                </p>
              )}
            </div>
          )}
        </div>

        {/* ── RIGHT: Address details & surveyor ──────────────────────────── */}
        <div className="space-y-4">

          {/* Digital address */}
          <div className="border border-neutral-200 rounded-xl p-5">
            <h3 className="font-semibold text-brand-darkForest mb-0.5">Ghana Post Digital Address</h3>
            <p className="text-xs text-brand-muted mb-3">
              Format: <span className="font-mono">XX-000-0000</span> e.g. GA-183-2016. Enter manually or generate from coordinates.
            </p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-darkForest/35 pointer-events-none" />
                <input
                  type="text"
                  value={formData.digitalAddress}
                  onChange={e => updateFormData({ digitalAddress: e.target.value })}
                  onKeyDown={onEnterNext}
                  placeholder="e.g., GA-183-2016"
                  className="w-full py-2.5 pl-9 pr-3 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:border-brand-leaf focus:ring-2 focus:ring-brand-leaf/20 transition-all font-mono"
                />
              </div>
              <button
                type="button"
                onClick={() => parsed && reverseGeocode(parsed.lat, parsed.lng, true)}
                disabled={!parsed || geocoding}
                title="Generate digital address from GPS coordinates"
                className="flex items-center gap-1.5 px-3 rounded-xl border border-neutral-200 text-brand-darkForest text-xs font-bold hover:bg-brand-darkForest hover:text-white hover:border-brand-darkForest transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {geocoding ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                <span className="hidden sm:inline">Generate</span>
              </button>
            </div>
          </div>

          {/* Street / area / landmark */}
          <div className="border border-neutral-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-brand-darkForest">Property Address Details</h3>
              {geocoding && <Loader2 className="w-4 h-4 text-brand-darkForest/30 animate-spin" />}
            </div>

            <div>
              <label className={lbl}>
                Street / Road
                <span className="ml-1 text-[11px] normal-case font-normal text-brand-leaf">(auto-filled from GPS)</span>
              </label>
              <input
                type="text"
                value={formData.street}
                onChange={e => updateFormData({ street: e.target.value })}
                onKeyDown={onEnterNext}
                placeholder="e.g., Liberation Road"
                className={inp}
              />
            </div>

            <div>
              <label className={lbl}>
                Area / Suburb
                <span className="ml-1 text-[11px] normal-case font-normal text-brand-leaf">(auto-filled from GPS)</span>
              </label>
              <input
                type="text"
                value={formData.suburb}
                onChange={e => updateFormData({ suburb: e.target.value })}
                onKeyDown={onEnterNext}
                placeholder="e.g., East Legon, Labadi"
                className={inp}
              />
            </div>

            <div>
              <label className={lbl}>Nearest Landmark</label>
              <input
                type="text"
                value={formData.landmark}
                onChange={e => updateFormData({ landmark: e.target.value })}
                onKeyDown={onEnterNext}
                placeholder="e.g., Near Accra Mall, Opp. Shell Filling Station"
                className={inp}
              />
            </div>
          </div>

          {/* Surveyor */}
          <div className="border border-neutral-200 rounded-xl p-5 space-y-4">
            <h3 className="font-semibold text-brand-darkForest">Licensed Surveyor</h3>
            <div>
              <label className={lbl}>Surveyor Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formData.surveyorName}
                onChange={e => updateFormData({ surveyorName: e.target.value })}
                onKeyDown={onEnterNext}
                placeholder="Full name of licensed surveyor"
                className={inp}
              />
            </div>
            <div>
              <label className={lbl}>Survey Date <span className="text-red-500">*</span></label>
              <input
                type="date"
                value={formData.surveyDate}
                onChange={e => updateFormData({ surveyDate: e.target.value })}
                onKeyDown={onEnterNext}
                className={inp}
              />
            </div>
          </div>

          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 flex gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed">
              <span className="font-bold block mb-1">Important Notice</span>
              GPS coordinates must be validated by a licensed surveyor. The system will automatically
              check for boundary overlaps with existing registered parcels.
            </p>
          </div>
        </div>
      </div>

      {/* ── Boundary points ──────────────────────────────────────────────────── */}
      <div className="border-t border-neutral-100 pt-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-brand-darkForest">Boundary Points</h3>
            <p className="text-xs text-brand-muted mt-0.5">
              Walk the perimeter and add at least 4 points to define the parcel boundary.
            </p>
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
            boundaryPoints.length >= 4 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
          }`}>
            {boundaryPoints.length}/4 min
          </span>
        </div>

        {boundaryPoints.length > 0 && (
          <div className="space-y-2 mb-3">
            {boundaryPoints.map((pt, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 bg-neutral-paleMint rounded-xl">
                <MapPin className="w-4 h-4 text-accent-golden flex-shrink-0" />
                <span className="font-mono text-xs text-brand-darkForest flex-1">
                  Point {i + 1} — {pt.lat.toFixed(6)}, {pt.lng.toFixed(6)}
                </span>
                <button type="button" onClick={() => removeBoundaryPoint(i)}
                  className="text-red-400 hover:text-red-600 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={addBoundaryPoint}
          disabled={!parsed}
          className="w-full py-2.5 rounded-xl border-2 border-dashed border-neutral-200 text-sm font-semibold text-brand-darkForest/60 hover:border-brand-darkForest hover:text-brand-darkForest transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Navigation className="w-4 h-4" />
          Add Current GPS Point as Boundary
        </button>

        {boundaryPoints.length > 0 && boundaryPoints.length < 4 && (
          <p className="text-xs text-amber-600 mt-2 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            {4 - boundaryPoints.length} more point{4 - boundaryPoints.length !== 1 ? 's' : ''} needed
          </p>
        )}
      </div>
    </div>
  )
}
