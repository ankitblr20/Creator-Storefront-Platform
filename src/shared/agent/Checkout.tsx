import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Minus, Plus, Loader2, Wallet, ChevronLeft, MapPin, CalendarDays, Video, Mail, Truck, Ticket, Download, Store } from 'lucide-react'

import { PROFILE, productBy, shopBy, formatINR, type Order, type Product } from './data'

/**
 * Checkout run by the agent, inside the chat. Three short steps, everything prefilled from
 * the buyer's wallet profile:
 *   choose  — variant / ticket and seats / time slot
 *   details — delivery address, attendee names, what the call is about, or the download email
 *   done    — what happens next, and where to find it
 */
export function Checkout({
  productId,
  topic,
  balance,
  orderNo,
  onTopUp,
  onPaid,
  onViewOrder,
  onOpenShop,
}: {
  productId: string
  topic?: string
  balance: number
  /** Number to give the order */
  orderNo: number
  onTopUp?: (amount: number) => void
  onPaid?: (order: Order) => void
  onViewOrder?: (id: string) => void
  onOpenShop?: (handle: string) => void
}) {
  const p = productBy(productId)
  const shop = shopBy(p.shop)
  const [step, setStep] = useState<'choose' | 'details' | 'paying' | 'done'>('choose')

  // choose
  const [option, setOption] = useState(p.options?.[0])
  const openTickets = p.tickets?.filter((t) => t.left > 0) ?? []
  const [ticketName, setTicketName] = useState(openTickets[0]?.name)
  const ticket = p.tickets?.find((t) => t.name === ticketName)
  const [qty, setQty] = useState(1)
  const firstSlot = p.slots?.find((d) => d.times.length)
  const [slot, setSlot] = useState(firstSlot ? `${firstSlot.day}, ${firstSlot.times[0]}` : undefined)

  // details
  const [name, setName] = useState(PROFILE.name)
  const [phone, setPhone] = useState(PROFILE.phone)
  const [email, setEmail] = useState(PROFILE.email)
  const [addressPick, setAddressPick] = useState<string>(PROFILE.addresses[0].label)
  const [newAddress, setNewAddress] = useState('')
  const [note, setNote] = useState('')
  const [attendees, setAttendees] = useState<string[]>([PROFILE.name])
  const [about, setAbout] = useState(topic ?? '')
  const [showErrors, setShowErrors] = useState(false)

  const seats = p.kind === 'event' ? qty * (ticketName && /pair|2 seats/i.test(ticketName) ? 2 : 1) : 0
  const unit = ticket?.price ?? p.price
  const subtotal = unit * qty
  const shipping = p.kind === 'physical' && subtotal < 1500 ? 80 : 0
  const total = subtotal + shipping
  const maxQty = p.kind === 'physical' ? Math.min(p.stock ?? 5, 5) : p.kind === 'event' ? Math.min(ticket?.left ?? 1, 4) : 1
  const address = addressPick === 'new' ? newAddress.trim() : PROFILE.addresses.find((a) => a.label === addressPick)?.line ?? ''
  const people = Array.from({ length: seats }, (_, i) => attendees[i] ?? '')

  const emailOk = /^\S+@\S+\.\S+$/.test(email)
  const phoneOk = phone.replace(/\D/g, '').length >= 10
  const errors = {
    name: !name.trim(),
    phone: p.kind === 'physical' && !phoneOk,
    email: p.kind !== 'physical' && !emailOk,
    address: p.kind === 'physical' && address.length < 10,
    attendees: p.kind === 'event' && people.some((a) => !a.trim()),
    about: p.kind === 'call' && about.trim().length < 3,
  }
  const valid = !Object.values(errors).some(Boolean)
  const short = total > balance ? total - balance : 0

  const pay = () => {
    if (!valid) return setShowErrors(true)
    setStep('paying')
    setTimeout(() => {
      setStep('done')
      onPaid?.(order())
    }, 900)
  }

  const [orderId] = useState(`SF-${orderNo}`)
  const order = (): Order => ({
    id: orderId,
    productId: p.id,
    shop: p.shop,
    title: p.title,
    image: p.image,
    kind: p.kind,
    amount: total,
    placed: 'Just now',
    paidBy: 'agent',
    status: p.kind === 'physical' ? 'Confirmed' : p.kind === 'digital' ? 'Ready' : 'Upcoming',
    qty,
    variant: option,
    ticket: ticketName,
    attendees: p.kind === 'event' ? people : undefined,
    when: p.when,
    location: p.location,
    slot: p.kind === 'call' ? slot : undefined,
    topic: p.kind === 'call' ? about.trim() : undefined,
    meet: p.kind === 'call' ? 'meet.google.com/qwn-ytbs-kca' : undefined,
    name: name.trim(),
    phone,
    email,
    address: p.kind === 'physical' ? address : undefined,
    note: note.trim() || undefined,
    file: p.file,
  })

  return (
    <div className="overflow-hidden rounded-2xl bg-card ring-1 ring-line">
      {/* What's being bought, always visible */}
      <div className="flex items-center gap-3 p-3">
        <img src={p.image} alt="" className="size-12 shrink-0 rounded-xl object-cover" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{p.title}</p>
          <p className="truncate text-xs text-muted">@{shop.handle} · {kindLine(p)}</p>
        </div>
        <p className="shrink-0 text-sm font-semibold tabular-nums">{total === 0 ? 'Free' : formatINR(total)}</p>
      </div>

      {step === 'choose' && (
        <div className="space-y-4 border-t border-line p-3">
          {p.options && p.options.length > 1 && (
            <Field label={p.kind === 'physical' && /size/i.test(p.options[0]) ? 'Size' : 'Choose'}>
              <div className="flex flex-wrap gap-2">
                {p.options.map((o) => (
                  <Chip key={o} on={option === o} onClick={() => setOption(o)}>{o}</Chip>
                ))}
              </div>
            </Field>
          )}

          {p.tickets && (
            <Field label="Ticket">
              <ul className="space-y-2">
                {p.tickets.map((t) => (
                  <li key={t.name}>
                    <button
                      disabled={t.left === 0}
                      onClick={() => {
                        setTicketName(t.name)
                        setQty(1)
                      }}
                      className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm ring-1 transition-colors duration-150 ease-out disabled:opacity-45 ${
                        ticketName === t.name ? 'bg-ink/[0.03] ring-2 ring-ink' : 'ring-line hover:bg-paper'
                      }`}
                    >
                      <span className="min-w-0">
                        <span className="block font-medium">{t.name}</span>
                        <span className="block text-xs text-muted">{t.left === 0 ? 'Sold out' : `${t.left} left`}</span>
                      </span>
                      <span className="shrink-0 font-semibold tabular-nums">{formatINR(t.price)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </Field>
          )}

          {p.kind === 'event' && p.when && (
            <p className="flex items-start gap-2 text-xs text-muted"><CalendarDays className="mt-px size-3.5 shrink-0" /> {p.when}{p.location ? ` · ${p.location}` : ''}</p>
          )}

          {p.slots && (
            <Field label={`Pick a time · ${p.length ?? ''}`}>
              <div className="space-y-2.5">
                {p.slots.filter((d) => d.times.length).map((d) => (
                  <div key={d.day}>
                    <p className="mb-1.5 text-xs text-muted">{d.day}</p>
                    <div className="flex flex-wrap gap-2">
                      {d.times.map((t) => {
                        const v = `${d.day}, ${t}`
                        return <Chip key={v} on={slot === v} onClick={() => setSlot(v)}>{t}</Chip>
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </Field>
          )}

          {(p.kind === 'physical' || p.kind === 'event') && maxQty > 1 && (
            <Field label={p.kind === 'event' ? 'How many' : 'Quantity'}>
              <div className="flex w-fit items-center rounded-full ring-1 ring-line">
                <button aria-label="Fewer" disabled={qty <= 1} onClick={() => setQty((q) => q - 1)} className="grid size-10 place-items-center disabled:text-faint"><Minus className="size-4" /></button>
                <span className="w-6 text-center text-sm font-semibold tabular-nums">{qty}</span>
                <button aria-label="More" disabled={qty >= maxQty} onClick={() => setQty((q) => q + 1)} className="grid size-10 place-items-center disabled:text-faint"><Plus className="size-4" /></button>
              </div>
            </Field>
          )}

          <Primary onClick={() => setStep('details')}>Continue</Primary>
        </div>
      )}

      {(step === 'details' || step === 'paying') && (
        <div className="space-y-4 border-t border-line p-3">
          <button onClick={() => setStep('choose')} className="-ml-1 flex items-center gap-0.5 text-xs font-medium text-muted hover:text-ink">
            <ChevronLeft className="size-3.5" /> {summary(p, option, ticketName, qty, slot)}
          </button>

          {p.kind === 'physical' && (
            <>
              <Field label="Deliver to">
                <div className="space-y-2">
                  {PROFILE.addresses.map((a) => (
                    <Radio key={a.label} on={addressPick === a.label} onClick={() => setAddressPick(a.label)} title={a.label} sub={a.line} />
                  ))}
                  <Radio on={addressPick === 'new'} onClick={() => setAddressPick('new')} title="Somewhere else" />
                  {addressPick === 'new' && (
                    <textarea
                      autoFocus
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      rows={3}
                      placeholder="House / flat, street, area, city, PIN code"
                      className={inputCls(showErrors && errors.address) + ' h-auto py-2.5'}
                    />
                  )}
                  {showErrors && errors.address && <Err>Add the full address with PIN code.</Err>}
                </div>
              </Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Name on parcel">
                  <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={inputCls(showErrors && errors.name)} />
                </Field>
                <Field label="Phone for the courier">
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" autoComplete="tel" className={inputCls(showErrors && errors.phone)} />
                  {showErrors && errors.phone && <Err>Enter a 10-digit number.</Err>}
                </Field>
              </div>
              <Field label="Note to the seller (optional)">
                <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Gift? Leave with security?" className={inputCls(false)} />
              </Field>
            </>
          )}

          {p.kind === 'event' && (
            <>
              <Field label={seats > 1 ? `Who’s coming · ${seats} names on the tickets` : 'Name on the ticket'}>
                <div className="space-y-2">
                  {people.map((a, i) => (
                    <input
                      key={i}
                      value={a}
                      onChange={(e) => setAttendees((list) => {
                        const next = [...list]
                        next[i] = e.target.value
                        return next
                      })}
                      placeholder={i === 0 ? 'Your name' : `Guest ${i + 1} full name`}
                      className={inputCls(showErrors && !a.trim())}
                    />
                  ))}
                  {showErrors && errors.attendees && <Err>Every seat needs a name — it’s checked at the door.</Err>}
                </div>
              </Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Send tickets to">
                  <input value={email} onChange={(e) => setEmail(e.target.value)} inputMode="email" className={inputCls(showErrors && errors.email)} />
                </Field>
                <Field label="Phone (for changes)">
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" className={inputCls(false)} />
                </Field>
              </div>
              <Field label="Anything the host should know? (optional)">
                <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Left-handed, dietary needs, access…" className={inputCls(false)} />
              </Field>
            </>
          )}

          {p.kind === 'call' && (
            <>
              <Field label="What do you want help with?">
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  rows={3}
                  placeholder="e.g. My granny squares curl at the corners — I’ll show you on camera"
                  className={inputCls(showErrors && errors.about) + ' h-auto py-2.5'}
                />
                {showErrors && errors.about && <Err>A line helps {shop.name.split(' ')[0]} prepare.</Err>}
              </Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Your name">
                  <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls(showErrors && errors.name)} />
                </Field>
                <Field label="Send the Meet link to">
                  <input value={email} onChange={(e) => setEmail(e.target.value)} inputMode="email" className={inputCls(showErrors && errors.email)} />
                </Field>
              </div>
            </>
          )}

          {p.kind === 'digital' && (
            <Field label="Email the download to">
              <input value={email} onChange={(e) => setEmail(e.target.value)} inputMode="email" className={inputCls(showErrors && errors.email)} />
              {showErrors && errors.email && <Err>Enter a valid email.</Err>}
            </Field>
          )}

          {/* Pay */}
          <div className="space-y-1.5 rounded-xl bg-paper px-3 py-2.5 text-sm">
            <Row label={`${qty > 1 ? `${qty} × ` : ''}${formatINR(unit)}`} value={formatINR(subtotal)} />
            {p.kind === 'physical' && <Row label="Delivery" value={shipping ? formatINR(shipping) : 'Free'} />}
            <Row label="Total" value={total === 0 ? 'Free' : formatINR(total)} strong />
            {total > 0 && (
              <p className="flex items-center justify-between pt-0.5 text-xs text-muted">
                <span className="flex items-center gap-1"><Wallet className="size-3.5" /> Riftori wallet</span>
                <span className="tabular-nums">{formatINR(balance)}{short ? '' : ` → ${formatINR(balance - total)}`}</span>
              </p>
            )}
          </div>

          {short > 0 ? (
            <Primary onClick={() => onTopUp?.(Math.ceil(short / 500) * 500)}>
              Add {formatINR(Math.ceil(short / 500) * 500)} to wallet by UPI
            </Primary>
          ) : (
            <Primary onClick={pay} busy={step === 'paying'}>
              {step === 'paying' ? 'Paying…' : total === 0 ? 'Confirm booking' : `Pay ${formatINR(total)}`}
            </Primary>
          )}
        </div>
      )}

      {step === 'done' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="space-y-3 border-t border-line p-3">
          <p className="flex items-center gap-2 text-sm font-semibold text-ok">
            <span className="grid size-6 place-items-center rounded-full bg-ok text-white"><Check className="size-3.5" strokeWidth={3} /></span>
            {total === 0 ? 'Booked' : `Paid ${formatINR(total)}`} · {orderId}
          </p>
          <ul className="space-y-1.5 text-sm text-muted">
            {next(p, { address, email, slot, people, qty }).map(({ icon: Icon, text }) => (
              <li key={text} className="flex gap-2"><Icon className="mt-0.5 size-4 shrink-0" /> <span>{text}</span></li>
            ))}
          </ul>
          <div className="flex gap-2">
            <button onClick={() => onViewOrder?.(orderId)} className="h-10 flex-1 whitespace-nowrap rounded-full bg-ink text-sm font-semibold text-white">View order</button>
            <button onClick={() => onOpenShop?.(p.shop)} className="flex h-10 items-center gap-1.5 whitespace-nowrap rounded-full px-4 text-sm font-medium ring-1 ring-line hover:bg-paper"><Store className="size-4" /> Shop</button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

function kindLine(p: Product): string {
  return p.kind === 'event' ? p.when ?? 'Event' : p.kind === 'call' ? p.length ?? '1:1 call' : p.kind === 'digital' ? 'Instant download' : p.dispatch ?? 'Delivered'
}

function summary(p: Product, option?: string, ticket?: string, qty = 1, slot?: string): string {
  if (p.kind === 'event') return `${qty} × ${ticket}`
  if (p.kind === 'call') return slot ?? 'Pick a time'
  if (p.kind === 'physical') return `${qty} × ${option ?? p.title}`
  return 'Change'
}

function next(p: Product, d: { address: string; email: string; slot?: string; people: string[]; qty: number }) {
  if (p.kind === 'event') return [
    { icon: Ticket, text: `${d.people.length > 1 ? `${d.people.length} QR tickets` : 'QR ticket'} for ${d.people.join(', ')} — in Orders and sent to ${d.email}` },
    { icon: MapPin, text: `${p.when} · ${p.location}` },
  ]
  if (p.kind === 'call') return [
    { icon: Video, text: `${d.slot} · Google Meet link sent to ${d.email}` },
    { icon: CalendarDays, text: 'Added to your calendar. Reschedule free up to 12 h before.' },
  ]
  if (p.kind === 'digital') return [
    { icon: Download, text: 'Ready to download now from Orders' },
    { icon: Mail, text: `Link also sent to ${d.email}` },
  ]
  return [
    { icon: Truck, text: `${p.dispatch ?? 'Ships soon'} · tracking appears in Orders` },
    { icon: MapPin, text: d.address },
  ]
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium text-muted">{label}</p>
      {children}
    </div>
  )
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`h-9 whitespace-nowrap rounded-full px-3.5 text-sm font-medium transition-colors duration-150 ease-out ${on ? 'bg-ink text-white' : 'ring-1 ring-line hover:bg-paper'}`}>
      {children}
    </button>
  )
}

function Radio({ on, onClick, title, sub }: { on: boolean; onClick: () => void; title: string; sub?: string }) {
  return (
    <button onClick={onClick} className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left text-sm ring-1 transition-colors duration-150 ease-out ${on ? 'ring-2 ring-ink' : 'ring-line hover:bg-paper'}`}>
      <span className={`mt-0.5 grid size-4 shrink-0 place-items-center rounded-full ring-1 ${on ? 'ring-ink' : 'ring-faint'}`}>{on && <span className="size-2 rounded-full bg-ink" />}</span>
      <span className="min-w-0">
        <span className="block font-medium">{title}</span>
        {sub && <span className="block text-xs leading-snug text-muted">{sub}</span>}
      </span>
    </button>
  )
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <p className={`flex justify-between ${strong ? 'font-semibold' : 'text-muted'}`}>
      <span>{label}</span>
      <span className="tabular-nums">{value}</span>
    </p>
  )
}

function Primary({ onClick, busy, children }: { onClick: () => void; busy?: boolean; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={busy}
      className="flex h-11 w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-brand text-sm font-semibold text-white transition-colors duration-150 ease-out hover:bg-brand-ink disabled:opacity-80"
    >
      {busy && <Loader2 className="size-4 animate-spin" />}
      {children}
    </button>
  )
}

function Err({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-xs font-medium text-brand-ink">{children}</p>
}

function inputCls(error: boolean | undefined): string {
  return `h-11 w-full rounded-xl bg-card px-3 text-sm outline-none ring-1 transition-shadow duration-150 ease-out placeholder:text-faint focus:ring-2 focus:ring-ink/40 ${error ? 'ring-2 ring-[#b4472f]' : 'ring-line'}`
}
