import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  X, Ticket, Video, Download, Truck, MapPin, CalendarDays, Instagram, Store, MessageCircle, Sparkles, Check, Phone, Mail, Copy, CalendarPlus,
} from 'lucide-react'

import { TabBar, WalletChip, type Tab } from '../shared/agent/Chrome'
import { ORDERS, shopBy, instagramUrl, statusTone, formatINR, type Order } from '../shared/agent/data'
import { QR } from '../shared/QR'

type Props = Partial<typeof args> & {
  orders?: Order[]
  onTab?: (t: Tab) => void
  onShop?: (handle: string) => void
  onAgent?: (ask?: string) => void
}

type Filter = 'all' | 'bookings' | 'deliveries' | 'downloads'

export default function Orders(props: Props) {
  const { balance, filter: initialFilter, openOrder, orders = ORDERS, onTab, onShop, onAgent } = { ...args, ...props }
  const [filter, setFilter] = useState<Filter>(initialFilter as Filter)
  const [openId, setOpenId] = useState<string | null>(openOrder || null)
  const list = orders.filter((o) =>
    filter === 'all' ? true : filter === 'bookings' ? o.kind === 'event' || o.kind === 'call' : filter === 'deliveries' ? o.kind === 'physical' : o.kind === 'digital',
  )
  const open = orders.find((o) => o.id === openId)
  const active = orders.filter((o) => o.status !== 'Delivered' && o.status !== 'Completed').length

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-8">
        <header className="flex items-center justify-between gap-3 pb-1 pt-5">
          <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
          <WalletChip balance={balance} onClick={() => onTab?.('wallet')} />
        </header>
        <p className="text-sm text-muted">Everything you’ve bought or booked, at every shop.</p>

        <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none]">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`h-9 shrink-0 whitespace-nowrap rounded-full px-4 text-sm font-medium transition-colors duration-150 ease-out ${filter === f.key ? 'bg-ink text-white' : 'bg-card ring-1 ring-line hover:bg-line/40'}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <ul className="mt-4 divide-y divide-line overflow-hidden rounded-2xl bg-card ring-1 ring-line">
          {list.map((o) => (
            <li key={o.id}>
              <button onClick={() => setOpenId(o.id)} className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors duration-150 ease-out hover:bg-paper">
                <img src={o.image} alt="" className="size-12 shrink-0 rounded-xl object-cover" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{o.title}</span>
                  <span className="block truncate text-xs text-muted">@{o.shop} · {o.amount === 0 ? 'Free' : formatINR(o.amount)}{o.paidBy === 'agent' ? ' · by agent' : ''}</span>
                  <span className="mt-0.5 block truncate text-xs text-ink/80">{headline(o)}</span>
                </span>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${statusTone(o.status)}`}>{o.status}</span>
              </button>
            </li>
          ))}
          {!list.length && <li className="px-4 py-10 text-center text-sm text-muted">Nothing here yet.</li>}
        </ul>
      </main>

      <TabBar active="orders" badge={active} onTab={onTab} />

      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={() => setOpenId(null)} className="fixed inset-0 z-40 bg-ink/30" />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
              role="dialog"
              aria-label={open.title}
              className="fixed inset-x-0 bottom-0 top-8 z-50 mx-auto flex max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-paper"
            >
              <Detail order={open} onClose={() => setOpenId(null)} onShop={onShop} onAgent={onAgent} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function Detail({ order: o, onClose, onShop, onAgent }: { order: Order; onClose: () => void; onShop?: (h: string) => void; onAgent?: (ask?: string) => void }) {
  const s = shopBy(o.shop)
  const [copied, setCopied] = useState(false)

  return (
    <>
      <div className="flex items-center gap-3 border-b border-line bg-card px-4 py-3">
        <img src={o.image} alt="" className="size-10 shrink-0 rounded-xl object-cover" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{o.title}</p>
          <p className="truncate text-xs text-muted">{o.id} · {o.placed}</p>
        </div>
        <button aria-label="Close" onClick={onClose} className="grid size-9 shrink-0 place-items-center rounded-full hover:bg-paper"><X className="size-5" /></button>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto px-4 py-5">
        {/* The thing the buyer opens this for */}
        {o.kind === 'event' && (
          <section className="rounded-2xl bg-card p-5 text-center ring-1 ring-line">
            <QR seed={o.id.length * 97 + o.qty} className="mx-auto size-40" label={`Ticket ${o.id}`} />
            <p className="mt-3 text-sm font-semibold">{o.qty} × {o.ticket} · show at the door</p>
            <ul className="mt-2 flex flex-wrap justify-center gap-1.5">
              {o.attendees?.map((a) => <li key={a} className="rounded-full bg-paper px-2.5 py-1 text-xs font-medium">{a}</li>)}
            </ul>
          </section>
        )}

        {o.kind === 'call' && (
          <section className="rounded-2xl bg-card p-4 ring-1 ring-line">
            <p className="text-xs text-muted">Your 1:1 with {s.name}</p>
            <p className="mt-1 text-lg font-semibold">{o.slot}</p>
            {o.topic && <p className="mt-2 rounded-xl bg-paper px-3 py-2 text-sm">“{o.topic}”</p>}
            <div className="mt-4 flex gap-2">
              <a href={`https://${o.meet}`} target="_blank" rel="noreferrer" className="flex h-11 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-brand text-sm font-semibold text-white"><Video className="size-4" /> Join Google Meet</a>
              <button className="flex h-11 items-center gap-1.5 whitespace-nowrap rounded-full px-4 text-sm font-medium ring-1 ring-line"><CalendarPlus className="size-4" /> Calendar</button>
            </div>
            <p className="mt-2 text-xs text-muted">Reschedule free up to 12 hours before.</p>
          </section>
        )}

        {o.kind === 'digital' && (
          <section className="rounded-2xl bg-card p-4 ring-1 ring-line">
            <p className="text-sm font-medium">{o.file}</p>
            <p className="mt-0.5 text-xs text-muted">Also sent to {o.email}</p>
            <button className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-brand text-sm font-semibold text-white"><Download className="size-4" /> Download</button>
          </section>
        )}

        {o.kind === 'physical' && (
          <section className="rounded-2xl bg-card p-4 ring-1 ring-line">
            <ol className="space-y-0">
              {STAGES.map((st, i) => {
                const reached = STAGES.indexOf(o.status as (typeof STAGES)[number]) >= i
                const last = i === STAGES.length - 1
                return (
                  <li key={st} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className={`grid size-5 place-items-center rounded-full ${reached ? 'bg-ok text-white' : 'ring-1 ring-line'}`}>{reached && <Check className="size-3" strokeWidth={3} />}</span>
                      {!last && <span className={`w-px flex-1 ${reached ? 'bg-ok' : 'bg-line'}`} />}
                    </div>
                    <p className={`pb-4 text-sm ${reached ? 'font-medium' : 'text-faint'}`}>{st}{st === o.status && o.tracking ? <span className="block text-xs font-normal text-muted">{o.tracking}</span> : null}</p>
                  </li>
                )
              })}
            </ol>
          </section>
        )}

        {/* Details the buyer gave */}
        <section>
          <h3 className="text-sm font-semibold">Details</h3>
          <dl className="mt-2 divide-y divide-line overflow-hidden rounded-2xl bg-card text-sm ring-1 ring-line">
            {o.when && <Line icon={CalendarDays} label="When" value={o.when} />}
            {o.location && <Line icon={MapPin} label="Where" value={o.location} />}
            {o.variant && <Line icon={Truck} label="Item" value={`${o.qty} × ${o.variant}`} />}
            {o.address && <Line icon={MapPin} label="Deliver to" value={`${o.name} · ${o.address}`} />}
            {o.phone && o.kind !== 'digital' && <Line icon={Phone} label="Phone" value={o.phone} />}
            <Line icon={Mail} label="Email" value={o.email} />
            {o.note && <Line icon={MessageCircle} label="Note" value={o.note} />}
            <Line icon={o.paidBy === 'agent' ? Sparkles : Ticket} label="Paid" value={`${o.amount === 0 ? 'Free' : formatINR(o.amount)} · ${o.paidBy === 'agent' ? 'by your agent' : 'by you'} · wallet`} />
          </dl>
        </section>

        {/* The seller, and every way to reach them */}
        <section>
          <h3 className="text-sm font-semibold">Sold by</h3>
          <div className="mt-2 rounded-2xl bg-card p-3 ring-1 ring-line">
            <div className="flex items-center gap-3">
              <img src={s.avatar} alt="" className="size-11 shrink-0 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{s.name}</p>
                <p className="truncate text-xs text-muted">@{s.handle} · {s.code}</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <button onClick={() => onShop?.(s.handle)} className="flex h-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-ink text-xs font-semibold text-white"><Store className="size-4" /> Shop</button>
              <a href={instagramUrl(s.handle)} target="_blank" rel="noreferrer" className="flex h-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-full text-xs font-semibold ring-1 ring-line hover:bg-paper"><Instagram className="size-4" /> Instagram</a>
              <a href={`https://ig.me/m/${s.handle}`} target="_blank" rel="noreferrer" className="flex h-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-full text-xs font-semibold ring-1 ring-line hover:bg-paper"><MessageCircle className="size-4" /> Message</a>
            </div>
          </div>
        </section>

        <div className="flex flex-wrap gap-2 pb-2">
          <button onClick={() => onAgent?.(`Where is my ${o.title.toLowerCase()}?`)} className="flex h-10 items-center gap-1.5 whitespace-nowrap rounded-full bg-card px-4 text-sm font-medium ring-1 ring-line hover:bg-line/40"><Sparkles className="size-4" /> Ask agent about this</button>
          <button
            onClick={() => {
              setCopied(true)
              setTimeout(() => setCopied(false), 1400)
            }}
            className="flex h-10 items-center gap-1.5 whitespace-nowrap rounded-full bg-card px-4 text-sm font-medium ring-1 ring-line hover:bg-line/40"
          >
            {copied ? <Check className="size-4 text-ok" /> : <Copy className="size-4" />} {copied ? 'Copied' : `Copy ${o.id}`}
          </button>
        </div>
      </div>
    </>
  )
}

function Line({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <div className="flex gap-3 px-4 py-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-faint" />
      <dt className="w-20 shrink-0 text-muted">{label}</dt>
      <dd className="min-w-0 flex-1 font-medium">{value}</dd>
    </div>
  )
}

function headline(o: Order): string {
  if (o.kind === 'event') return `${o.qty} ${o.qty > 1 ? 'tickets' : 'ticket'} · ${o.when}`
  if (o.kind === 'call') return o.slot ?? ''
  if (o.kind === 'digital') return 'Ready to download'
  return o.tracking ?? `${o.qty} × ${o.variant ?? 'item'}`
}

const STAGES = ['Confirmed', 'Packed', 'On the way', 'Delivered'] as const

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'bookings', label: 'Tickets & calls' },
  { key: 'deliveries', label: 'Deliveries' },
  { key: 'downloads', label: 'Downloads' },
]

export const args = {
  balance: 4250,
  filter: 'all',
  openOrder: '',
}

export const argTypes = {
  balance: { control: 'number' },
  filter: { control: 'radio', options: ['all', 'bookings', 'deliveries', 'downloads'] },
  openOrder: { control: 'select', options: ['', 'SF-2485', 'KR-0412', 'SF-2474', 'SF-2466', 'IS-0988'] },
}
