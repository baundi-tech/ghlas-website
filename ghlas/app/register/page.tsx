'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, ArrowRight, CheckCircle2, User, CreditCard, Phone, Mail,
  MapPin, Building, Ruler, FileText, Upload, Globe, Shield,
  AlertCircle, ChevronRight, Hash, Calendar, Landmark,
  ClipboardList, X, Navigation, Pencil, RotateCcw,
} from 'lucide-react'
import { GPSSurvey } from './GPSSurvey'

// ─── Types ────────────────────────────────────────────────────────────────────

interface BoundaryPoint { lat: number; lng: number }

interface FormData {
  // Step 1 — Applicant
  firstName:       string
  lastName:        string
  ghanaCard:       string
  phone:           string
  email:           string
  address:         string

  // Step 2 — Parcel
  parcelName:      string
  region:          string
  district:        string
  locality:        string
  area:            string
  areaUnit:        string
  landUse:         string

  // Step 3 — GPS Survey
  gpsCoordinates:  string
  gpsAccuracy:     number | null
  digitalAddress:  string
  street:          string
  suburb:          string
  landmark:        string
  surveyorName:    string
  surveyDate:      string
  boundaryPoints:  BoundaryPoint[]

  // Step 4 — Title & Documents
  titleType:       string
  purpose:         string
  idDoc:           File | null
  surveyPlan:      File | null
  deedDoc:         File | null
  supportDocs:     File[]

  // Meta
  declaration:     boolean
}

const EMPTY: FormData = {
  firstName: '', lastName: '', ghanaCard: '', phone: '', email: '', address: '',
  parcelName: '', region: '', district: '', locality: '', area: '', areaUnit: 'acres', landUse: '',
  gpsCoordinates: '', gpsAccuracy: null, digitalAddress: '', street: '', suburb: '', landmark: '', surveyorName: '', surveyDate: '', boundaryPoints: [],
  titleType: '', purpose: '', idDoc: null, surveyPlan: null, deedDoc: null, supportDocs: [],
  declaration: false,
}

// ─── Constants ────────────────────────────────────────────────────────────────

const REGIONS = [
  'Greater Accra','Ashanti','Western','Western North','Eastern','Central',
  'Volta','Oti','Bono','Bono East','Ahafo','Northern','Savannah',
  'North East','Upper East','Upper West',
]

const TITLE_TYPES = [
  { id: 'freehold',  label: 'Freehold',          desc: 'Absolute ownership of land and structures' },
  { id: 'leasehold', label: 'Leasehold',          desc: 'Right to occupy for a fixed term' },
  { id: 'customary', label: 'Customary Freehold', desc: 'Customary land held in perpetuity' },
  { id: 'stool',     label: 'Stool/Skin Land',    desc: 'Land held in trust by traditional authority' },
  { id: 'state',     label: 'State Land',         desc: 'Compulsorily acquired by the government' },
]

const LAND_USES = ['Residential','Commercial','Agricultural','Industrial','Mixed Use','Institutional','Recreation']

// ─── Step config ──────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: 'Applicant',  icon: User },
  { id: 2, label: 'Parcel',     icon: MapPin },
  { id: 3, label: 'GPS Survey', icon: Navigation },
  { id: 4, label: 'Documents',  icon: FileText },
  { id: 5, label: 'Review',     icon: ClipboardList },
]

// ─── Keyboard nav helper ──────────────────────────────────────────────────────

function focusNextField(current: HTMLElement) {
  const fields = Array.from(document.querySelectorAll<HTMLElement>(
    'input:not([type="hidden"]):not([type="file"]):not([type="radio"]):not([type="checkbox"]):not([disabled]),' +
    'select:not([disabled])',
  ))
  const idx = fields.indexOf(current)
  if (idx !== -1) fields[idx + 1]?.focus()
}

// ─── Small helpers ────────────────────────────────────────────────────────────

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-bold text-brand-darkForest/60 uppercase tracking-wider mb-1.5">
      {children}{required && <span className="text-red-500 ml-1">*</span>}
    </label>
  )
}

function InputField({
  icon: Icon, type = 'text', value, onChange, placeholder, required, disabled,
}: {
  icon?: React.ElementType; type?: string; value: string
  onChange: (v: string) => void; placeholder?: string; required?: boolean; disabled?: boolean
}) {
  return (
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-darkForest/35 pointer-events-none" />}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); focusNextField(e.currentTarget) } }}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`w-full py-2.5 pr-3 text-sm border border-neutral-200 rounded-xl bg-white focus:outline-none focus:border-brand-leaf focus:ring-2 focus:ring-brand-leaf/20 transition-all placeholder-neutral-400 disabled:opacity-50 disabled:bg-neutral-50 ${Icon ? 'pl-9' : 'pl-3'}`}
      />
    </div>
  )
}

function SelectField({
  icon: Icon, value, onChange, options, placeholder,
}: {
  icon?: React.ElementType; value: string; onChange: (v: string) => void
  options: string[]; placeholder?: string
}) {
  return (
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-darkForest/35 pointer-events-none z-10" />}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); focusNextField(e.currentTarget) } }}
        className={`w-full py-2.5 pr-3 text-sm border border-neutral-200 rounded-xl bg-white focus:outline-none focus:border-brand-leaf focus:ring-2 focus:ring-brand-leaf/20 transition-all appearance-none ${Icon ? 'pl-9' : 'pl-3'} ${!value ? 'text-neutral-400' : 'text-brand-darkForest'}`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

function FileDropZone({
  label, hint, file, onChange, accept,
}: {
  label: string; hint: string; file: File | null; onChange: (f: File | null) => void; accept?: string
}) {
  return (
    <label className={`relative flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-5 cursor-pointer transition-all text-center ${
      file ? 'border-brand-leaf bg-brand-leaf/5' : 'border-neutral-200 hover:border-brand-darkForest/40 bg-neutral-50 hover:bg-white'
    }`}>
      <input type="file" className="sr-only" accept={accept}
        onChange={e => onChange(e.target.files?.[0] ?? null)} />
      {file ? (
        <>
          <CheckCircle2 className="w-6 h-6 text-brand-leaf" />
          <p className="text-xs font-semibold text-brand-darkForest truncate max-w-full px-2">{file.name}</p>
          <button type="button" onClick={e => { e.preventDefault(); onChange(null) }}
            className="text-[11px] text-red-500 hover:text-red-700 flex items-center gap-1">
            <X className="w-3 h-3" /> Remove
          </button>
        </>
      ) : (
        <>
          <Upload className="w-5 h-5 text-brand-darkForest/30" />
          <p className="text-xs font-semibold text-brand-darkForest/70">{label}</p>
          <p className="text-[11px] text-brand-muted">{hint}</p>
        </>
      )}
    </label>
  )
}

function ReviewRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-neutral-100 last:border-0">
      <Icon className="w-3.5 h-3.5 text-brand-darkForest/40 mt-0.5 flex-shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-wider text-brand-darkForest/40 font-bold mb-0.5">{label}</p>
        <p className="text-sm text-brand-darkForest font-medium truncate">{value || '—'}</p>
      </div>
    </div>
  )
}

// ─── Step components ──────────────────────────────────────────────────────────

function StepApplicant({ data, set }: { data: FormData; set: (k: keyof FormData, v: string) => void }) {
  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel required>First Name</FieldLabel>
          <InputField icon={User} value={data.firstName} onChange={v => set('firstName', v)} placeholder="Kwame" required />
        </div>
        <div>
          <FieldLabel required>Last Name</FieldLabel>
          <InputField icon={User} value={data.lastName} onChange={v => set('lastName', v)} placeholder="Mensah" required />
        </div>
      </div>

      <div>
        <FieldLabel required>GhanaCard Number</FieldLabel>
        <InputField icon={CreditCard} value={data.ghanaCard} onChange={v => set('ghanaCard', v)}
          placeholder="GHA-XXXXXXXXX-X" required />
        <p className="text-[11px] text-brand-muted mt-1">Format: GHA-000000000-0</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel required>Phone Number</FieldLabel>
          <InputField icon={Phone} type="tel" value={data.phone} onChange={v => set('phone', v)}
            placeholder="+233 XX XXX XXXX" required />
        </div>
        <div>
          <FieldLabel>Email Address</FieldLabel>
          <InputField icon={Mail} type="email" value={data.email} onChange={v => set('email', v)}
            placeholder="user@example.com" />
        </div>
      </div>

      <div>
        <FieldLabel required>Residential Address</FieldLabel>
        <InputField icon={MapPin} value={data.address} onChange={v => set('address', v)}
          placeholder="House No., Street, Town" required />
      </div>

      <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 flex gap-3">
        <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700">
          Ensure your GhanaCard details match exactly.
        </p>
      </div>
    </div>
  )
}

function StepParcel({ data, set }: { data: FormData; set: (k: keyof FormData, v: string) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <FieldLabel required>Parcel / Property Name</FieldLabel>
        <InputField icon={Landmark} value={data.parcelName} onChange={v => set('parcelName', v)}
          placeholder="e.g., Mensah Family Plot" required />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel required>Region</FieldLabel>
          <SelectField icon={Globe} value={data.region} onChange={v => set('region', v)}
            options={REGIONS} placeholder="Select region" />
        </div>
        <div>
          <FieldLabel required>District</FieldLabel>
          <InputField icon={Building} value={data.district} onChange={v => set('district', v)}
            placeholder="e.g., Accra Metropolitan" required />
        </div>
      </div>

      <div>
        <FieldLabel required>Locality / Community</FieldLabel>
        <InputField icon={MapPin} value={data.locality} onChange={v => set('locality', v)}
          placeholder="e.g., Labadi, East Legon" required />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel required>Land Area</FieldLabel>
          <InputField icon={Ruler} type="number" value={data.area} onChange={v => set('area', v)}
            placeholder="0.00" required />
        </div>
        <div>
          <FieldLabel>Unit</FieldLabel>
          <SelectField value={data.areaUnit} onChange={v => set('areaUnit', v)}
            options={['acres', 'hectares', 'sq. metres', 'sq. feet', 'plots']} />
        </div>
      </div>

      <div>
        <FieldLabel>Land Use</FieldLabel>
        <SelectField icon={Hash} value={data.landUse} onChange={v => set('landUse', v)}
          options={LAND_USES} placeholder="Select land use" />
      </div>

      <div className="rounded-xl bg-brand-darkForest/5 border border-brand-darkForest/15 p-4 flex gap-3">
        <Navigation className="w-4 h-4 text-accent-golden flex-shrink-0 mt-0.5" />
        <p className="text-xs text-brand-darkForest/70">
          Exact GPS coordinates and boundary survey will be captured in the next step by your licensed surveyor.
        </p>
      </div>
    </div>
  )
}

function StepDocuments({ data, onChange, onFile }: {
  data: FormData
  onChange: (k: keyof FormData, v: string) => void
  onFile: (k: 'idDoc' | 'surveyPlan' | 'deedDoc', f: File | null) => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <FieldLabel required>Title Type</FieldLabel>
        <div className="grid gap-2 mt-1">
          {TITLE_TYPES.map(t => (
            <label key={t.id} className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
              data.titleType === t.id
                ? 'border-brand-leaf bg-brand-leaf/5 shadow-sm'
                : 'border-neutral-200 hover:border-brand-darkForest/30 bg-white'
            }`}>
              <input type="radio" name="titleType" value={t.id} checked={data.titleType === t.id}
                onChange={() => onChange('titleType', t.id)} className="mt-0.5 accent-brand-leaf" />
              <div>
                <p className="text-sm font-semibold text-brand-darkForest">{t.label}</p>
                <p className="text-xs text-brand-muted mt-0.5">{t.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div>
        <FieldLabel>Intended Use / Purpose</FieldLabel>
        <InputField icon={FileText} value={data.purpose} onChange={v => onChange('purpose', v)}
          placeholder="e.g., Construction of family residence" />
      </div>

      <div>
        <FieldLabel required>Required Documents</FieldLabel>
        <div className="grid sm:grid-cols-3 gap-3">
          <FileDropZone label="National ID / GhanaCard" hint="PDF or JPG, max 5 MB"
            file={data.idDoc} onChange={f => onFile('idDoc', f)} accept=".pdf,.jpg,.jpeg,.png" />
          <FileDropZone label="Survey Plan" hint="PDF or CAD file"
            file={data.surveyPlan} onChange={f => onFile('surveyPlan', f)} accept=".pdf,.dwg,.dxf" />
          <FileDropZone label="Title Deed / Indenture" hint="PDF only, max 10 MB"
            file={data.deedDoc} onChange={f => onFile('deedDoc', f)} accept=".pdf" />
        </div>
        <p className="text-[11px] text-brand-muted mt-2">
          Original documents will be required for physical verification at a Lands Commission office.
        </p>
      </div>

      <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 flex gap-3">
        <Shield className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700">
          All documents are encrypted in transit and stored securely. Only authorised Lands Commission officers have access.
        </p>
      </div>
    </div>
  )
}

function StepReview({
  data, onDeclare, onEditStep,
}: {
  data: FormData
  onDeclare: (v: boolean) => void
  onEditStep: (step: number) => void
}) {
  const parsed: BoundaryPoint | null = data.gpsCoordinates ? JSON.parse(data.gpsCoordinates) : null

  const sections: {
    title: string
    step:  number
    rows:  { icon: React.ElementType; label: string; value: string }[]
  }[] = [
    {
      title: 'Applicant Details',
      step:  1,
      rows: [
        { icon: User,       label: 'Full Name',  value: [data.firstName, data.lastName].filter(Boolean).join(' ') },
        { icon: CreditCard, label: 'GhanaCard',  value: data.ghanaCard },
        { icon: Phone,      label: 'Phone',      value: data.phone },
        { icon: Mail,       label: 'Email',      value: data.email },
        { icon: MapPin,     label: 'Address',    value: data.address },
      ],
    },
    {
      title: 'Parcel Details',
      step:  2,
      rows: [
        { icon: Landmark, label: 'Parcel Name', value: data.parcelName },
        { icon: Globe,    label: 'Region',      value: data.region },
        { icon: Building, label: 'District',    value: data.district },
        { icon: MapPin,   label: 'Locality',    value: data.locality },
        { icon: Ruler,    label: 'Area',        value: data.area ? `${data.area} ${data.areaUnit}` : '' },
        { icon: Hash,     label: 'Land Use',    value: data.landUse },
      ],
    },
    {
      title: 'GPS Survey',
      step:  3,
      rows: [
        { icon: Navigation, label: 'Coordinates',      value: parsed ? `${parsed.lat.toFixed(6)}, ${parsed.lng.toFixed(6)}` : 'Not provided' },
        { icon: Navigation, label: 'Accuracy',         value: data.gpsAccuracy != null ? `±${Math.round(data.gpsAccuracy)} m` : '—' },
        { icon: Hash,       label: 'Digital Address',  value: data.digitalAddress },
        { icon: MapPin,     label: 'Street / Road',    value: data.street },
        { icon: Building,   label: 'Area / Suburb',    value: data.suburb },
        { icon: MapPin,     label: 'Nearest Landmark', value: data.landmark },
        { icon: User,       label: 'Surveyor',         value: data.surveyorName },
        { icon: Calendar,   label: 'Survey Date',      value: data.surveyDate },
        { icon: MapPin,     label: 'Boundary Points',  value: `${data.boundaryPoints.length} point${data.boundaryPoints.length !== 1 ? 's' : ''} captured` },
      ],
    },
    {
      title: 'Title & Documents',
      step:  4,
      rows: [
        { icon: Shield,   label: 'Title Type',  value: TITLE_TYPES.find(t => t.id === data.titleType)?.label ?? '' },
        { icon: FileText, label: 'Purpose',     value: data.purpose },
        { icon: Upload,   label: 'ID Document', value: data.idDoc?.name ?? 'Not uploaded' },
        { icon: Upload,   label: 'Survey Plan', value: data.surveyPlan?.name ?? 'Not uploaded' },
        { icon: Upload,   label: 'Title Deed',  value: data.deedDoc?.name ?? 'Not uploaded' },
      ],
    },
  ]

  return (
    <div className="space-y-4">
      {sections.map(s => (
        <div key={s.title} className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
          {/* Section header with Edit button */}
          <div className="px-5 py-3 bg-neutral-50 border-b border-neutral-100 flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-widest text-brand-darkForest/50">{s.title}</p>
            <button
              type="button"
              onClick={() => onEditStep(s.step)}
              className="flex items-center gap-1.5 text-[11px] font-semibold text-brand-darkForest/50 hover:text-accent-golden transition-colors px-2.5 py-1 rounded-lg hover:bg-accent-golden/8"
            >
              <Pencil className="w-3 h-3" />
              Edit
            </button>
          </div>
          <div className="px-5 py-1">
            {s.rows.map(r => <ReviewRow key={r.label} {...r} />)}
          </div>
        </div>
      ))}

      {/* Reference preview */}
      <div className="bg-brand-deepCanopy rounded-2xl p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-accent-golden/20 flex items-center justify-center flex-shrink-0">
          <Hash className="w-5 h-5 text-accent-golden" />
        </div>
        <div>
          <p className="text-xs text-white/50 uppercase tracking-wider font-semibold">Application Reference</p>
          <p className="text-base font-bold text-white font-mono mt-0.5">GHL-{new Date().getFullYear()}-XXXXXXX</p>
          <p className="text-[11px] text-white/40 mt-0.5">Generated on submission</p>
        </div>
      </div>

      {/* Declaration */}
      <label className="flex items-start gap-3 p-4 rounded-2xl border border-neutral-200 cursor-pointer hover:border-brand-darkForest/40 transition-colors">
        <input
          type="checkbox"
          checked={data.declaration}
          onChange={e => onDeclare(e.target.checked)}
          className="mt-0.5 w-4 h-4 accent-brand-leaf flex-shrink-0"
        />
        <p className="text-xs text-brand-darkForest/70 leading-relaxed">
          I declare that all information provided is true and accurate to the best of my knowledge.
          I understand that submitting false information constitutes an offence under the Land Act 2020 (Act 1036)
          and may result in cancellation of registration and legal prosecution.
        </p>
      </label>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const [step,          setStep]          = useState(1)
  const [data,          setData]          = useState<FormData>(EMPTY)
  const [submitted,     setSubmitted]     = useState(false)
  const [refNo,         setRefNo]         = useState('')
  const [returnToReview, setReturnToReview] = useState(false)

  const set = (k: keyof FormData, v: string) =>
    setData(p => ({ ...p, [k]: v }))

  const setFile = (k: 'idDoc' | 'surveyPlan' | 'deedDoc', f: File | null) =>
    setData(p => ({ ...p, [k]: f }))

  // Bridge GPSSurvey's updateFormData pattern to local state
  const updateGps = (patch: Partial<Pick<FormData, 'gpsCoordinates' | 'gpsAccuracy' | 'digitalAddress' | 'street' | 'suburb' | 'landmark' | 'surveyorName' | 'surveyDate' | 'boundaryPoints'>>) =>
    setData(p => ({ ...p, ...patch }))

  const handleEditStep = (target: number) => {
    setReturnToReview(true)
    setStep(target)
  }

  const canAdvance = () => {
    if (step === 1) return !!(data.firstName && data.lastName && data.ghanaCard && data.phone && data.address)
    if (step === 2) return !!(data.parcelName && data.region && data.district && data.locality && data.area)
    if (step === 3) return !!(data.surveyorName && data.surveyDate && data.boundaryPoints.length >= 4)
    if (step === 4) return !!(data.titleType && data.idDoc)
    if (step === 5) return data.declaration
    return false
  }

  const handleSubmit = () => {
    const ref = `GHL-${new Date().getFullYear()}-${Math.floor(1000000 + Math.random() * 9000000)}`
    setRefNo(ref)
    setSubmitted(true)
  }

  const STEP_TITLES: Record<number, string> = {
    1: 'Applicant Information',
    2: 'Parcel Details',
    3: 'GPS Survey Data',
    4: 'Title Type & Documents',
    5: 'Review & Submit',
  }

  // ── Success screen ────────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-deepCanopy via-brand-darkForest to-brand-shadow flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="bg-brand-deepCanopy px-8 py-10 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
              className="w-16 h-16 rounded-full bg-brand-leaf/20 border-2 border-brand-leaf flex items-center justify-center mx-auto mb-5"
            >
              <CheckCircle2 className="w-8 h-8 text-brand-leaf" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-2">Application Submitted!</h2>
            <p className="text-white/60 text-sm">Your land registration is under review</p>
          </div>

          <div className="p-8 space-y-5">
            <div className="bg-neutral-paleMint rounded-2xl p-5 text-center">
              <p className="text-[11px] uppercase tracking-wider font-bold text-brand-darkForest/40 mb-1.5">Reference Number</p>
              <p className="text-2xl font-bold font-mono text-brand-darkForest">{refNo}</p>
              <p className="text-xs text-brand-muted mt-2">Save this reference to track your application</p>
            </div>

            <div className="space-y-3 text-sm text-brand-darkForest/70">
              {[
                { icon: Calendar,   text: 'Processing takes 10–21 working days' },
                { icon: Mail,       text: 'Confirmation sent to your email / SMS' },
                { icon: Landmark,   text: 'Visit a Lands Commission office with original documents' },
                { icon: Globe,      text: 'Track status using your reference number' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3">
                  <Icon className="w-4 h-4 text-accent-golden flex-shrink-0 mt-0.5" />
                  <p>{text}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <Link href="/search"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-brand-darkForest text-white text-sm font-bold hover:bg-brand-forest transition-colors"
              >
                <MapPin className="w-4 h-4" /> Search Parcels
              </Link>
              <Link href="/"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-neutral-200 text-brand-darkForest text-sm font-semibold hover:bg-neutral-50 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  // ── Form ──────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-neutral-paleMint">

      {/* Hero header */}
      <div className="bg-brand-deepCanopy text-white">
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-accent-golden/20 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-accent-golden" />
                </div>
                <span className="text-accent-golden text-xs font-bold uppercase tracking-widest">Lands Commission · Ghana</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold">Register Land Parcel</h1>
              <p className="text-white/60 mt-2 text-sm max-w-xl">
                Secure your land title through Ghana&apos;s official digital registration system.
                Complete the 5-step form below.
              </p>
            </div>
            <div className="flex gap-5 sm:gap-8 text-center flex-shrink-0">
              {[
                { value: '10k+', label: 'Registered' },
                { value: '16',   label: 'Regions' },
                { value: '100%', label: 'Secure' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-xl font-bold text-accent-golden">{value}</p>
                  <p className="text-[11px] text-white/40 uppercase tracking-wider">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step indicator */}
        <div className="border-t border-white/8">
          <div className="container mx-auto px-4">
            <div className="flex">
              {STEPS.map((s, i) => {
                const done   = step > s.id
                const active = step === s.id
                return (
                  <div key={s.id} className={`flex-1 flex items-center gap-1.5 py-3.5 border-b-2 transition-all ${
                    active ? 'border-accent-golden' : done ? 'border-brand-leaf' : 'border-transparent'
                  }`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold transition-all ${
                      done ? 'bg-brand-leaf text-white' : active ? 'bg-accent-golden text-brand-deepCanopy' : 'bg-white/10 text-white/40'
                    }`}>
                      {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.id}
                    </div>
                    <span className={`text-xs font-semibold hidden sm:block ${active ? 'text-white' : done ? 'text-brand-leaf' : 'text-white/30'}`}>
                      {s.label}
                    </span>
                    {i < STEPS.length - 1 && <ChevronRight className="w-3 h-3 text-white/15 ml-auto hidden sm:block" />}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Form body — wider on step 3 (GPS has two-column layout) */}
      <div className={`container mx-auto px-4 py-8 transition-all ${step === 3 ? 'max-w-3xl' : 'max-w-2xl'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">

              {/* Card header */}
              <div className="px-6 py-5 border-b border-neutral-100 flex items-center gap-3">
                {(() => {
                  const s = STEPS[step - 1]
                  return (
                    <>
                      <div className="w-9 h-9 rounded-xl bg-brand-darkForest/6 flex items-center justify-center">
                        <s.icon className="w-[18px] h-[18px] text-brand-darkForest/60" />
                      </div>
                      <div>
                        <p className="text-[11px] text-brand-muted font-semibold uppercase tracking-wider">Step {step} of {STEPS.length}</p>
                        <h2 className="text-base font-bold text-brand-darkForest">{STEP_TITLES[step]}</h2>
                      </div>
                    </>
                  )
                })()}
              </div>

              {/* Card body */}
              <div className="p-6">
                {step === 1 && <StepApplicant data={data} set={set} />}
                {step === 2 && <StepParcel    data={data} set={set} />}
                {step === 3 && (
                  <GPSSurvey
                    formData={{
                      gpsCoordinates: data.gpsCoordinates,
                      gpsAccuracy:    data.gpsAccuracy,
                      digitalAddress: data.digitalAddress,
                      street:         data.street,
                      suburb:         data.suburb,
                      landmark:       data.landmark,
                      surveyorName:   data.surveyorName,
                      surveyDate:     data.surveyDate,
                      boundaryPoints: data.boundaryPoints,
                    }}
                    updateFormData={updateGps}
                  />
                )}
                {step === 4 && <StepDocuments data={data} onChange={set} onFile={setFile} />}
                {step === 5 && <StepReview    data={data} onDeclare={v => setData(p => ({ ...p, declaration: v }))} onEditStep={handleEditStep} />}
              </div>

              {/* Card footer */}
              <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => { setReturnToReview(false); setStep(s => Math.max(1, s - 1)) }}
                  disabled={step === 1}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-neutral-200 text-sm font-semibold text-brand-darkForest hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>

                <div className="flex gap-1.5">
                  {STEPS.map(s => (
                    <span key={s.id} className={`w-2 h-2 rounded-full transition-all ${
                      s.id === step ? 'bg-brand-darkForest scale-125' : s.id < step ? 'bg-brand-leaf' : 'bg-neutral-200'
                    }`} />
                  ))}
                </div>

                {step < 5 ? (
                  returnToReview ? (
                    <button
                      type="button"
                      onClick={() => { setReturnToReview(false); setStep(5) }}
                      disabled={!canAdvance()}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-golden text-brand-deepCanopy text-sm font-bold hover:bg-accent-yellow transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                    >
                      <RotateCcw className="w-4 h-4" /> Return to Review
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setStep(s => s + 1)}
                      disabled={!canAdvance()}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-sm cursor-pointer bg-brand-darkForest text-white text-sm font-bold hover:bg-brand-forest transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                    >
                      Continue <ArrowRight className="w-4 h-4" />
                    </button>
                  )
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!canAdvance()}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent-golden text-brand-deepCanopy text-sm font-bold hover:bg-accent-yellow transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Submit Application
                  </button>
                )}
              </div>
            </div>

            <p className="text-center text-xs text-brand-muted mt-5">
              Need help?{' '}
              <Link href="/contact" className="text-accent-golden hover:text-accent-darkGold font-medium">Contact the Lands Commission</Link>
              {' '}or call <span className="font-mono font-semibold">0302 665 251</span>
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
