'use client'

import { notFound, useParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft, MapPin, User, CreditCard, Hash, Ruler,
  Calendar, Shield, Globe, CheckCircle2, AlertCircle,
  Clock, RefreshCw, Printer, Download, ChevronRight,
  Building, FileText,
} from 'lucide-react'
import { getRecord, fmtCoords } from '@/lib/land-records'

const GhanaMap = dynamic(
  () => import('@/components/ui/GhanaMap').then(m => m.GhanaMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-brand-darkForest/5 animate-pulse flex items-center justify-center rounded-xl">
        <MapPin className="w-8 h-8 text-brand-darkForest/20 animate-bounce" />
      </div>
    ),
  }
)

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, {
  icon: React.ElementType; pill: string; bg: string; text: string; desc: string
}> = {
  registered:  { icon: CheckCircle2, pill: 'bg-emerald-100 text-emerald-700 border-emerald-200',  bg: 'bg-emerald-50',  text: 'text-emerald-700', desc: 'Title deed registered and verified by the Lands Commission.' },
  pending:     { icon: Clock,        pill: 'bg-amber-100 text-amber-700 border-amber-200',        bg: 'bg-amber-50',    text: 'text-amber-700',   desc: 'Registration application submitted and awaiting Lands Commission review.' },
  disputed:    { icon: AlertCircle,  pill: 'bg-red-100 text-red-700 border-red-200',              bg: 'bg-red-50',      text: 'text-red-700',     desc: 'Ownership is under active dispute. Contact the Lands Commission for details.' },
  transferred: { icon: RefreshCw,    pill: 'bg-blue-100 text-blue-700 border-blue-200',           bg: 'bg-blue-50',     text: 'text-blue-700',    desc: 'Title deed has been transferred to a new owner. Records updated.' },
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function InfoField({ icon: Icon, label, value, mono = false, highlight = false }: {
  icon: React.ElementType; label: string; value: string; mono?: boolean; highlight?: boolean
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-neutral-100 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-brand-darkForest/6 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-brand-darkForest/50" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-darkForest/40 mb-0.5">{label}</p>
        <p className={`text-sm font-semibold break-all ${mono ? 'font-mono' : ''} ${highlight ? 'text-accent-golden' : 'text-brand-darkForest'}`}>
          {value}
        </p>
      </div>
    </div>
  )
}

function SectionCard({ title, children, className = '' }: {
  title: string; children: React.ReactNode; className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden ${className}`}
    >
      <div className="px-5 py-3.5 border-b border-neutral-100 bg-neutral-50/60">
        <h3 className="text-xs font-bold text-brand-darkForest/50 uppercase tracking-widest">{title}</h3>
      </div>
      <div className="px-5 py-1">{children}</div>
    </motion.div>
  )
}

// ─── Timeline ─────────────────────────────────────────────────────────────────
function Timeline({ record }: { record: ReturnType<typeof getRecord> }) {
  if (!record) return null
  const events = [
    { date: record.registrationDate, label: 'Title Deed Registered', icon: FileText, done: true },
    { date: record.registrationDate, label: 'Survey Completed',       icon: MapPin,   done: true },
    { date: '—',                     label: 'Digital Record Created', icon: Globe,    done: record.status !== 'pending' },
    { date: record.status === 'transferred' ? record.registrationDate : '—',
      label: 'Ownership Transferred', icon: RefreshCw, done: record.status === 'transferred' },
  ]
  return (
    <div className="relative pl-6">
      <div className="absolute left-2.5 top-2 bottom-2 w-px bg-neutral-200" />
      {events.map((e, i) => (
        <div key={i} className="relative flex items-start gap-3 pb-5 last:pb-0">
          <div className={`absolute -left-[0.85rem] w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 z-10 ${
            e.done ? 'bg-brand-darkForest border-brand-darkForest' : 'bg-white border-neutral-300'
          }`}>
            <e.icon className={`w-2.5 h-2.5 ${e.done ? 'text-white' : 'text-neutral-400'}`} />
          </div>
          <div>
            <p className={`text-sm font-semibold ${e.done ? 'text-brand-darkForest' : 'text-neutral-400'}`}>{e.label}</p>
            <p className={`text-xs mt-0.5 ${e.done ? 'text-brand-muted' : 'text-neutral-300'}`}>{e.date}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ParcelDetailPage() {
  const params   = useParams()
  const router   = useRouter()
  const record   = getRecord(params.id as string)

  if (!record) notFound()

  const status    = STATUS_CONFIG[record.status] ?? STATUS_CONFIG.registered
  const StatusIcon = status.icon
  const maskedCard = record.ghanaCard.replace(/(\w{3}-)\d{5}(\d{4}-\d)/, '$1•••••$2')

  return (
    <div className="min-h-screen bg-neutral-paleMint">

      {/* ── Hero band ──────────────────────────────────────────────────────── */}
      <div className="bg-brand-deepCanopy text-white">
        <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/50 text-xs mb-5">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/search" className="hover:text-white transition-colors">Search</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/80 font-mono">{record.id}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${status.pill}`}>
                  <StatusIcon className="w-3.5 h-3.5" />
                  {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                </span>
                <span className="text-white/30 text-xs font-mono">{record.id}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">{record.name}</h1>
              <p className="text-white/60 mt-1 flex items-center gap-1.5 text-sm">
                <MapPin className="w-3.5 h-3.5 text-accent-golden flex-shrink-0" />
                {record.district}, {record.region} Region
              </p>
              <p className="text-accent-golden font-mono text-xs mt-2 opacity-80">{fmtCoords(record.lat, record.lng)}</p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2 flex-shrink-0">
              <button onClick={() => router.back()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
              >
                <Printer className="w-4 h-4" /> Print
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-accent-golden text-brand-deepCanopy hover:bg-accent-yellow transition-colors">
                <Download className="w-4 h-4" /> Certificate
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Status banner ──────────────────────────────────────────────────── */}
      <div className={`${status.bg} border-b border-neutral-200`}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-2.5">
          <StatusIcon className={`w-4 h-4 flex-shrink-0 ${status.text}`} />
          <p className={`text-sm ${status.text}`}>{status.desc}</p>
        </div>
      </div>

      {/* ── Body ───────────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">

        {/* Left column */}
        <div className="space-y-6">

          {/* Owner details */}
          <SectionCard title="Owner Information">
            <InfoField icon={User}       label="Full Name"      value={record.name} />
            <InfoField icon={CreditCard} label="GhanaCard No."  value={maskedCard}  mono />
            <InfoField icon={Building}   label="District"       value={record.district} />
            <InfoField icon={Globe}      label="Region"         value={`${record.region} Region`} />
          </SectionCard>

          {/* Parcel details */}
          <SectionCard title="Parcel Details">
            <InfoField icon={Hash}     label="Parcel ID"          value={record.id}                mono highlight />
            <InfoField icon={Shield}   label="Title Type"         value={record.title} />
            <InfoField icon={Ruler}    label="Land Area"          value={record.area} />
            <InfoField icon={Calendar} label="Registration Date"  value={record.registrationDate} />
            <InfoField icon={MapPin}   label="Coordinates (DMS)"  value={fmtCoords(record.lat, record.lng)} mono highlight />
            <InfoField icon={MapPin}   label="Coordinates (Dec.)" value={`${record.lat.toFixed(6)}°, ${record.lng.toFixed(6)}°`} mono />
          </SectionCard>

          {/* Registration timeline */}
          <SectionCard title="Registration Timeline">
            <div className="py-2">
              <Timeline record={record} />
            </div>
          </SectionCard>

        </div>

        {/* Right column */}
        <div className="space-y-6">

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden"
          >
            <div className="px-5 py-3.5 border-b border-neutral-100 bg-neutral-50/60">
              <h3 className="text-xs font-bold text-brand-darkForest/50 uppercase tracking-widest">Parcel Location</h3>
            </div>
            <div className="relative" style={{ height: 280 }}>
              <GhanaMap
                center={[record.lat, record.lng]}
                zoom={14}
                markerLabel={`${record.name} — ${record.id}`}
              />
            </div>
            <div className="px-4 py-3 bg-brand-deepCanopy/5 border-t border-neutral-100 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-accent-golden flex-shrink-0" />
              <p className="text-xs font-mono text-brand-darkForest/70">{fmtCoords(record.lat, record.lng)}</p>
            </div>
          </motion.div>

          {/* Quick summary card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-brand-darkForest rounded-2xl p-5 text-white"
          >
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-4">Parcel Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Area',     value: record.area },
                { label: 'Title',    value: record.title },
                { label: 'Region',   value: record.region },
                { label: 'Parcel',   value: record.id },
              ].map(item => (
                <div key={item.label}>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">{item.label}</p>
                  <p className="text-sm font-bold text-white mt-0.5 truncate">{item.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-5 space-y-2.5"
          >
            <h3 className="text-xs font-bold text-brand-darkForest/50 uppercase tracking-widest mb-3">Actions</h3>
            {[
              { label: 'Search another parcel', href: '/search',  icon: Globe },
              { label: 'Register new land',     href: '/register', icon: FileText },
              { label: 'View dashboard',        href: '/dashboard', icon: Shield },
            ].map(a => (
              <Link key={a.href} href={a.href}
                className="flex items-center justify-between px-4 py-3 rounded-xl border border-neutral-200 hover:border-brand-darkForest hover:bg-brand-darkForest/3 transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <a.icon className="w-4 h-4 text-brand-darkForest/40 group-hover:text-brand-darkForest transition-colors" />
                  <span className="text-sm font-medium text-brand-darkForest">{a.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-brand-darkForest transition-colors" />
              </Link>
            ))}
          </motion.div>

        </div>
      </div>
    </div>
  )
}
