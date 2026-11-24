import React, { useState } from 'react'
import { Minus, Plus, ShieldCheck, FlaskConical, Loader2 } from 'lucide-react'

import { TopBar } from '../shared/buyer/TopBar'
import { ItemImage } from '../shared/buyer/ProductCard'
import { findItem, formatINR, typeLabel, bagTotals, type BagLine } from '../shared/storefront/data'

export type CheckoutResult = {
  quantity: number
  slot?: string
  ticket?: string
  name: string
  email: string
}

type Props = Omit<Partial<typeof args>, 'lines'> & {
  lines?: BagLine[]
  onBack?: () => void
  onPay?: (result: CheckoutResult) => void
}

export default function Checkout(props: Props) {
  const { mode, itemId, lines, state, payment, onBack, onPay } = { ...args, ...props }
  const booking = mode === 'booking'
  const item = findItem(itemId)
  const needsSlot = booking && item.type === 'call'
  const takesQty = booking && !needsSlot
  const [ticketName, setTicketName] = useState(item.tickets?.find((t) => t.left > 0)?.name)
  const ticket = item.tickets?.find((t) => t.name === ticketName)
  const unitPrice = ticket?.price ?? item.price
  const maxQty = ticket?.left ?? item.seatsLeft ?? 1

  const [qty, setQty] = useState(1)
  const [slot, setSlot] = useState<string | undefined>()
  const [name, setName] = useState('Ananya Rao')
  const [email, setEmail] = useState('ananya.rao@gmail.com')
  const [phone, setPhone] = useState('+91 99300 11872')

  const bag = bagTotals(lines)
  const total = booking ? unitPrice * qty : bag.total
  const ready = name.trim() && email.includes('@') && (!needsSlot || slot)
  const paying = state === 'paying'

  return (
    <main className="flex min-h-full flex-col bg-paper">
      <TopBar bagCount={bag.count} onBack={onBack} title="Checkout" agent={false} />

      <div className="mx-auto w-full max-w-5xl flex-1 lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-10 lg:px-4 lg:pt-6">
        <div className="space-y-8 px-4 pb-8 pt-5 lg:px-0 lg:pt-0">
          {booking ? (
            <section className="flex gap-3">
              <div className="size-16 shrink-0 overflow-hidden rounded-xl"><ItemImage item={item} /></div>
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-brand">{typeLabel(item.type)}</p>
                <h1 className="text-base font-semibold leading-snug">{item.title}</h1>
                <p className="text-sm text-muted">{item.when}{item.location && ` · ${item.location}`}</p>
              </div>
            </section>
          ) : (
            <section>
              <h2 className="text-sm font-semibold">Your order</h2>
              <ul className="mt-3 space-y-3">
                {lines.map((l) => {
                  const i = findItem(l.id)
                  return (
                    <li key={l.id + (l.option ?? '')} className="flex items-center gap-3">
                      <div className="size-12 shrink-0 overflow-hidden rounded-lg"><ItemImage item={i} /></div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{i.title}</p>
                        <p className="text-xs text-muted">{l.qty} × {formatINR(i.price)}{l.option && ` · ${l.option}`}</p>
                      </div>
                      <p className="text-sm font-semibold tabular-nums">{formatINR(i.price * l.qty)}</p>
                    </li>
                  )
                })}
              </ul>
            </section>
          )}

          {needsSlot && item.slots && (
            <section>
              <h2 className="text-sm font-semibold">Pick a time</h2>
              <p className="mt-0.5 text-xs text-faint">Times in IST. Crossed-out slots are booked.</p>
              <div className="mt-3 space-y-4">
                {item.slots.map((d) => (
                  <div key={d.day}>
                    <p className="mb-2 text-sm text-muted">{d.day} Jun</p>
                    <div className="grid grid-cols-3 gap-2">
                      {d.times.map((t) => {
                        const key = `${d.day} Jun, ${t.time}`
                        return (
                          <button
                            key={t.time}
                            disabled={t.taken}
                            onClick={() => setSlot(key)}
                            className={`h-11 rounded-xl text-sm font-medium transition-colors duration-150 ease-out ${
                              t.taken
                                ? 'cursor-not-allowed text-faint line-through ring-1 ring-line'
                                : slot === key
                                  ? 'bg-brand text-white'
                                  : 'bg-card ring-1 ring-line hover:ring-brand'
                            }`}
                          >
                            {t.time}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {booking && item.tickets && (
            <section>
              <h2 className="text-sm font-semibold">Ticket type</h2>
              <div className="mt-3 space-y-2">
                {item.tickets.map((t) => (
                  <button
                    key={t.name}
                    disabled={t.left === 0}
                    onClick={() => { setTicketName(t.name); setQty(1) }}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-left transition-colors duration-150 ease-out ${
                      t.left === 0 ? 'cursor-not-allowed text-faint ring-1 ring-line'
                      : ticketName === t.name ? 'bg-brand-soft ring-2 ring-brand'
                      : 'bg-card ring-1 ring-line hover:ring-brand/60'
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block text-sm font-medium">{t.name}</span>
                      <span className="block text-xs text-muted">{t.left === 0 ? (t.note ?? 'Sold out') : `${t.left} left${t.note ? ` · ${t.note}` : ''}`}</span>
                    </span>
                    <span className="shrink-0 text-sm font-semibold tabular-nums">{formatINR(t.price)}</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {takesQty && (
            <section className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold">{item.tickets ? 'Quantity' : 'Seats'}</h2>
                <p className="text-xs text-faint">{maxQty} left</p>
              </div>
              <div className="flex items-center rounded-full bg-card ring-1 ring-line">
                <button aria-label="Fewer" disabled={qty <= 1} onClick={() => setQty((q) => q - 1)} className="grid size-10 place-items-center disabled:text-faint">
                  <Minus className="size-4" />
                </button>
                <span className="w-7 text-center font-semibold tabular-nums">{qty}</span>
                <button aria-label="More" disabled={qty >= maxQty} onClick={() => setQty((q) => q + 1)} className="grid size-10 place-items-center disabled:text-faint">
                  <Plus className="size-4" />
                </button>
              </div>
            </section>
          )}

          <section>
            <h2 className="text-sm font-semibold">Your details</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Field label="Name" value={name} onChange={setName} />
              <Field label="Phone" value={phone} onChange={setPhone} />
              <div className="sm:col-span-2">
                <Field label="Email" value={email} onChange={setEmail} hint={booking ? 'Your ticket and joining details go here.' : 'Receipts and download links go here.'} />
              </div>
            </div>
          </section>

          {!booking && bag.hasPhysical && (
            <section>
              <h2 className="text-sm font-semibold">Ship to</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2"><Field label="Address" defaultValue="B-402, Sea Breeze CHS, Carter Road, Bandra West" /></div>
                <Field label="City" defaultValue="Mumbai" />
                <Field label="PIN code" defaultValue="400050" />
              </div>
              <label className="mt-3 block">
                <span className="mb-1.5 block text-sm text-muted">Customisation note (optional)</span>
                <textarea
                  rows={2}
                  placeholder="e.g. a name on the gift tag, or a colour swap"
                  className="w-full resize-none rounded-xl bg-card px-4 py-3 text-[15px] ring-1 ring-line outline-none transition-shadow duration-150 ease-out placeholder:text-faint focus:ring-2 focus:ring-brand"
                />
              </label>
            </section>
          )}

          {state === 'error' && (
            <p role="alert" className="rounded-xl bg-brand-soft px-4 py-3 text-sm text-brand-ink">
              The payment didn't go through and you weren't charged. Try again, or use a different UPI app.
            </p>
          )}
        </div>

        <aside className="sticky bottom-0 border-t border-line bg-paper/95 px-4 pb-5 pt-4 backdrop-blur lg:top-20 lg:self-start lg:rounded-2xl lg:border-0 lg:bg-card lg:p-5 lg:ring-1 lg:ring-line">
          <dl className="space-y-1.5 text-sm">
            {!booking && bag.hasPhysical && (
              <div className="flex justify-between text-muted"><dt>Shipping</dt><dd>{bag.shipping ? formatINR(bag.shipping) : 'Free'}</dd></div>
            )}
            <div className="flex items-baseline justify-between"><dt className="text-muted">Total</dt><dd className="text-xl font-semibold tabular-nums">{formatINR(total)}</dd></div>
          </dl>
          <button
            disabled={!ready || paying}
            onClick={() => onPay?.({ quantity: qty, slot, ticket: ticketName, name, email })}
            className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand text-[15px] font-semibold text-white transition-[background-color,transform,opacity] duration-150 ease-out hover:bg-brand-ink active:scale-[0.98] disabled:opacity-40 disabled:active:scale-100"
          >
            {paying && <Loader2 className="size-4 animate-spin" />}
            {paying ? 'Processing…' : needsSlot && !slot ? 'Pick a time to continue' : total === 0 ? 'Confirm booking' : `Pay ${formatINR(total)}`}
          </button>
          <p className="mt-2.5 flex items-center justify-center gap-1.5 text-xs text-faint">
            {payment === 'test' ? (
              <><FlaskConical className="size-3.5" /> Test payment — no money moves</>
            ) : (
              <><ShieldCheck className="size-3.5" /> Secured by Razorpay · UPI, cards, net banking</>
            )}
          </p>
        </aside>
      </div>
    </main>
  )
}

function Field({ label, value, defaultValue, onChange, hint }: { label: string; value?: string; defaultValue?: string; onChange?: (v: string) => void; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-muted">{label}</span>
      <input
        value={value}
        defaultValue={value === undefined ? defaultValue : undefined}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className="h-12 w-full rounded-xl bg-card px-4 text-[15px] ring-1 ring-line outline-none transition-shadow duration-150 ease-out focus:ring-2 focus:ring-brand"
      />
      {hint && <span className="mt-1 block text-xs text-faint">{hint}</span>}
    </label>
  )
}

export const args = {
  mode: 'bag',
  itemId: 'troubleshoot-call',
  lines: [
    { id: 'beginner-kit', qty: 1, option: 'Sage' },
    { id: 'sunflower-pattern', qty: 1 },
  ],
  state: 'default',
  payment: 'test',
}

export const argTypes = {
  mode: { control: 'radio', options: ['bag', 'booking'] },
  itemId: {
    control: 'select',
    options: ['amigurumi-workshop', 'intro-call', 'troubleshoot-call', 'crochet-circle', 'coorg-retreat-2'],
  },
  state: { control: 'radio', options: ['default', 'paying', 'error'] },
  payment: { control: 'radio', options: ['test', 'razorpay'] },
}
