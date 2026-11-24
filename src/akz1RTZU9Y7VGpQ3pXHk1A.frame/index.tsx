import React, { useEffect, useState } from 'react'
import { ArrowLeft, UploadCloud, FileText, X, Lock, Image as ImageIcon } from 'lucide-react'

import { Shell, type NavKey } from '../shared/seller/Shell'
import { formatINR, typeLabel, kindLabel, ctaLabel, type ItemType } from '../shared/storefront/data'

type Props = Partial<typeof args> & {
  onBack?: () => void
  onSave?: (asDraft: boolean) => void
  onNavigate?: (key: NavKey) => void
}

export default function AddItem(props: Props) {
  const { type: initialType, published, onBack, onSave, onNavigate } = { ...args, ...props }
  const [type, setType] = useState<ItemType>(initialType as ItemType)
  useEffect(() => setType(initialType as ItemType), [initialType])
  const preset = PRESETS[type]
  const [title, setTitle] = useState(preset.title)
  const [desc, setDesc] = useState(preset.description)
  const [price, setPrice] = useState(String(preset.price))
  useEffect(() => {
    setTitle(preset.title)
    setDesc(preset.description)
    setPrice(String(preset.price))
  }, [type])

  return (
    <Shell
      active={NAV_FOR[type]}
      title="New item"
      subtitle="Everything a buyer needs to decide, and only what this kind of item needs."
      published={published}
      onNavigate={onNavigate}
      actions={
        <button
          onClick={onBack}
          className="flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-muted ring-1 ring-line transition-colors duration-150 ease-out hover:bg-surface hover:text-ink"
        >
          <ArrowLeft className="size-4" /> Cancel
        </button>
      }
    >
      <div>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
          <form className="min-w-0 space-y-8" onSubmit={(e) => e.preventDefault()}>
            <fieldset>
              <legend className="mb-2 text-sm font-medium">Type</legend>
              <div className="grid grid-cols-2 gap-1 rounded-xl bg-surface p-1 ring-1 ring-line sm:grid-cols-4">
                {TYPE_ORDER.map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setType(t)}
                    className={`h-9 whitespace-nowrap rounded-lg px-3 text-sm transition-colors duration-150 ease-out ${
                      type === t ? 'bg-ink font-medium text-white' : 'text-muted hover:bg-canvas hover:text-ink'
                    }`}
                  >
                    {kindLabel(t)}
                  </button>
                ))}
              </div>
            </fieldset>

            <Group title="Basics">
              <Field label="Title" value={title} onChange={setTitle} />
              <Field label="One-line description" value={desc} onChange={setDesc} hint={`${desc.length}/90 — this is all a visitor reads before tapping`} />
              <Field label="Price (₹)" value={price} onChange={(v) => setPrice(v.replace(/\D/g, ''))} hint="0 makes it free. You keep the full amount." narrow />
            </Group>

            <Group title={DETAIL_TITLE[type]}>
              {type === 'event' && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Date" defaultValue="Sat, 14 Jun 2025" />
                    <Field label="Time" defaultValue="4:00 – 7:00 pm" />
                    <Field label="Venue" defaultValue="The Yarn Social" />
                    <Field label="Address" defaultValue="24 Chapel Road, Bandra West, Mumbai" />
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-surface px-4 py-3 ring-1 ring-line">
                    <ImageIcon className="size-5 text-faint" />
                    <p className="flex-1 text-sm">workshop-cover.jpg <span className="text-muted">· cover image</span></p>
                    <button type="button" className="text-sm font-medium text-accent">Replace</button>
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-medium">Ticket types</p>
                    <div className="overflow-hidden rounded-xl bg-surface ring-1 ring-line">
                      <div className="grid grid-cols-[minmax(0,1fr)_90px_80px] gap-3 border-b border-line px-4 py-2 text-xs text-muted"><span>Name</span><span>Price</span><span>Capacity</span></div>
                      {TICKETS.map((t) => (
                        <div key={t[0]} className="grid grid-cols-[minmax(0,1fr)_90px_80px] gap-3 border-b border-line px-4 py-2 last:border-0">
                          <input defaultValue={t[0]} className="h-9 min-w-0 rounded-md bg-canvas px-2 text-sm outline-none focus:ring-2 focus:ring-accent" />
                          <input defaultValue={t[1]} className="h-9 min-w-0 rounded-md bg-canvas px-2 text-sm tabular-nums outline-none focus:ring-2 focus:ring-accent" />
                          <input defaultValue={t[2]} className="h-9 min-w-0 rounded-md bg-canvas px-2 text-sm tabular-nums outline-none focus:ring-2 focus:ring-accent" />
                        </div>
                      ))}
                    </div>
                    <button type="button" className="mt-2 text-sm font-medium text-accent">+ Add ticket type</button>
                  </div>
                </>
              )}

              {type === 'call' && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Duration" defaultValue="30 min" />
                    <Field label="Meeting location" defaultValue="Google Meet — link sent on booking" />
                    <div className="sm:col-span-2">
                      <Field label="Details for the buyer" defaultValue="Keep your project and pattern handy. Good light helps!" />
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-medium">Available slots</p>
                    <div className="divide-y divide-line rounded-xl bg-surface ring-1 ring-line">
                      {SLOTS.map((s) => (
                        <div key={s.day} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 text-sm">
                          <span className="w-10 font-medium">{s.day}</span>
                          {s.times.length ? (
                            <span className="text-muted">{s.times.join(', ')}</span>
                          ) : (
                            <span className="text-faint">Unavailable</span>
                          )}
                          <button type="button" className="ml-auto text-sm font-medium text-accent">Edit</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {type === 'digital' && (
                <>
                  <div className="flex items-center gap-3 rounded-xl bg-surface px-4 py-3 ring-1 ring-line">
                    <FileText className="size-5 text-faint" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">sunflower-granny-square.pdf</p>
                      <p className="flex items-center gap-1 text-xs text-muted"><Lock className="size-3" /> Private · delivered only after confirmed payment</p>
                    </div>
                    <button type="button" aria-label="Remove file" className="grid size-8 place-items-center rounded-lg text-muted hover:bg-canvas">
                      <X className="size-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    className="flex h-24 w-full flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-line text-sm text-muted transition-colors duration-150 ease-out hover:border-accent hover:text-ink"
                  >
                    <UploadCloud className="size-5" /> Replace file (PDF, ZIP, up to 200 MB)
                  </button>
                </>
              )}

              {type === 'physical' && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="SKU" defaultValue="PC-KIT-01" />
                  <Field label="Stock" defaultValue="9" hint="Sold out shows automatically at 0" />
                  <div className="sm:col-span-2">
                    <Field label="Variants" defaultValue="Terracotta, Sage, Cream" hint="Comma-separated, e.g. colours or sizes" />
                  </div>
                  <Field label="Dispatch time" defaultValue="2–3 days" />
                  <Field label="Shipping fee" defaultValue="₹80, free above ₹1,500" />
                  <div className="sm:col-span-2">
                    <Field label="Shipping & packaging note" defaultValue="Packed by hand in recycled kraft paper. Shipped by Delhivery." />
                  </div>
                </div>
              )}

              {type === 'activity' && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Repeats" defaultValue="Every Thursday" />
                  <Field label="Time" defaultValue="7:00 – 9:00 pm" />
                  <Field label="Location" defaultValue="Online (Zoom)" />
                  <Field label="Seats per session" defaultValue="20" />
                </div>
              )}
            </Group>

            <div className="flex flex-wrap gap-3 border-t border-line pt-6">
              <button
                type="button"
                onClick={() => onSave?.(false)}
                className="h-10 rounded-lg bg-accent px-5 text-sm font-semibold text-white transition-colors duration-150 ease-out hover:bg-accent-ink"
              >
                Add to store
              </button>
              <button
                type="button"
                onClick={() => onSave?.(true)}
                className="h-10 rounded-lg bg-surface px-5 text-sm font-medium ring-1 ring-line transition-colors duration-150 ease-out hover:bg-canvas"
              >
                Save as draft
              </button>
            </div>
          </form>

          {/* Live preview, as a visitor sees it */}
          <aside className="lg:sticky lg:top-10 lg:self-start">
            <p className="mb-3 text-sm text-muted">On your store</p>
            <div className="rounded-2xl bg-paper p-4">
              <div className="rounded-2xl bg-white p-4 ring-1 ring-[#ebe3da]">
                <p className="text-xs font-medium text-brand">{typeLabel(type)}</p>
                <h3 className="mt-0.5 break-words text-[15px] font-semibold leading-snug">{title || 'Untitled item'}</h3>
                <p className="mt-0.5 break-words text-sm leading-relaxed text-[#6b625b]">{desc}</p>
                <p className="mt-2 text-[13px] text-[#6b625b]">{preset.when}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[15px] font-semibold">{price === '0' || !price ? 'Free' : formatINR(Number(price))}</span>
                  <span className="rounded-full bg-brand-soft px-4 py-2 text-sm font-semibold text-[#8f3420]">{ctaLabel(type)}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </Shell>
  )
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 text-base font-semibold">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

function Field({
  label,
  value,
  defaultValue,
  onChange,
  hint,
  narrow,
}: {
  label: string
  value?: string
  defaultValue?: string
  onChange?: (v: string) => void
  hint?: string
  narrow?: boolean
}) {
  return (
    <label className={`block ${narrow ? 'max-w-[200px]' : ''}`}>
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <input
        value={value}
        defaultValue={value === undefined ? defaultValue : undefined}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className="h-11 w-full rounded-lg bg-surface px-3 text-sm ring-1 ring-line outline-none transition-shadow duration-150 ease-out focus:ring-2 focus:ring-accent"
      />
      {hint && <span className="mt-1.5 block text-xs text-faint">{hint}</span>}
    </label>
  )
}

const TYPE_ORDER: ItemType[] = ['event', 'call', 'digital', 'physical']

const NAV_FOR: Record<ItemType, NavKey> = {
  event: 'events',
  activity: 'events',
  experience: 'events',
  call: 'meetings',
  digital: 'digital',
  physical: 'physical',
}

const TICKETS = [
  ['Early bird', '1800', '8'],
  ['Regular', '2200', '4'],
]

const DETAIL_TITLE: Record<ItemType, string> = {
  event: 'Date, venue and tickets',
  call: 'Duration, availability and location',
  digital: 'Protected file',
  physical: 'SKU, stock, variants and dispatch',
  activity: 'Schedule',
  experience: 'Dates, place and seats',
}

const PRESETS: Record<ItemType, { title: string; description: string; price: number; when: string }> = {
  event: { title: 'Saturday Amigurumi Workshop', description: 'Make your first crochet bunny in three hours. Yarn, hook and chai included.', price: 1800, when: 'Sat, 14 Jun · 4–7 pm · Bandra' },
  call: { title: 'Free 15-min intro call', description: 'Tell me what you want to make and I’ll suggest where to start.', price: 0, when: '15 min · Google Meet' },
  digital: { title: 'Sunflower granny square pattern', description: '14-page PDF with photo steps and a chart. Beginner friendly.', price: 249, when: 'Instant PDF download' },
  physical: { title: 'Beginner crochet kit', description: 'Three cotton yarns, a wooden hook, markers and a printed coaster guide.', price: 1450, when: 'Ships in 3 days · 9 left' },
  activity: { title: 'Thursday crochet circle', description: 'Bring any project. Two hours of company and help, every week.', price: 350, when: 'Thursdays · 7–9 pm · Online' },
  experience: { title: 'Coorg crochet retreat, Season 2', description: 'Three days on a coffee estate. Stay, meals and materials included.', price: 18500, when: '17–19 Oct · Madikeri, Coorg' },
}

const SLOTS = [
  { day: 'Mon', times: [] as string[] },
  { day: 'Tue', times: ['6:00 pm', '6:30 pm', '7:00 pm'] },
  { day: 'Wed', times: ['11:00 am', '11:30 am', '7:00 pm'] },
  { day: 'Thu', times: [] as string[] },
  { day: 'Fri', times: ['5:00 pm', '5:30 pm', '6:00 pm'] },
]

export const args = {
  type: 'call',
  published: true,
}

export const argTypes = {
  type: { control: 'radio', options: ['event', 'call', 'digital', 'physical'] },
  published: { control: 'boolean' },
}
