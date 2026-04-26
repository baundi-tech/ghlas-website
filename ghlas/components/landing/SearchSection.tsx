'use client'

import { useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import {
  Search, MapPin, User, CreditCard, Building,
  X, ChevronRight, AlertCircle, CheckCircle2, Users,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

const GhanaMap = dynamic(
  () => import('@/components/ui/GhanaMap').then(m => m.GhanaMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[300px] bg-brand-deepCanopy/8 animate-pulse rounded-xl flex items-center justify-center">
        <MapPin className="w-8 h-8 text-brand-darkForest/30 animate-bounce" />
      </div>
    ),
  }
)

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { RECORDS, DISTRICT_COORDS, fmtCoords, type LandRecord } from '@/lib/land-records'

// ─── Ghana 16 Regions + districts ────────────────────────────────────────────

const GHANA_CENTER: [number, number] = [7.9465, -1.0232]
const GHANA_ZOOM = 7

const REGIONS = [
  { id: 'greater-accra',  name: 'Greater Accra', short: 'G. Accra',  lat: 5.6037,  lng: -0.1870, zoom: 11, districts: ['Accra Metropolitan','Tema Metropolitan','Ga East','Ga West','Ga South','Adentan','Ledzokuku','Kpone-Katamanso','Ningo-Prampram','Shai-Osudoku'] },
  { id: 'ashanti',        name: 'Ashanti',        short: 'Ashanti',   lat: 6.6885,  lng: -1.6244, zoom: 10, districts: ['Kumasi Metropolitan','Oforikrom','Asokwa','Kwadaso','Suame','Kwabre East','Ejisu','Atwima Kwanwoma','Atwima Nwabiagya','Bosomtwe','Mampong Municipal'] },
  { id: 'western',        name: 'Western',        short: 'Western',   lat: 5.1931,  lng: -2.0544, zoom: 10, districts: ['Sekondi-Takoradi','Effia-Kwesimintsim','Ahanta West','Mpohor','Tarkwa-Nsuaem','Nzema East','Ellembelle','Jomoro','Prestea-Huni Valley'] },
  { id: 'western-north',  name: 'Western North',  short: 'W. North',  lat: 6.30,    lng: -2.70,   zoom: 10, districts: ['Sefwi Wiawso','Bibiani-Anhwiaso-Bekwai','Bodi','Sefwi Akontombra','Juaboso','Bia East','Bia West'] },
  { id: 'eastern',        name: 'Eastern',        short: 'Eastern',   lat: 6.3702,  lng: -0.4631, zoom: 10, districts: ['New Juaben North','New Juaben South','Akuapim North','Akuapim South','Abuakwa North','Abuakwa South','Birim Central','Fanteakwa North','Suhum','Kwaebibirem'] },
  { id: 'central',        name: 'Central',        short: 'Central',   lat: 5.5571,  lng: -1.0827, zoom: 10, districts: ['Cape Coast Metropolitan','Komenda-Edina-Eguafo','Mfantsiman','Ajumako-Enyan-Essiam','Assin North','Assin South','Twifo-Atti-Morkwa','Awutu Senya East'] },
  { id: 'volta',          name: 'Volta',          short: 'Volta',     lat: 6.7000,  lng:  0.5000, zoom: 9,  districts: ['Ho Municipal','Ho West','Hohoe','Keta Municipal','Ketu South','Ketu North','Agotime-Ziope','South Tongu','North Tongu','Afadjato South'] },
  { id: 'oti',            name: 'Oti',            short: 'Oti',       lat: 7.9000,  lng:  0.3000, zoom: 9,  districts: ['Krachi East','Krachi West','Nkwanta North','Nkwanta South','Biakoye','Kadjebi','Jasikan','Krachi Nchumuru'] },
  { id: 'bono',           name: 'Bono',           short: 'Bono',      lat: 7.9408,  lng: -2.3000, zoom: 9,  districts: ['Sunyani Municipal','Sunyani West','Berekum East','Berekum West','Dormaa Central','Dormaa East','Dormaa West','Jaman North','Jaman South','Tain'] },
  { id: 'bono-east',      name: 'Bono East',      short: 'Bono East', lat: 7.7500,  lng: -1.0500, zoom: 9,  districts: ['Techiman Municipal','Techiman North','Kintampo North','Kintampo South','Nkoranza North','Nkoranza South','Atebubu-Amantin','Pru East','Pru West'] },
  { id: 'ahafo',          name: 'Ahafo',          short: 'Ahafo',     lat: 7.0000,  lng: -2.5000, zoom: 9,  districts: ['Asunafo North','Asunafo South','Asutifi North','Asutifi South','Tano North','Tano South'] },
  { id: 'northern',       name: 'Northern',       short: 'Northern',  lat: 9.4034,  lng: -0.8424, zoom: 9,  districts: ['Tamale Metropolitan','Sagnarigu','Kumbungu','Tolon','Savelugu','Mion','Zabzugu','Tatale-Sanguli','Nanton','Karaga'] },
  { id: 'savannah',       name: 'Savannah',       short: 'Savannah',  lat: 9.3000,  lng: -1.8000, zoom: 9,  districts: ['Bole','Sawla-Tuna-Kalba','Central Gonja','North Gonja','East Gonja','West Gonja','North East Gonja'] },
  { id: 'north-east',     name: 'North East',     short: 'N. East',   lat: 10.3000, lng: -0.6000, zoom: 9,  districts: ['Nalerigu-Gambaga','Bunkpurugu-Nakpayili','Chereponi','East Mamprusi','West Mamprusi','Mamprugu Moagduri'] },
  { id: 'upper-east',     name: 'Upper East',     short: 'U. East',   lat: 10.7151, lng: -0.9926, zoom: 10, districts: ['Bolgatanga Municipal','Bolgatanga East','Talensi','Bongo','Kasena-Nankana East','Kasena-Nankana West','Builsa North','Builsa South','Bawku Municipal','Garu','Tempane','Binduri','Nabdam'] },
  { id: 'upper-west',     name: 'Upper West',     short: 'U. West',   lat: 10.2529, lng: -2.3232, zoom: 10, districts: ['Wa Municipal','Wa East','Wa West','Nadowli-Kaleo','Daffiama-Bussie-Issa','Sissala East','Sissala West','Jirapa','Lawra','Nandom'] },
]

type Region = typeof REGIONS[number]

const ALL_DISTRICTS = REGIONS.flatMap(r =>
  r.districts.map(d => {
    const c = DISTRICT_COORDS[d]
    return { name: d, region: r.name, lat: c?.lat ?? r.lat, lng: c?.lng ?? r.lng, zoom: c?.zoom ?? Math.min(r.zoom + 1, 13) }
  })
)


// ─── Record card ──────────────────────────────────────────────────────────────

function RecordCard({ record, onClick, compact = false }: { record: LandRecord; onClick?: () => void; compact?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className={`bg-white border border-neutral-200 rounded-xl p-3 ${onClick ? 'cursor-pointer hover:border-brand-darkForest hover:shadow-sm transition-all' : ''}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-brand-darkForest">{record.name}</p>
          <p className="text-xs text-brand-muted mt-0.5">{record.district}, {record.region}</p>
          {!compact && (
            <>
              <p className="text-xs text-brand-muted mt-0.5">Parcel ID: <span className="font-mono text-brand-darkForest">{record.id}</span></p>
              <p className="text-xs text-brand-muted">Area: {record.area} · {record.title}</p>
              <p className="text-xs font-mono text-accent-golden mt-1">{fmtCoords(record.lat, record.lng)}</p>
            </>
          )}
        </div>
        <span className="flex-shrink-0 text-xs px-2 py-0.5 rounded-full bg-brand-darkForest/8 text-brand-darkForest font-medium">{record.title}</span>
      </div>
      {compact && onClick && <p className="text-xs font-mono text-brand-muted mt-1">{fmtCoords(record.lat, record.lng)}</p>}
    </motion.div>
  )
}

// ─── Coordinates badge (shown on map panel) ───────────────────────────────────

function CoordsBadge({ lat, lng, label }: { lat: number; lng: number; label: string }) {
  return (
    <div className="absolute bottom-3 left-3 right-3 z-[500] bg-brand-deepCanopy/80 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2">
      <MapPin className="w-3.5 h-3.5 text-accent-golden flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-white text-xs font-medium truncate">{label}</p>
        <p className="text-accent-golden text-xs font-mono">{fmtCoords(lat, lng)}</p>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

const FILTERS = [
  { id: 'owner',     label: 'Owner Name',   icon: User,       placeholder: 'e.g., Kwame Mensah' },
  { id: 'ghanaCard', label: 'GhanaCard No.', icon: CreditCard, placeholder: 'e.g., GHA-198823741-1' },
  { id: 'district',  label: 'District',     icon: Building,   placeholder: 'e.g., Accra Metropolitan' },
  { id: 'location',  label: 'Map Location', icon: MapPin,     placeholder: 'Choose region & district below' },
]

export function SearchSection() {
  const router = useRouter()

  // ── shared state ──
  const [filter, setFilter]         = useState('owner')
  const [query,  setQuery]          = useState('')
  const [mapCenter, setMapCenter]   = useState<[number, number]>(GHANA_CENTER)
  const [mapZoom,   setMapZoom]     = useState(GHANA_ZOOM)
  const [coordLabel, setCoordLabel] = useState<{ lat: number; lng: number; label: string } | null>(null)
  const debounceRef                 = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── name filter ──
  const [nameSuggestions, setNameSuggestions] = useState<LandRecord[]>([])
  const [duplicateGroup,  setDuplicateGroup]  = useState<LandRecord[]>([])
  const [selectedRecord,  setSelectedRecord]  = useState<LandRecord | null>(null)

  // ── ghanacard filter ──
  const [cardResult,   setCardResult]   = useState<LandRecord | null>(null)
  const [cardNotFound, setCardNotFound] = useState(false)

  // ── district filter ──
  const [districtHits,      setDistrictHits]      = useState<typeof ALL_DISTRICTS>([])
  const [selectedDistrict,  setSelectedDistrict]  = useState<(typeof ALL_DISTRICTS)[number] | null>(null)

  // ── location filter ──
  const [region,      setRegion]      = useState<Region | null>(null)
  const [subDistrict, setSubDistrict] = useState<string | null>(null)

  // ── reset map to Ghana overview ──
  const resetMap = () => {
    setMapCenter(GHANA_CENTER)
    setMapZoom(GHANA_ZOOM)
    setCoordLabel(null)
  }

  // ── switch filter ──
  const handleFilterChange = (id: string) => {
    setFilter(id)
    setQuery('')
    setNameSuggestions([])
    setDuplicateGroup([])
    setSelectedRecord(null)
    setCardResult(null)
    setCardNotFound(false)
    setDistrictHits([])
    setSelectedDistrict(null)
    setRegion(null)
    setSubDistrict(null)
    resetMap()
  }

  // ── input change ──
  const handleQueryChange = (value: string) => {
    setQuery(value)

    if (filter === 'owner') {
      setSelectedRecord(null)
      setDuplicateGroup([])
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        if (value.length < 2) { setNameSuggestions([]); return }
        const hits = RECORDS.filter(r => r.name.toLowerCase().includes(value.toLowerCase()))
        setNameSuggestions(hits)
      }, 250)
    }

    if (filter === 'district') {
      setSelectedDistrict(null)
      if (value.length < 2) { setDistrictHits([]); return }
      setDistrictHits(
        ALL_DISTRICTS.filter(d => d.name.toLowerCase().includes(value.toLowerCase())).slice(0, 8)
      )
    }

    if (filter === 'ghanaCard') {
      setCardResult(null)
      setCardNotFound(false)
    }
  }

  // ── name select (handle duplicates) ──
  const handleNameSelect = (record: LandRecord) => {
    const sameNames = RECORDS.filter(r => r.name === record.name)
    if (sameNames.length > 1) {
      setDuplicateGroup(sameNames)
      setNameSuggestions([])
      setQuery(record.name)
      resetMap()
    } else {
      pinRecord(record)
    }
  }

  const pinRecord = (record: LandRecord) => {
    setSelectedRecord(record)
    setDuplicateGroup([])
    setNameSuggestions([])
    setQuery(record.name)
    setMapCenter([record.lat, record.lng])
    setMapZoom(14)
    setCoordLabel({ lat: record.lat, lng: record.lng, label: `${record.name} — ${record.district}` })
  }

  // ── GhanaCard search ──
  const handleCardSearch = () => {
    const match = RECORDS.find(r => r.ghanaCard.toLowerCase() === query.trim().toLowerCase())
    if (match) {
      setCardResult(match)
      setCardNotFound(false)
      setMapCenter([match.lat, match.lng])
      setMapZoom(14)
      setCoordLabel({ lat: match.lat, lng: match.lng, label: `${match.name} — Parcel ${match.id}` })
    } else {
      setCardResult(null)
      setCardNotFound(true)
      resetMap()
    }
  }

  // ── District select ──
  const handleDistrictSelect = (d: (typeof ALL_DISTRICTS)[number]) => {
    setSelectedDistrict(d)
    setDistrictHits([])
    setQuery(d.name)
    setMapCenter([d.lat, d.lng])
    setMapZoom(d.zoom)
    setCoordLabel({ lat: d.lat, lng: d.lng, label: `${d.name}, ${d.region}` })
  }

  // ── Location region select ──
  const handleRegionSelect = (r: Region) => {
    setRegion(r)
    setSubDistrict(null)
    setQuery(r.name)
    setMapCenter([r.lat, r.lng])
    setMapZoom(r.zoom)
    setCoordLabel({ lat: r.lat, lng: r.lng, label: r.name })
  }

  // ── Location sub-district select ──
  const handleSubDistrictSelect = (d: string) => {
    setSubDistrict(d)
    setQuery(`${d}, ${region?.name}`)
    setCoordLabel({ lat: mapCenter[0], lng: mapCenter[1], label: `${d}, ${region?.name}` })
  }

  const handleSearch = () => {
    if (query.trim()) router.push(`/search?type=${filter}&q=${encodeURIComponent(query.trim())}`)
  }

  const activeFilter = FILTERS.find(f => f.id === filter)!
  const markerLabel  = coordLabel?.label

  return (
    <section className="py-12 bg-gradient-to-b from-neutral-white to-neutral-paleMint">
      <div className="container mx-auto px-4">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-brand-darkForest mb-3">Search Land Parcels</h2>
          <p className="text-sm text-brand-muted max-w-2xl mx-auto">
            Verify ownership instantly — search by owner name, GhanaCard number, district, or pick directly on the map.
          </p>
        </motion.div>

        {/* Grid: controls | map */}
        <div className="max-w-6xl mx-auto lg:grid lg:grid-cols-[1fr_1.15fr] lg:gap-8 lg:items-start">

          {/* ── LEFT: controls ─────────────────────────────────────────── */}
          <div className="space-y-4">

            {/* Filter tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {FILTERS.map(f => (
                <button
                  key={f.id}
                  onClick={() => handleFilterChange(f.id)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                    filter === f.id
                      ? 'bg-brand-darkForest text-white border-brand-darkForest shadow'
                      : 'bg-white text-brand-muted border-neutral-200 hover:border-brand-darkForest hover:text-brand-darkForest'
                  }`}
                >
                  <f.icon className="w-3.5 h-3.5" />
                  {f.label}
                </button>
              ))}
            </div>

            {/* Search input */}
            {filter !== 'location' && (
              <div className="relative bg-white rounded-xl shadow-sm border border-neutral-200 focus-within:border-brand-darkForest transition-colors flex items-center">
                <activeFilter.icon className="w-4 h-4 text-brand-muted ml-4 flex-shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={e => handleQueryChange(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') filter === 'ghanaCard' ? handleCardSearch() : handleSearch()
                  }}
                  placeholder={activeFilter.placeholder}
                  className="flex-1 px-3 py-4 text-sm bg-transparent focus:outline-none"
                />
                {query && (
                  <button onClick={() => handleQueryChange('')} className="mr-2 text-brand-muted hover:text-brand-darkForest">
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={filter === 'ghanaCard' ? handleCardSearch : handleSearch}
                  disabled={!query.trim()}
                  className="m-1.5 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-darkForest text-white text-sm font-semibold disabled:opacity-40 hover:bg-brand-forest transition-colors"
                >
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>
            )}

            {/* ── NAME filter results ── */}
            <AnimatePresence>
              {filter === 'owner' && nameSuggestions.length > 0 && !selectedRecord && !duplicateGroup.length && (
                <motion.div key="name-suggestions" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                  className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden"
                >
                  <p className="text-xs text-brand-muted px-4 pt-3 pb-1">
                    {nameSuggestions.length} result{nameSuggestions.length > 1 ? 's' : ''} found
                  </p>
                  {nameSuggestions.map(r => (
                    <button key={r.id} onClick={() => handleNameSelect(r)}
                      className="w-full text-left px-4 py-2.5 hover:bg-neutral-50 transition-colors flex items-center justify-between gap-2 border-t border-neutral-100 first:border-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-brand-darkForest">{r.name}</p>
                        <p className="text-xs text-brand-muted">{r.district}, {r.region}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-brand-muted flex-shrink-0" />
                    </button>
                  ))}
                </motion.div>
              )}

              {/* Duplicate name prompt */}
              {filter === 'owner' && duplicateGroup.length > 0 && (
                <motion.div key="duplicates" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="bg-white border border-amber-200 rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-center gap-2 text-amber-700">
                    <Users className="w-4 h-4" />
                    <p className="text-sm font-semibold">Multiple records found for "{query}"</p>
                  </div>
                  <p className="text-xs text-brand-muted">Select the correct record to view their land parcel on the map:</p>
                  {duplicateGroup.map(r => (
                    <RecordCard key={r.id} record={r} onClick={() => pinRecord(r)} compact />
                  ))}
                </motion.div>
              )}

              {/* Selected record */}
              {filter === 'owner' && selectedRecord && (
                <motion.div key="selected-record" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-green-700 font-medium">Record found</span>
                  </div>
                  <RecordCard record={selectedRecord} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── GHANACARD filter results ── */}
            <AnimatePresence>
              {filter === 'ghanaCard' && cardResult && (
                <motion.div key="card-result" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-green-700 font-medium">GhanaCard verified</span>
                  </div>
                  <RecordCard record={cardResult} />
                </motion.div>
              )}
              {filter === 'ghanaCard' && cardNotFound && (
                <motion.div key="card-error" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  No land record found for this GhanaCard number.
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── DISTRICT filter results ── */}
            <AnimatePresence>
              {filter === 'district' && districtHits.length > 0 && !selectedDistrict && (
                <motion.div key="district-suggestions" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden"
                >
                  {districtHits.map(d => (
                    <button key={`${d.name}-${d.region}`} onClick={() => handleDistrictSelect(d)}
                      className="w-full text-left px-4 py-2.5 hover:bg-neutral-50 transition-colors flex items-center justify-between border-t border-neutral-100 first:border-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-brand-darkForest">{d.name}</p>
                        <p className="text-xs text-brand-muted">{d.region} · {fmtCoords(d.lat, d.lng)}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-brand-muted flex-shrink-0" />
                    </button>
                  ))}
                </motion.div>
              )}
              {filter === 'district' && selectedDistrict && (
                <motion.div key="district-selected" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-neutral-200 rounded-xl p-4"
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-green-700 font-medium">District located</span>
                  </div>
                  <p className="text-sm font-semibold text-brand-darkForest">{selectedDistrict.name}</p>
                  <p className="text-xs text-brand-muted">{selectedDistrict.region}</p>
                  <p className="text-xs font-mono text-accent-golden mt-1">{fmtCoords(selectedDistrict.lat, selectedDistrict.lng)}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── LOCATION filter flow ── */}
            <AnimatePresence>
              {filter === 'location' && (
                <motion.div key="location-flow" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
                  className="space-y-5 bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm"
                >
                  {/* Region grid */}
                  <div>
                    <p className="text-xs font-semibold text-brand-darkForest/60 uppercase tracking-widest mb-3">Step 1 — Select a Region</p>
                    <div className="grid grid-cols-4 gap-1.5">
                      {REGIONS.map(r => (
                        <button key={r.id} onClick={() => handleRegionSelect(r)}
                          className={`px-2 py-2 rounded-lg text-xs font-medium text-center transition-all duration-200 border ${
                            region?.id === r.id
                              ? 'bg-brand-darkForest text-white border-brand-darkForest shadow-md'
                              : 'bg-white text-brand-darkForest border-neutral-200 hover:border-brand-darkForest hover:bg-brand-darkForest/5'
                          }`}
                        >{r.short}</button>
                      ))}
                    </div>
                  </div>

                  {/* District chips */}
                  {region && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                      <p className="text-xs font-semibold text-brand-darkForest/60 uppercase tracking-widest mb-3">
                        Step 2 — Select a District in {region.name}
                      </p>
                      <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                        {region.districts.map(d => (
                          <button key={d} onClick={() => handleSubDistrictSelect(d)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                              subDistrict === d
                                ? 'bg-accent-golden text-brand-deepCanopy border-accent-golden shadow'
                                : 'bg-white text-brand-darkForest border-neutral-200 hover:border-accent-golden hover:text-accent-golden'
                            }`}
                          >{d}</button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Confirmation row */}
                  {region && (
                    <div className="flex items-center gap-2 text-xs text-brand-darkForest bg-accent-golden/10 border border-accent-golden/30 rounded-lg px-3 py-2">
                      <MapPin className="w-3.5 h-3.5 text-accent-golden flex-shrink-0" />
                      <span>
                        {subDistrict
                          ? <><strong>{subDistrict}</strong>, {region.name}</>
                          : <>{region.name} — pick a district above</>
                        }
                      </span>
                      {subDistrict && (
                        <button onClick={handleSearch} className="ml-auto flex items-center gap-1 bg-brand-darkForest text-white px-3 py-1 rounded-lg">
                          <Search className="w-3 h-3" /> Search
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Map — mobile (below controls) */}
            <div className="lg:hidden rounded-2xl overflow-hidden border border-neutral-200 shadow-sm relative" style={{ height: 320 }}>
              <GhanaMap center={mapCenter} zoom={mapZoom} markerLabel={markerLabel} />
              {coordLabel && <CoordsBadge lat={coordLabel.lat} lng={coordLabel.lng} label={coordLabel.label} />}
            </div>

          </div>

          {/* ── RIGHT: map (desktop) ──────────────────────────────────── */}
          <div className="hidden lg:block sticky top-24 rounded-2xl overflow-hidden border border-neutral-200 shadow-md relative" style={{ height: 520 }}>
            <GhanaMap center={mapCenter} zoom={mapZoom} markerLabel={markerLabel} />
            {coordLabel && <CoordsBadge lat={coordLabel.lat} lng={coordLabel.lng} label={coordLabel.label} />}
          </div>

        </div>

        {/* Popular searches + CTA */}
        <div className="mt-8 max-w-3xl mx-auto space-y-4">
          {filter !== 'location' && !selectedRecord && !cardResult && !selectedDistrict && (
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="text-xs text-brand-muted self-center">Try:</span>
              {[
                { label: 'John Mensah',        action: () => { handleFilterChange('owner');     setTimeout(() => handleQueryChange('John Mensah'), 0) } },
                { label: 'GHA-198823741-1',    action: () => { handleFilterChange('ghanaCard'); setTimeout(() => setQuery('GHA-198823741-1'), 0) } },
                { label: 'Accra Metropolitan', action: () => { handleFilterChange('district');  setTimeout(() => handleQueryChange('Accra Metropolitan'), 0) } },
              ].map(ex => (
                <button key={ex.label} onClick={ex.action}
                  className="text-xs px-3 py-1.5 bg-white rounded-full border border-neutral-200 hover:border-brand-darkForest hover:text-brand-darkForest transition-all shadow-sm"
                >{ex.label}</button>
              ))}
            </div>
          )}

          {/* CTA to full search page */}
          <div className="flex justify-center">
            <Link
              href="/search"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-brand-darkForest text-white text-sm font-semibold shadow-md hover:bg-brand-forest hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              Open Full Search &amp; Map
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}
