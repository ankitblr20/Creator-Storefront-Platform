import React, { useState } from 'react'
import { Mail, Download, CalendarPlus, Video, MapPin, Truck, ChevronDown, Loader2 } from 'lucide-react'

import { TopBar } from '../shared/buyer/TopBar'
import { ItemImage } from '../shared/buyer/ProductCard'
import { QR } from '../shared/QR'
import { FULFILMENT, findItem, formatINR } from '../shared/storefront/data'

type Tab = 'orders' | 'bookings'
type Step = 'lookup' | 'code' | 'results'

type Props = Partial<typeof args> & { onBack?: () => void; onBag?: () => void }

export default function MyOrders(props: Props) {
  const { tab: initialTab, step: initialStep, bagCount, onBack, onBag } = { ...args, ...props }
  const [tab, setTab] = useState<Tab>(initialTab as Tab)
  const [step, setStep] = useState<Step>(initialStep as Step)
  const [email, setEmail] = useState('ananya.rao@gmail.com')
  const [code, setCode] = useState('')
  const [sending, setSending] = useState(false)
  const [open, setOpen] = useState<string | null>('SF-2482')

  const send = () => {
    setSending(true)
    setTimeout(() => { setSending(false); setStep('code') }, 600)
  }

  return (
    <div className="flex h-screen flex-col bg-paper">
      <TopBar bagCount={bagCount} onBack={onBack} onBag={onBag} title={tab === 'orders' ? 'My orders' : 'My bookings'} />

      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-xl px-5 pb-12 pt-5">
          {/* Orders / bookings switch */}
          <div className="grid grid-cols-2 rounded-full bg-card p-1 ring-1 ring-line">
            {(['orders', 'bookings'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`h-9 rounded-full text-sm font-medium transition-colors duration-150 ease-out ${tab === t ? 'bg-ink text-white' : 'text-muted hover:text-ink'}`}
              >
                {t === 'orders' ? 'Orders' : 'Bookings & tickets'}
              </button>
            ))}
          </div>

          {step !== 'results' ? (
            <section className="mt-8">
              <h1 className="font-display text-2xl font-semibold tracking-tight">
                {tab === 'orders' ? 'Find your order' : 'Find your bookings'}
              </h1>
              <p className="mt-1.5 text-sm text-muted">No account needed. Use the email you checked out with and we’ll send a 4-digit code.</p>

              <label className="mt-6 block">
                <span className="mb-1.5 block text-sm text-muted">Email</span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={step === 'code'}
                  className="h-12 w-full rounded-xl bg-card px-4 text-[15px] ring-1 ring-line outline-none focus:ring-2 focus:ring-brand disabled:text-muted"
                />
              </label>

              {step === 'code' && (
                <label className="mt-4 block">
                  <span className="mb-1.5 flex items-center justify-between text-sm text-muted">
                    Code sent to your email
                    <button onClick={() => setStep('lookup')} className="font-medium text-brand-ink">Change email</button>
                  </span>
                  <input
                    autoFocus
                    inputMode="numeric"
                    maxLength={4}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="• • • •"
                    className="h-12 w-full rounded-xl bg-card px-4 text-center text-xl font-semibold tracking-[0.5em] ring-1 ring-line outline-none focus:ring-2 focus:ring-brand"
                  />
                </label>
              )}

              <button
                onClick={step === 'lookup' ? send : () => setStep('results')}
                disabled={sending || (step === 'code' && code.length < 4) || !email.includes('@')}
                className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand text-[15px] font-semibold text-white transition-[background-color,opacity] duration-150 ease-out hover:bg-brand-ink disabled:opacity-40"
              >
                {sending ? <Loader2 className="size-4 animate-spin" /> : <Mail className="size-4" />}
                {step === 'lookup' ? (sending ? 'Sending…' : 'Email me a code') : 'Show my orders'}
              </button>
              <p className="mt-3 text-center text-xs text-faint">Have an order number? It’s in your confirmation email, starting with SF-.</p>
            </section>
          ) : tab === 'orders' ? (
            <section className="mt-6">
              <p className="text-sm text-muted">{ORDERS.length} orders for {email}</p>
              <ul className="mt-3 space-y-3">
                {ORDERS.map((o) => {
                  const item = findItem(o.itemId)
                  const expanded = open === o.id
                  return (
                    <li key={o.id} className="overflow-hidden rounded-2xl bg-card ring-1 ring-line">
                      <button onClick={() => setOpen(expanded ? null : o.id)} className="flex w-full items-center gap-3 p-4 text-left">
                        <div className="size-14 shrink-0 overflow-hidden rounded-xl"><ItemImage item={item} /></div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">{item.title}</p>
                          <p className="text-xs text-muted">{o.id} · {o.date} · {formatINR(o.amount)}</p>
                          <p className={`mt-0.5 text-xs font-semibold ${o.status === 'Delivered' || o.status === 'Ready' ? 'text-ok' : 'text-brand-ink'}`}>{o.status}</p>
                        </div>
                        <ChevronDown className={`size-4 shrink-0 text-faint transition-transform duration-200 ease-out ${expanded ? 'rotate-180' : ''}`} />
                      </button>
                      {expanded && (
                        <div className="border-t border-line px-4 pb-4 pt-3">
                          {item.type === 'physical' ? (
                            <>
                              <ol className="grid grid-cols-4 gap-1">
                                {FULFILMENT.map((s, i) => {
                                  const reached = i <= FULFILMENT.indexOf(o.status as (typeof FULFILMENT)[number])
                                  return (
                                    <li key={s}>
                                      <div className={`h-1 rounded-full ${reached ? 'bg-ok' : 'bg-line'}`} />
                                      <p className={`mt-1.5 text-[11px] ${o.status === s ? 'font-semibold' : reached ? 'text-muted' : 'text-faint'}`}>{s}</p>
                                    </li>
                                  )
                                })}
                              </ol>
                              <p className="mt-3 flex items-start gap-2 text-sm text-muted">
                                <Truck className="mt-0.5 size-4 shrink-0 text-faint" />
                                {o.tracking ? `Delhivery ${o.tracking}` : `Packed and ready — ${item.dispatch?.toLowerCase()}. Tracking appears here once it ships.`}
                              </p>
                              {o.address && <p className="mt-1.5 flex items-start gap-2 text-sm text-muted"><MapPin className="mt-0.5 size-4 shrink-0 text-faint" />{o.address}</p>}
                            </>
                          ) : (
                            <a href="#" className="flex h-11 items-center justify-center gap-2 rounded-full bg-brand text-sm font-semibold text-white hover:bg-brand-ink">
                              <Download className="size-4" /> Secure download · 3 of 5 left
                            </a>
                          )}
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
            </section>
          ) : (
            <section className="mt-6">
              <p className="text-sm text-muted">Coming up for {email}</p>
              <ul className="mt-3 space-y-3">
                {BOOKINGS.map((b) => {
                  const item = findItem(b.itemId)
                  const isCall = item.type === 'call'
                  return (
                    <li key={b.id} className="rounded-2xl bg-card p-4 ring-1 ring-line">
                      <div className="flex gap-4">
                        {isCall ? (
                          <div className="grid size-20 shrink-0 place-items-center rounded-xl bg-brand-soft"><Video className="size-7 text-brand" strokeWidth={1.5} /></div>
                        ) : (
                          <QR seed={b.id.length * 31} className="size-20 shrink-0 ring-1 ring-line" label="Ticket QR" />
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-brand">{b.label}</p>
                          <p className="text-sm font-semibold leading-snug">{item.title}</p>
                          <p className="mt-1 text-xs text-muted">{b.when}</p>
                          <p className="text-xs text-muted">{isCall ? 'Google Meet' : item.location}</p>
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <a href="#" className="flex h-9 items-center justify-center gap-1.5 rounded-full text-xs font-semibold ring-1 ring-line hover:bg-paper">
                          <CalendarPlus className="size-3.5" /> Add to calendar
                        </a>
                        <a href="#" className="flex h-9 items-center justify-center gap-1.5 rounded-full bg-brand text-xs font-semibold text-white hover:bg-brand-ink">
                          {isCall ? <><Video className="size-3.5" /> Join call</> : 'Show ticket'}
                        </a>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </section>
          )}
        </div>
      </main>
    </div>
  )
}

const ORDERS = [
  { id: 'SF-2482', itemId: 'beginner-kit', date: '9 Jun', amount: 1450, status: 'Packed', tracking: '', address: 'B-402, Sea Breeze CHS, Carter Road, Bandra West, Mumbai 400050' },
  { id: 'SF-2440', itemId: 'coaster-set', date: '28 May', amount: 650, status: 'Delivered', tracking: '2214 8890 3312', address: 'B-402, Sea Breeze CHS, Carter Road, Bandra West, Mumbai 400050' },
  { id: 'SF-2431', itemId: 'sunflower-pattern', date: '24 May', amount: 249, status: 'Ready', tracking: '', address: '' },
]

const BOOKINGS = [
  { id: 'SF-2485', itemId: 'amigurumi-workshop', label: 'Bring a friend · 2 seats', when: 'Sat, 14 Jun · 4–7 pm' },
  { id: 'SF-2483x', itemId: 'troubleshoot-call', label: '1:1 meeting · 30 min', when: 'Wed 11 Jun · 11:00 am' },
]

export const args = {
  tab: 'orders',
  step: 'lookup',
  bagCount: 0,
}

export const argTypes = {
  tab: { control: 'radio', options: ['orders', 'bookings'] },
  step: { control: 'radio', options: ['lookup', 'code', 'results'] },
  bagCount: { control: 'number' },
}
