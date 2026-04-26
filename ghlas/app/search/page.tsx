'use client'

import { useState, useRef, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, MapPin, User, CreditCard, Building, X, ChevronRight,
  AlertCircle, CheckCircle2, Users, Calendar, Ruler,
  LayoutList, Map, ExternalLink, SlidersHorizontal,
  ArrowLeft, Shield, Hash, Layers, Globe, ChevronDown,
} from 'lucide-react'
import { RECORDS, DISTRICT_COORDS, searchRecords, fmtCoords, type LandRecord } from '@/lib/land-records'

// ─── Dynamic map ──────────────────────────────────────────────────────────────
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-brand-darkForest/5 to-brand-forest/10">
      <MapPin className="w-10 h-10 text-brand-darkForest/25 animate-bounce mb-3" />
      <p className="text-sm text-brand-darkForest/40 font-medium">Loading map…</p>
    </div>
  ),
})

// ─── Constants ────────────────────────────────────────────────────────────────
const GHANA_CENTER: [number, number] = [7.9465, -1.0232]
const GHANA_ZOOM = 7

const REGIONS = [
  { id: 'greater-accra',  short: 'G. Accra',  name: 'Greater Accra', lat: 5.6037,  lng: -0.1870, zoom: 11, districts: ['Accra Metropolitan','Tema Metropolitan','Ga East','Ga West','Ga South','Adentan','Ledzokuku','Kpone-Katamanso','Ningo-Prampram','Shai-Osudoku'] },
  { id: 'ashanti',        short: 'Ashanti',   name: 'Ashanti',       lat: 6.6885,  lng: -1.6244, zoom: 10, districts: ['Kumasi Metropolitan','Oforikrom','Asokwa','Kwadaso','Suame','Kwabre East','Ejisu','Atwima Kwanwoma','Atwima Nwabiagya','Mampong Municipal'] },
  { id: 'western',        short: 'Western',   name: 'Western',       lat: 5.1931,  lng: -2.0544, zoom: 10, districts: ['Sekondi-Takoradi','Effia-Kwesimintsim','Ahanta West','Tarkwa-Nsuaem','Nzema East','Ellembelle','Jomoro','Prestea-Huni Valley'] },
  { id: 'western-north',  short: 'W. North',  name: 'Western North', lat: 6.30,    lng: -2.70,   zoom: 10, districts: ['Sefwi Wiawso','Bibiani-Anhwiaso-Bekwai','Bodi','Sefwi Akontombra','Juaboso','Bia East','Bia West'] },
  { id: 'eastern',        short: 'Eastern',   name: 'Eastern',       lat: 6.3702,  lng: -0.4631, zoom: 10, districts: ['New Juaben North','New Juaben South','Akuapim North','Akuapim South','Abuakwa North','Birim Central','Fanteakwa North','Suhum','Kwaebibirem'] },
  { id: 'central',        short: 'Central',   name: 'Central',       lat: 5.5571,  lng: -1.0827, zoom: 10, districts: ['Cape Coast Metropolitan','Komenda-Edina-Eguafo','Mfantsiman','Ajumako-Enyan-Essiam','Assin North','Assin South','Awutu Senya East'] },
  { id: 'volta',          short: 'Volta',     name: 'Volta',         lat: 6.7000,  lng:  0.5000, zoom: 9,  districts: ['Ho Municipal','Ho West','Hohoe','Keta Municipal','Ketu South','Ketu North','Agotime-Ziope','South Tongu','North Tongu','Afadjato South'] },
  { id: 'oti',            short: 'Oti',       name: 'Oti',           lat: 7.9000,  lng:  0.3000, zoom: 9,  districts: ['Krachi East','Krachi West','Nkwanta North','Nkwanta South','Biakoye','Kadjebi','Jasikan','Krachi Nchumuru'] },
  { id: 'bono',           short: 'Bono',      name: 'Bono',          lat: 7.9408,  lng: -2.3000, zoom: 9,  districts: ['Sunyani Municipal','Sunyani West','Berekum East','Berekum West','Dormaa Central','Dormaa East','Dormaa West','Jaman North','Jaman South','Tain'] },
  { id: 'bono-east',      short: 'Bono East', name: 'Bono East',     lat: 7.7500,  lng: -1.0500, zoom: 9,  districts: ['Techiman Municipal','Techiman North','Kintampo North','Kintampo South','Nkoranza North','Nkoranza South','Atebubu-Amantin','Pru East','Pru West'] },
  { id: 'ahafo',          short: 'Ahafo',     name: 'Ahafo',         lat: 7.0000,  lng: -2.5000, zoom: 9,  districts: ['Asunafo North','Asunafo South','Asutifi North','Asutifi South','Tano North','Tano South'] },
  { id: 'northern',       short: 'Northern',  name: 'Northern',      lat: 9.4034,  lng: -0.8424, zoom: 9,  districts: ['Tamale Metropolitan','Sagnarigu','Kumbungu','Tolon','Savelugu','Mion','Zabzugu','Tatale-Sanguli','Nanton','Karaga'] },
  { id: 'savannah',       short: 'Savannah',  name: 'Savannah',      lat: 9.3000,  lng: -1.8000, zoom: 9,  districts: ['Bole','Sawla-Tuna-Kalba','Central Gonja','North Gonja','East Gonja','West Gonja','North East Gonja'] },
  { id: 'north-east',     short: 'N. East',   name: 'North East',    lat: 10.3000, lng: -0.6000, zoom: 9,  districts: ['Nalerigu-Gambaga','Bunkpurugu-Nakpayili','Chereponi','East Mamprusi','West Mamprusi','Mamprugu Moagduri'] },
  { id: 'upper-east',     short: 'U. East',   name: 'Upper East',    lat: 10.7151, lng: -0.9926, zoom: 10, districts: ['Bolgatanga Municipal','Bolgatanga East','Talensi','Bongo','Kasena-Nankana East','Kasena-Nankana West','Builsa North','Builsa South','Bawku Municipal','Garu','Tempane','Binduri','Nabdam'] },
  { id: 'upper-west',     short: 'U. West',   name: 'Upper West',    lat: 10.2529, lng: -2.3232, zoom: 10, districts: ['Wa Municipal','Wa East','Wa West','Nadowli-Kaleo','Daffiama-Bussie-Issa','Sissala East','Sissala West','Jirapa','Lawra','Nandom'] },
]
type Region = typeof REGIONS[number]

const ALL_DISTRICTS = REGIONS.flatMap(r =>
  r.districts.map(d => {
    const c = DISTRICT_COORDS[d]
    return { name: d, region: r.name, lat: c?.lat ?? r.lat, lng: c?.lng ?? r.lng, zoom: c?.zoom ?? Math.min(r.zoom + 1, 13) }
  })
)

const FILTERS = [
  { id: 'owner',     label: 'Owner Name',    icon: User,       placeholder: 'e.g., Kwame Mensah' },
  { id: 'ghanaCard', label: 'GhanaCard No.', icon: CreditCard, placeholder: 'e.g., GHA-198823741-1' },
  { id: 'district',  label: 'District',      icon: Building,   placeholder: 'e.g., Accra Metropolitan' },
  { id: 'location',  label: 'Map Location',  icon: MapPin,     placeholder: 'Pick region then district' },
]

const STATUS_STYLES: Record<string, { pill: string; dot: string }> = {
  registered:  { pill: 'bg-emerald-100 text-emerald-700 border-emerald-200',  dot: 'bg-emerald-500' },
  pending:     { pill: 'bg-amber-100 text-amber-700 border-amber-200',        dot: 'bg-amber-500' },
  disputed:    { pill: 'bg-red-100 text-red-700 border-red-200',              dot: 'bg-red-500' },
  transferred: { pill: 'bg-blue-100 text-blue-700 border-blue-200',           dot: 'bg-blue-500' },
}

// ─── Small sub-components ─────────────────────────────────────────────────────

function StatusPill({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? { pill: 'bg-gray-100 text-gray-600 border-gray-200', dot: 'bg-gray-400' }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${s.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

function DetailRow({ icon: Icon, label, value, mono = false }: { icon: React.ElementType; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="w-3.5 h-3.5 text-brand-darkForest/40 mt-0.5 flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-brand-darkForest/40 font-semibold leading-none mb-0.5">{label}</p>
        <p className={`text-xs text-brand-darkForest font-medium truncate ${mono ? 'font-mono' : ''}`}>{value}</p>
      </div>
    </div>
  )
}

// Rich result card shown in the left panel list
function ResultCard({ record, active, onClick }: { record: LandRecord; active: boolean; onClick: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className={`group rounded-2xl border p-4 cursor-pointer transition-all duration-200 ${
        active
          ? 'bg-brand-darkForest border-brand-darkForest shadow-lg shadow-brand-darkForest/15'
          : 'bg-white border-neutral-200 hover:border-brand-darkForest/40 hover:shadow-md'
      }`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0">
          <p className={`font-bold text-sm truncate ${active ? 'text-white' : 'text-brand-darkForest'}`}>{record.name}</p>
          <p className={`text-xs mt-0.5 truncate ${active ? 'text-white/60' : 'text-brand-muted'}`}>
            {record.district}, {record.region}
          </p>
        </div>
        <StatusPill status={record.status} />
      </div>

      {/* Detail grid */}
      <div className={`grid grid-cols-2 gap-2.5 pt-3 border-t ${active ? 'border-white/15' : 'border-neutral-100'}`}>
        <DetailRow icon={Hash}     label="Parcel ID"    value={record.id}                 mono />
        <DetailRow icon={Shield}   label="Title Type"   value={record.title} />
        <DetailRow icon={Ruler}    label="Area"         value={record.area} />
        <DetailRow icon={Calendar} label="Registered"   value={record.registrationDate} />
      </div>

      {/* GhanaCard (partially masked) */}
      <div className={`mt-2.5 pt-2.5 border-t flex items-center justify-between ${active ? 'border-white/15' : 'border-neutral-100'}`}>
        <div className="flex items-center gap-1.5">
          <CreditCard className={`w-3 h-3 ${active ? 'text-white/50' : 'text-brand-muted'}`} />
          <p className={`text-[11px] font-mono ${active ? 'text-white/60' : 'text-brand-muted'}`}>
            {record.ghanaCard.replace(/(\w{3}-)\d{5}(\d{4}-\d)/, '$1•••••$2')}
          </p>
        </div>
        <p className={`text-[10px] font-mono font-semibold ${active ? 'text-accent-golden' : 'text-accent-golden'}`}>
          {fmtCoords(record.lat, record.lng)}
        </p>
      </div>

      {/* View details link */}
      <div className={`mt-2.5 flex items-center justify-between`}>
        <Link
          href={`/parcels/${record.id}`}
          onClick={e => e.stopPropagation()}
          className={`inline-flex items-center gap-1 text-xs font-medium transition-colors ${
            active ? 'text-accent-golden hover:text-white' : 'text-brand-darkForest/50 hover:text-accent-golden'
          }`}
        >
          View full details <ExternalLink className="w-3 h-3" />
        </Link>
        {active && (
          <span className="text-[10px] text-white/50 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> Pinned on map
          </span>
        )}
      </div>
    </motion.div>
  )
}

// Floating info card shown on the map when a record is selected
function MapInfoCard({ record, onClose }: { record: LandRecord; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      className="absolute bottom-6 left-4 right-4 sm:left-6 sm:right-auto sm:w-80 z-[500] bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-brand-darkForest px-4 py-3 flex items-start justify-between">
        <div>
          <p className="text-white font-bold text-sm">{record.name}</p>
          <p className="text-white/60 text-xs mt-0.5">{record.district}, {record.region}</p>
        </div>
        <button onClick={onClose} className="text-white/50 hover:text-white mt-0.5">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <DetailRow icon={Hash}     label="Parcel ID"  value={record.id}    mono />
          <DetailRow icon={Shield}   label="Title"      value={record.title} />
          <DetailRow icon={Ruler}    label="Area"       value={record.area}  />
          <DetailRow icon={Calendar} label="Registered" value={record.registrationDate} />
        </div>

        <div className="pt-2 border-t border-neutral-100">
          <p className="text-[10px] uppercase tracking-wider text-brand-darkForest/40 font-semibold mb-1">Coordinates</p>
          <p className="text-xs font-mono text-accent-golden font-semibold">{fmtCoords(record.lat, record.lng)}</p>
          <p className="text-[10px] font-mono text-brand-muted mt-0.5">{record.lat.toFixed(6)}, {record.lng.toFixed(6)}</p>
        </div>

        <div className="flex items-center justify-between pt-1">
          <StatusPill status={record.status} />
          <Link href={`/parcels/${record.id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-darkForest hover:text-accent-golden transition-colors"
          >
            Full details <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ hasQuery }: { hasQuery: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-brand-darkForest/6 flex items-center justify-center mb-4">
        {hasQuery ? <AlertCircle className="w-8 h-8 text-brand-darkForest/30" /> : <Search className="w-8 h-8 text-brand-darkForest/30" />}
      </div>
      <p className="font-semibold text-brand-darkForest mb-1">
        {hasQuery ? 'No parcels found' : 'Search to get started'}
      </p>
      <p className="text-xs text-brand-muted max-w-xs">
        {hasQuery
          ? 'Try a different name, GhanaCard number, or district. Make sure the spelling is correct.'
          : 'Search by owner name, GhanaCard number, district or pick a location on the map to view registered land parcels.'}
      </p>
    </div>
  )
}

// ─── Main search content ──────────────────────────────────────────────────────
function SearchContent() {
  const searchParams = useSearchParams()
  const router       = useRouter()

  // Compute initial values from URL params synchronously — avoids a useEffect setState cascade
  const initT = searchParams.get('type') || 'owner'
  const initQ = searchParams.get('q')    || ''
  const initHits    = initQ ? searchRecords(initT, initQ) : []
  const initSelected: LandRecord | null = initHits.length === 1 ? initHits[0] : null
  const initCenter: [number, number] = initHits.length === 1
    ? [initHits[0].lat, initHits[0].lng]
    : initHits.length > 1
      ? [initHits.reduce((s, r) => s + r.lat, 0) / initHits.length, initHits.reduce((s, r) => s + r.lng, 0) / initHits.length]
      : GHANA_CENTER
  const initZoom = initHits.length === 1 ? 14 : initHits.length > 1 ? 7 : GHANA_ZOOM

  const [filter,     setFilter]     = useState(initT)
  const [query,      setQuery]      = useState(initQ)
  const [results,    setResults]    = useState<LandRecord[]>(initHits)
  const [selected,   setSelected]   = useState<LandRecord | null>(initSelected)
  const [mobileView, setMobileView] = useState<'search' | 'map'>('search')

  // map
  const [mapCenter, setMapCenter] = useState<[number, number]>(initCenter)
  const [mapZoom,   setMapZoom]   = useState(initZoom)

  // name
  const [nameSuggestions, setNameSuggestions] = useState<LandRecord[]>([])
  const [duplicateGroup,  setDuplicateGroup]  = useState<LandRecord[]>([])
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ghanacard
  const [cardNotFound, setCardNotFound] = useState(false)

  // district
  const [districtHits,     setDistrictHits]     = useState<typeof ALL_DISTRICTS>([])
  const [selectedDistrict, setSelectedDistrict] = useState<typeof ALL_DISTRICTS[number] | null>(null)

  // location
  const [region,      setRegion]      = useState<Region | null>(null)
  const [subDistrict, setSubDistrict] = useState<string | null>(null)

  // sidebar refinement
  const [sideFilters, setSideFilters] = useState({ minArea: '', maxArea: '', status: '', date: '' })
  const [filtersOpen, setFiltersOpen] = useState(false)

  // ── helpers ──
  const resetAll = () => {
    setResults([]); setSelected(null)
    setNameSuggestions([]); setDuplicateGroup([])
    setCardNotFound(false)
    setDistrictHits([]); setSelectedDistrict(null)
    setRegion(null); setSubDistrict(null)
    setMapCenter(GHANA_CENTER); setMapZoom(GHANA_ZOOM)
  }

  const pinRecord = (r: LandRecord) => {
    setSelected(r); setDuplicateGroup([]); setNameSuggestions([])
    setQuery(r.name)
    setMapCenter([r.lat, r.lng]); setMapZoom(14)
    setMobileView('map')
  }

  const handleFilterSwitch = (id: string) => { setFilter(id); setQuery(''); resetAll() }

  const handleQueryChange = (val: string) => {
    setQuery(val); setCardNotFound(false)
    if (filter === 'owner') {
      setSelected(null); setDuplicateGroup([])
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        if (val.length < 2) return setNameSuggestions([])
        setNameSuggestions(RECORDS.filter(r => r.name.toLowerCase().includes(val.toLowerCase())))
      }, 250)
    }
    if (filter === 'district') {
      setSelectedDistrict(null)
      if (val.length < 2) return setDistrictHits([])
      setDistrictHits(ALL_DISTRICTS.filter(d => d.name.toLowerCase().includes(val.toLowerCase())).slice(0, 10))
    }
  }

  const handleNameSelect = (r: LandRecord) => {
    const same = RECORDS.filter(x => x.name === r.name)
    if (same.length > 1) {
      setDuplicateGroup(same); setResults(same); setNameSuggestions([]); setQuery(r.name)
      const avgLat = same.reduce((s, x) => s + x.lat, 0) / same.length
      const avgLng = same.reduce((s, x) => s + x.lng, 0) / same.length
      setMapCenter([avgLat, avgLng]); setMapZoom(7)
    } else {
      setResults([r]); pinRecord(r)
    }
  }

  const handleCardSearch = () => {
    const match = RECORDS.find(r => r.ghanaCard.toLowerCase() === query.trim().toLowerCase())
    if (match) { setResults([match]); setCardNotFound(false); pinRecord(match) }
    else { setResults([]); setCardNotFound(true); setMapCenter(GHANA_CENTER); setMapZoom(GHANA_ZOOM) }
  }

  const handleDistrictSelect = (d: typeof ALL_DISTRICTS[number]) => {
    setSelectedDistrict(d); setDistrictHits([]); setQuery(d.name)
    const hits = searchRecords('district', d.name)
    setResults(hits); setMapCenter([d.lat, d.lng]); setMapZoom(d.zoom)
    router.replace(`/search?type=district&q=${encodeURIComponent(d.name)}`)
  }

  const handleRegionSelect = (r: Region) => {
    setRegion(r); setSubDistrict(null)
    setMapCenter([r.lat, r.lng]); setMapZoom(r.zoom)
    setResults(searchRecords('location', r.name))
  }

  const handleSubDistrictSelect = (d: string) => {
    setSubDistrict(d); setQuery(`${d}, ${region?.name}`)
    const hits = searchRecords('location', d)
    setResults(hits)
    router.replace(`/search?type=location&q=${encodeURIComponent(d)}`)
  }

  const runSearch = () => {
    if (!query.trim()) return
    if (filter === 'ghanaCard') return handleCardSearch()
    const hits = searchRecords(filter, query)
    setResults(hits)
    if (hits.length === 1) pinRecord(hits[0])
    else if (hits.length > 1) {
      const avgLat = hits.reduce((s, r) => s + r.lat, 0) / hits.length
      const avgLng = hits.reduce((s, r) => s + r.lng, 0) / hits.length
      setMapCenter([avgLat, avgLng]); setMapZoom(7)
    }
    router.replace(`/search?type=${filter}&q=${encodeURIComponent(query)}`)
  }

  const displayed = results.filter(r => {
    if (sideFilters.status && r.status !== sideFilters.status) return false
    if (sideFilters.minArea && parseFloat(r.area) < parseFloat(sideFilters.minArea)) return false
    if (sideFilters.maxArea && parseFloat(r.area) > parseFloat(sideFilters.maxArea)) return false
    if (sideFilters.date && r.registrationDate < sideFilters.date) return false
    return true
  })

  const activeFilter = FILTERS.find(f => f.id === filter)!
  const hasQuery     = !!query.trim() || !!region

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-neutral-paleMint">

      {/* ═══════════════ TOP NAV BAR ════════════════════════════════════════════ */}
      <header className="flex-shrink-0 bg-brand-deepCanopy text-white z-40 shadow-lg">
        {/* Top strip */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>
          <div className="w-px h-4 bg-white/20 hidden sm:block" />
          <div className="flex items-center gap-2 min-w-0">
            <Globe className="w-4 h-4 text-accent-golden flex-shrink-0" />
            <h1 className="font-bold text-sm sm:text-base truncate">Ghana Land Parcel Search</h1>
          </div>
          <div className="ml-auto flex items-center gap-2 text-xs text-white/50 hidden md:flex">
            <span className="flex items-center gap-1"><Layers className="w-3 h-3" />{RECORDS.length} Demo Records</span>
            <span>·</span>
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />16 Regions</span>
            <span>·</span>
            <span>All Districts</span>
          </div>
        </div>

        {/* Filter tabs + search input */}
        <div className="px-4 py-3 space-y-2.5">
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
            {FILTERS.map(f => (
              <button key={f.id} onClick={() => handleFilterSwitch(f.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  filter === f.id
                    ? 'bg-accent-golden text-brand-deepCanopy border-accent-golden shadow-md'
                    : 'border-white/20 text-white/70 hover:border-white/50 hover:text-white'
                }`}
              >
                <f.icon className="w-3.5 h-3.5" />
                {f.label}
              </button>
            ))}
          </div>

          {filter !== 'location' && (
            <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl backdrop-blur-sm focus-within:border-accent-golden/60 transition-colors">
              <activeFilter.icon className="w-4 h-4 text-white/50 ml-3 flex-shrink-0" />
              <input
                type="text"
                value={query}
                onChange={e => handleQueryChange(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && runSearch()}
                placeholder={activeFilter.placeholder}
                className="flex-1 px-2 py-2.5 text-sm bg-transparent text-white placeholder-white/40 focus:outline-none"
              />
              {query && (
                <button onClick={() => { setQuery(''); resetAll() }} className="text-white/40 hover:text-white mr-1">
                  <X className="w-4 h-4" />
                </button>
              )}
              <button onClick={runSearch}
                className="m-1.5 flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent-golden text-brand-deepCanopy text-sm font-bold hover:bg-accent-yellow transition-colors flex-shrink-0"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Results / Map toggle */}
        <div className="lg:hidden flex border-t border-white/10">
          {(['search', 'map'] as const).map(tab => (
            <button key={tab} onClick={() => setMobileView(tab)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition-colors ${
                mobileView === tab ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'
              }`}
            >
              {tab === 'search'
                ? <><LayoutList className="w-4 h-4" /> Results {results.length > 0 && <span className="bg-accent-golden text-brand-deepCanopy rounded-full px-1.5 py-0.5 text-[10px] font-bold ml-1">{displayed.length}</span>}</>
                : <><Map className="w-4 h-4" /> Map {selected && <span className="bg-accent-golden text-brand-deepCanopy rounded-full px-1.5 py-0.5 text-[10px] font-bold ml-1">1</span>}</>
              }
            </button>
          ))}
        </div>
      </header>

      {/* ═══════════════ BODY (sidebar + map) ══════════════════════════════════ */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── LEFT PANEL ────────────────────────────────────────────────────── */}
        <div className={`
          ${mobileView === 'search' ? 'flex' : 'hidden'} lg:flex
          flex-col w-full lg:w-[420px] xl:w-[460px] flex-shrink-0
          bg-white border-r border-neutral-200 overflow-hidden
        `}>

          {/* Flow UI (suggestions, location picker, etc.) */}
          <div className="flex-shrink-0 border-b border-neutral-100">
            <AnimatePresence>

              {/* Name suggestions dropdown */}
              {filter === 'owner' && nameSuggestions.length > 0 && !duplicateGroup.length && (
                <motion.div key="sug" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="border-b border-neutral-100"
                >
                  <p className="text-[10px] text-brand-muted px-4 pt-2.5 pb-1 uppercase tracking-wider font-semibold">
                    {nameSuggestions.length} match{nameSuggestions.length > 1 ? 'es' : ''}
                  </p>
                  {nameSuggestions.map(r => (
                    <button key={r.id} onClick={() => handleNameSelect(r)}
                      className="w-full text-left px-4 py-2.5 hover:bg-neutral-50 flex items-center justify-between gap-3 border-t border-neutral-100 first:border-0 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-brand-darkForest truncate">{r.name}</p>
                        <p className="text-xs text-brand-muted truncate">{r.district}, {r.region}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <StatusPill status={r.status} />
                        <ChevronRight className="w-4 h-4 text-brand-muted" />
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}

              {/* Duplicate name prompt */}
              {filter === 'owner' && duplicateGroup.length > 0 && (
                <motion.div key="dup" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="bg-amber-50 border-b border-amber-200 px-4 py-3"
                >
                  <div className="flex items-center gap-2 text-amber-700 mb-2">
                    <Users className="w-4 h-4" />
                    <p className="text-xs font-bold">Multiple people named "{query}" — select the right one</p>
                  </div>
                  {duplicateGroup.map(r => (
                    <button key={r.id} onClick={() => pinRecord(r)}
                      className="w-full text-left bg-white border border-neutral-200 rounded-xl p-3 mb-2 last:mb-0 hover:border-brand-darkForest transition-all"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-sm font-bold text-brand-darkForest">{r.name}</p>
                        <StatusPill status={r.status} />
                      </div>
                      <p className="text-xs text-brand-muted">{r.district}, {r.region}</p>
                      <p className="text-xs text-brand-muted mt-0.5">Parcel <span className="font-mono">{r.id}</span> · {r.area} · {r.title}</p>
                      <p className="text-[11px] font-mono text-accent-golden mt-1">{fmtCoords(r.lat, r.lng)}</p>
                    </button>
                  ))}
                </motion.div>
              )}

              {/* GhanaCard not found */}
              {filter === 'ghanaCard' && cardNotFound && (
                <motion.div key="notfound" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex items-center gap-2 px-4 py-3 bg-red-50 border-b border-red-200 text-red-700 text-sm"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  No land record found for this GhanaCard number.
                </motion.div>
              )}

              {/* District autocomplete */}
              {filter === 'district' && districtHits.length > 0 && !selectedDistrict && (
                <motion.div key="dhits" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="border-b border-neutral-100 max-h-64 overflow-y-auto"
                >
                  <p className="text-[10px] text-brand-muted px-4 pt-2.5 pb-1 uppercase tracking-wider font-semibold sticky top-0 bg-white">
                    {districtHits.length} districts found
                  </p>
                  {districtHits.map(d => (
                    <button key={`${d.name}-${d.region}`} onClick={() => handleDistrictSelect(d)}
                      className="w-full text-left px-4 py-2.5 hover:bg-neutral-50 flex items-center justify-between border-t border-neutral-100 first:border-0 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-semibold text-brand-darkForest">{d.name}</p>
                        <p className="text-xs text-brand-muted">{d.region} · <span className="font-mono">{fmtCoords(d.lat, d.lng)}</span></p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-brand-muted flex-shrink-0" />
                    </button>
                  ))}
                </motion.div>
              )}

              {/* Location region + district picker */}
              {filter === 'location' && (
                <motion.div key="loc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 border-b border-neutral-100 space-y-4">
                  <div>
                    <p className="text-[10px] font-bold text-brand-darkForest/50 uppercase tracking-widest mb-2.5">Step 1 — Select a Region</p>
                    <div className="grid grid-cols-4 gap-1.5">
                      {REGIONS.map(r => (
                        <button key={r.id} onClick={() => handleRegionSelect(r)}
                          className={`py-1.5 rounded-lg text-[11px] font-semibold border transition-all text-center ${
                            region?.id === r.id
                              ? 'bg-brand-darkForest text-white border-brand-darkForest shadow'
                              : 'border-neutral-200 text-brand-darkForest hover:border-brand-darkForest bg-white'
                          }`}
                        >{r.short}</button>
                      ))}
                    </div>
                  </div>

                  {region && (
                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                      <p className="text-[10px] font-bold text-brand-darkForest/50 uppercase tracking-widest mb-2.5">
                        Step 2 — District in {region.name}
                      </p>
                      <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                        {region.districts.map(d => (
                          <button key={d} onClick={() => handleSubDistrictSelect(d)}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                              subDistrict === d
                                ? 'bg-accent-golden text-brand-deepCanopy border-accent-golden shadow'
                                : 'bg-white border-neutral-200 text-brand-darkForest hover:border-accent-golden'
                            }`}
                          >{d}</button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {region && (
                    <div className="flex items-center gap-2 bg-brand-darkForest/5 border border-brand-darkForest/15 rounded-xl px-3 py-2 text-xs">
                      <MapPin className="w-3.5 h-3.5 text-accent-golden flex-shrink-0" />
                      <span className="text-brand-darkForest">
                        {subDistrict ? <><strong>{subDistrict}</strong>, {region.name}</> : <>{region.name} · select a district above</>}
                      </span>
                      {subDistrict && (
                        <button onClick={runSearch} className="ml-auto flex items-center gap-1 bg-brand-darkForest text-white px-3 py-1 rounded-lg text-[11px] font-bold">
                          <Search className="w-3 h-3" /> Search
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Refinement filters toggle */}
          <div className="flex-shrink-0 border-b border-neutral-100">
            <button onClick={() => setFiltersOpen(!filtersOpen)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-brand-darkForest/60 hover:text-brand-darkForest transition-colors"
            >
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Refine Results
                {(sideFilters.status || sideFilters.minArea || sideFilters.maxArea || sideFilters.date) && (
                  <span className="bg-accent-golden text-brand-deepCanopy rounded-full px-1.5 py-0.5 text-[10px] font-bold">Active</span>
                )}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {filtersOpen && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className="text-[10px] font-bold text-brand-darkForest/50 uppercase tracking-wider block mb-1">Status</label>
                      <select value={sideFilters.status} onChange={e => setSideFilters(p => ({ ...p, status: e.target.value }))}
                        className="w-full text-xs border border-neutral-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-brand-darkForest"
                      >
                        <option value="">All statuses</option>
                        <option value="registered">Registered</option>
                        <option value="pending">Pending</option>
                        <option value="disputed">Disputed</option>
                        <option value="transferred">Transferred</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-brand-darkForest/50 uppercase tracking-wider block mb-1">Min area (acres)</label>
                      <input type="number" placeholder="0" value={sideFilters.minArea}
                        onChange={e => setSideFilters(p => ({ ...p, minArea: e.target.value }))}
                        className="w-full text-xs border border-neutral-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-brand-darkForest"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-brand-darkForest/50 uppercase tracking-wider block mb-1">Max area (acres)</label>
                      <input type="number" placeholder="∞" value={sideFilters.maxArea}
                        onChange={e => setSideFilters(p => ({ ...p, maxArea: e.target.value }))}
                        className="w-full text-xs border border-neutral-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-brand-darkForest"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[10px] font-bold text-brand-darkForest/50 uppercase tracking-wider block mb-1">Registered after</label>
                      <input type="date" value={sideFilters.date}
                        onChange={e => setSideFilters(p => ({ ...p, date: e.target.value }))}
                        className="w-full text-xs border border-neutral-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-brand-darkForest"
                      />
                    </div>
                    <button onClick={() => setSideFilters({ minArea: '', maxArea: '', status: '', date: '' })}
                      className="col-span-2 text-xs text-brand-muted hover:text-brand-darkForest border border-neutral-200 rounded-lg py-1.5 transition-colors"
                    >Clear filters</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Results count */}
          {results.length > 0 && (
            <div className="flex-shrink-0 flex items-center justify-between px-4 py-2.5 border-b border-neutral-100 bg-neutral-50/50">
              <p className="text-xs text-brand-muted flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span><strong className="text-brand-darkForest">{displayed.length}</strong> parcel{displayed.length !== 1 ? 's' : ''} found</span>
                {displayed.length !== results.length && <span className="text-brand-muted">({results.length - displayed.length} filtered)</span>}
              </p>
              {selected && (
                <button onClick={() => { setSelected(null); setMapCenter(GHANA_CENTER); setMapZoom(GHANA_ZOOM) }}
                  className="text-[11px] text-brand-muted hover:text-brand-darkForest flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Clear selection
                </button>
              )}
            </div>
          )}

          {/* Results list — scrollable */}
          <div className="flex-1 overflow-y-auto">
            {displayed.length === 0
              ? <EmptyState hasQuery={hasQuery} />
              : (
                <div className="p-4 space-y-3">
                  {displayed.map(r => (
                    <ResultCard
                      key={r.id}
                      record={r}
                      active={selected?.id === r.id}
                      onClick={() => {
                        setSelected(r)
                        setMapCenter([r.lat, r.lng])
                        setMapZoom(14)
                        setMobileView('map')
                      }}
                    />
                  ))}
                </div>
              )
            }
          </div>
        </div>

        {/* ── MAP PANEL ──────────────────────────────────────────────────────── */}
        <div className={`
          ${mobileView === 'map' ? 'flex' : 'hidden'} lg:flex
          flex-1 relative overflow-hidden
        `}>
          <div className="absolute inset-0">
            <MapComponent
              results={displayed}
              selected={selected}
              onSelect={r => { setSelected(r); setMapCenter([r.lat, r.lng]); setMapZoom(14) }}
              mapCenter={mapCenter}
              mapZoom={mapZoom}
            />
          </div>

          {/* Floating info card for selected parcel */}
          <AnimatePresence>
            {selected && (
              <MapInfoCard
                record={selected}
                onClose={() => setSelected(null)}
              />
            )}
          </AnimatePresence>

          {/* Map legend */}
          <div className="absolute top-4 right-4 z-[500] bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-neutral-200 px-3 py-2.5 hidden sm:block">
            <p className="text-[10px] font-bold text-brand-darkForest/50 uppercase tracking-widest mb-2">Legend</p>
            {Object.entries(STATUS_STYLES).map(([status, s]) => (
              <div key={status} className="flex items-center gap-2 mb-1 last:mb-0">
                <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                <span className="text-[11px] text-brand-darkForest capitalize">{status}</span>
              </div>
            ))}
          </div>

          {/* Result count badge */}
          {displayed.length > 0 && (
            <div className="absolute top-4 left-4 z-[500] bg-brand-deepCanopy/85 backdrop-blur-sm text-white rounded-xl px-3 py-2 shadow-md">
              <p className="text-xs font-bold">{displayed.length} parcel{displayed.length !== 1 ? 's' : ''} on map</p>
              {selected && <p className="text-[10px] text-accent-golden font-mono mt-0.5">{fmtCoords(selected.lat, selected.lng)}</p>}
            </div>
          )}

          {/* Mobile: back to results button */}
          <button onClick={() => setMobileView('search')}
            className="lg:hidden absolute top-4 left-1/2 -translate-x-1/2 z-[500] flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-neutral-200 shadow-md rounded-full px-4 py-2 text-xs font-semibold text-brand-darkForest"
          >
            <LayoutList className="w-3.5 h-3.5" /> Back to results
          </button>
        </div>

      </div>
    </div>
  )
}

// ─── Page export ──────────────────────────────────────────────────────────────
export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="h-screen bg-brand-deepCanopy flex flex-col items-center justify-center gap-4">
        <Globe className="w-10 h-10 text-accent-golden animate-pulse" />
        <p className="text-white/60 text-sm font-medium">Loading search…</p>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
