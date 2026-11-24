import React, { useState } from 'react'
import {
  CalendarDays, MapPin, Users, Package, Clock, Check, Minus, Plus, Truck, Download, Lock, Video, RotateCcw, ChevronRight, Repeat, ShieldCheck,
} from 'lucide-react'

import { TopBar } from '../shared/buyer/TopBar'
import { ItemImage, ProductCard } from '../shared/buyer/ProductCard'
import { ContactButtons, channelsFor } from '../shared/buyer/Contact'
import { AgentScope } from '../shared/buyer/ShopAgent'
import { ITEMS, STORE, findItem, formatINR, typeLabel, isBookable, type BagLine, type Item } from '../shared/storefront/data'

type Props = Partial<typeof args> & {
  onBack?: () => void
  onBag?: () => void
  onOpen?: (id: string) => void
  onAddToBag?: (line: BagLine) => void
  onBuyNow?: (line: BagLine) => void
  onBook?: (id: string) => void
  onAbout?: () => void
}

export default function ProductDetail(props: Props) {
  const { itemId, bagCount, added, contact, agentOpen, wallet, onBack, onBag, onOpen, onAddToBag, onBuyNow, onBook, onAbout } = { ...args, ...props }
  const item = findItem(itemId)
  const bookable = isBookable(item.type)
  const [option, setOption] = useState(item.options?.[0])
  const [qty, setQty] = useState(1)
  const [justAdded, setJustAdded] = useState(added)
  const maxQty = item.stock ?? 5
  const related = ITEMS.filter((i) => i.type === item.type && i.id !== item.id)
    .concat(ITEMS.filter((i) => i.type !== item.type && i.id !== item.id))
    .slice(0, 4)
  const fromPrice = item.tickets ? Math.min(...item.tickets.filter((t) => t.left > 0).map((t) => t.price)) : item.price

  return (
    /* App shell: the page scrolls in the middle, the buy bar is its own row and never covers content */
    <AgentScope signedIn={wallet === 'signed in'} startOpen={agentOpen}>
    <div className="flex h-screen flex-col bg-paper">
      <TopBar bagCount={bagCount} onBack={onBack} onBag={onBag} agentItemId={item.id} />

      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl lg:grid lg:grid-cols-2 lg:gap-10 lg:px-4 lg:pt-6">
          <div className="aspect-[4/3] overflow-hidden bg-brand-soft lg:sticky lg:top-6 lg:aspect-square lg:self-start lg:rounded-2xl">
            <ItemImage item={item} />
          </div>

          <div className="px-4 pb-8 pt-5 lg:px-0">
            {/* Title block */}
            <p className="text-xs font-semibold text-brand">{typeLabel(item.type)}</p>
            <h1 className="mt-1 font-display text-[26px] font-semibold leading-tight tracking-tight">{item.title}</h1>
            <p className="mt-2 text-xl font-semibold">
              {item.price === 0 ? 'Free' : item.tickets ? `From ${formatINR(fromPrice)}` : formatINR(item.price)}
              {item.compareAt && !item.tickets && <span className="ml-2 text-sm font-normal text-faint line-through">{formatINR(item.compareAt)}</span>}
            </p>
            <p className="mt-1 text-[15px] text-muted">{item.description}</p>

            {/* Key facts */}
            <dl className="mt-5 divide-y divide-line rounded-2xl bg-card text-sm ring-1 ring-line">
              {facts(item).map((f) => (
                <div key={f.label} className="flex items-start gap-3 px-4 py-3">
                  <f.icon className="mt-0.5 size-4 shrink-0 text-faint" />
                  <dt className="w-20 shrink-0 text-muted">{f.label}</dt>
                  <dd className={`min-w-0 flex-1 ${f.strong ? 'font-semibold text-brand-ink' : 'font-medium'}`}>{f.value}</dd>
                </div>
              ))}
            </dl>

            {/* Choices the buyer makes here */}
            {item.options && (
              <Section title="Choose a variant">
                <div className="flex flex-wrap gap-2">
                  {item.options.map((o) => (
                    <button
                      key={o}
                      onClick={() => setOption(o)}
                      className={`h-10 rounded-full px-4 text-sm font-medium transition-colors duration-150 ease-out ${
                        option === o ? 'bg-ink text-white' : 'bg-card ring-1 ring-line hover:ring-ink/40'
                      }`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </Section>
            )}

            {item.tickets && (
              <Section title="Tickets">
                <ul className="divide-y divide-line rounded-2xl bg-card ring-1 ring-line">
                  {item.tickets.map((t) => (
                    <li key={t.name} className={`flex items-center justify-between gap-3 px-4 py-3 ${t.left === 0 ? 'text-faint' : ''}`}>
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{t.name}</p>
                        <p className="text-xs text-muted">{t.left === 0 ? (t.note ?? 'Sold out') : `${t.left} left${t.note ? ` · ${t.note}` : ''}`}</p>
                      </div>
                      <p className="shrink-0 text-sm font-semibold tabular-nums">{formatINR(t.price)}</p>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {item.slots && (
              <Section title="Free slots this week">
                <div className="grid grid-cols-3 gap-2">
                  {item.slots.flatMap((d) => d.times.filter((t) => !t.taken).map((t) => ({ day: d.day, time: t.time }))).slice(0, 6).map((s) => (
                    <button
                      key={s.day + s.time}
                      onClick={() => onBook?.(item.id)}
                      className="rounded-xl bg-card px-2 py-2 text-center ring-1 ring-line transition-shadow duration-150 ease-out hover:ring-brand"
                    >
                      <span className="block text-xs text-muted">{s.day} Jun</span>
                      <span className="block text-sm font-semibold">{s.time}</span>
                    </button>
                  ))}
                </div>
              </Section>
            )}

            {/* About */}
            <Section title="About">
              <p className="text-[15px] leading-relaxed text-ink/85">{item.details}</p>
              {item.includes && (
                <ul className="mt-4 space-y-2 text-sm">
                  {item.includes.map((x) => (
                    <li key={x} className="flex gap-2.5">
                      <Check className="mt-0.5 size-4 shrink-0 text-ok" /> {x}
                    </li>
                  ))}
                </ul>
              )}
            </Section>

            {/* How it works, for this kind of item */}
            <Section title="How it works">
              <ol className="space-y-3">
                {STEPS[item.type].map((s, i) => (
                  <li key={s} className="flex gap-3 text-sm">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-soft text-xs font-semibold text-brand-ink">{i + 1}</span>
                    <span className="pt-0.5">{s}</span>
                  </li>
                ))}
              </ol>
            </Section>

            {/* Policy */}
            <Section title="Good to know">
              <p className="flex gap-2.5 text-sm text-muted">
                <RotateCcw className="mt-0.5 size-4 shrink-0 text-faint" /> {POLICY[item.type]}
              </p>
              <p className="mt-2 flex gap-2.5 text-sm text-muted">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-faint" /> Paid securely by UPI, card or net banking, straight to {STORE.name}.
              </p>
            </Section>

            {/* Seller */}
            <div className="mt-8 rounded-2xl bg-card p-4 ring-1 ring-line">
              <button onClick={onAbout} className="flex w-full items-center gap-3 text-left">
                <img src={STORE.avatar} alt="" className="size-11 shrink-0 rounded-full object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{STORE.name}</p>
                  <p className="truncate text-xs text-muted">@{STORE.handle} · usually replies within a few hours</p>
                </div>
                <ChevronRight className="size-4 shrink-0 text-faint" />
              </button>
              <div className="mt-3 flex flex-wrap gap-2 border-t border-line pt-3">
                <span className="self-center text-sm text-muted">Have a question?</span>
                <ContactButtons channels={channelsFor(contact)} />
              </div>
            </div>
          </div>
        </div>

        <section className="mx-auto max-w-5xl pb-8 pt-2 lg:pt-10">
          <h2 className="px-4 text-lg font-semibold tracking-tight">You might also like</h2>
          <div className="mt-3 flex gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] lg:grid lg:grid-cols-4">
            {related.map((r) => (
              <ProductCard key={r.id} item={r} onOpen={onOpen} className="w-[42%] shrink-0 sm:w-[30%] lg:w-auto" />
            ))}
          </div>
        </section>
      </main>

      {/* Buy bar — its own row, never on top of content */}
      <footer className="shrink-0 border-t border-line bg-paper px-4 pb-5 pt-3">
        <div className="mx-auto flex max-w-5xl items-center gap-3 lg:justify-end">
          {bookable ? (
            <>
              <div className="min-w-0 lg:text-right">
                <p className="text-xs text-muted">{item.tickets ? 'Tickets from' : 'Price'}</p>
                <p className="text-lg font-semibold tabular-nums">{item.price === 0 ? 'Free' : formatINR(fromPrice)}</p>
              </div>
              <button
                onClick={() => onBook?.(item.id)}
                className="h-12 flex-1 rounded-full bg-brand px-6 text-[15px] font-semibold text-white transition-[background-color,transform] duration-150 ease-out hover:bg-brand-ink active:scale-[0.98] lg:w-72 lg:flex-none"
              >
                {item.type === 'call' ? 'Choose a time' : item.tickets ? 'Get tickets' : item.type === 'activity' ? 'Book a class' : 'Book a seat'}
              </button>
            </>
          ) : (
            <div className="flex w-full gap-2 lg:w-[460px]">
              {item.type === 'physical' && (
                <div className="flex shrink-0 items-center rounded-full bg-card ring-1 ring-line">
                  <button aria-label="Fewer" disabled={qty <= 1} onClick={() => setQty((q) => q - 1)} className="grid size-11 place-items-center disabled:text-faint">
                    <Minus className="size-4" />
                  </button>
                  <span className="w-5 text-center font-semibold tabular-nums">{qty}</span>
                  <button aria-label="More" disabled={qty >= maxQty} onClick={() => setQty((q) => q + 1)} className="grid size-11 place-items-center disabled:text-faint">
                    <Plus className="size-4" />
                  </button>
                </div>
              )}
              {justAdded ? (
                <button onClick={onBag} className="flex h-12 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-ink text-sm font-semibold text-white">
                  <Check className="size-4" /> View bag ({bagCount})
                </button>
              ) : (
                <button
                  onClick={() => {
                    onAddToBag?.({ id: item.id, qty, option })
                    setJustAdded(true)
                  }}
                  className="h-12 flex-1 whitespace-nowrap rounded-full bg-brand-soft text-sm font-semibold text-brand-ink transition-[background-color,transform] duration-150 ease-out hover:bg-[#f0d4c8] active:scale-[0.98]"
                >
                  Add to bag
                </button>
              )}
              <button
                onClick={() => onBuyNow?.({ id: item.id, qty, option })}
                className="h-12 flex-1 whitespace-nowrap rounded-full bg-brand text-sm font-semibold text-white transition-[background-color,transform] duration-150 ease-out hover:bg-brand-ink active:scale-[0.98]"
              >
                Buy · {formatINR(item.price * qty)}
              </button>
            </div>
          )}
        </div>
      </footer>

    </div>
    </AgentScope>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="mb-3 text-base font-semibold">{title}</h2>
      {children}
    </section>
  )
}

/** The facts that matter for each kind of item, in the order a buyer asks them */
function facts(item: Item): { icon: typeof Clock; label: string; value: string; strong?: boolean }[] {
  const out: { icon: typeof Clock; label: string; value: string; strong?: boolean }[] = []
  switch (item.type) {
    case 'event':
    case 'experience':
      out.push({ icon: CalendarDays, label: 'When', value: item.when })
      if (item.location) out.push({ icon: MapPin, label: 'Where', value: item.location })
      if (item.seatsLeft !== undefined) out.push({ icon: Users, label: 'Seats', value: `${item.seatsLeft} of ${item.seats} left`, strong: item.seatsLeft <= 4 })
      if (item.earlyBirdUntil) out.push({ icon: Clock, label: 'Early bird', value: `Ends ${item.earlyBirdUntil}`, strong: true })
      break
    case 'activity':
      out.push({ icon: Repeat, label: 'Schedule', value: item.when })
      if (item.location) out.push({ icon: MapPin, label: 'Where', value: item.location })
      if (item.seatsLeft !== undefined) out.push({ icon: Users, label: 'Next class', value: `${item.seatsLeft} of ${item.seats} seats left`, strong: item.seatsLeft <= 4 })
      break
    case 'call':
      out.push({ icon: Clock, label: 'Length', value: item.when.split(' · ')[0] })
      out.push({ icon: Video, label: 'Where', value: 'Google Meet — link sent on booking' })
      out.push({ icon: CalendarDays, label: 'Next slot', value: 'Tue 10 Jun, 6:00 pm' })
      break
    case 'digital':
      if (item.file) out.push({ icon: Lock, label: 'File', value: item.file })
      out.push({ icon: Download, label: 'Delivery', value: 'Instant secure download after payment' })
      break
    case 'physical':
      if (item.stock !== undefined) out.push({ icon: Package, label: 'Stock', value: item.stock <= 4 ? `Only ${item.stock} left` : `${item.stock} in stock`, strong: item.stock <= 4 })
      if (item.dispatch) out.push({ icon: Truck, label: 'Dispatch', value: item.dispatch })
      out.push({ icon: MapPin, label: 'Delivery', value: 'Tracked, across India · ₹80, free above ₹1,500' })
      break
  }
  return out
}

const STEPS: Record<Item['type'], string[]> = {
  event: ['Pick a ticket type and how many', 'Pay by UPI or card', 'Get a QR ticket by email — show it at the door'],
  experience: ['Pick a room type', 'Pay by UPI or card', 'Get your booking and packing list by email'],
  activity: ['Pick the class and how many seats', 'Pay by UPI or card', 'Get the joining details by email'],
  call: ['Pick a time that suits you', 'Pay (or confirm, if it’s free)', 'Get a Google Meet link and calendar invite'],
  digital: ['Pay by UPI or card', 'Download instantly from the confirmation page', 'The link is also emailed to you'],
  physical: ['Choose a variant and quantity', 'Add your address and an optional note', 'Track it from packed to delivered'],
}

const POLICY: Record<Item['type'], string> = {
  event: 'Full refund up to 48 hours before the event. After that, tickets can be passed to a friend.',
  experience: '50% refund up to 14 days before. Rooms can be transferred to someone else.',
  activity: 'Can’t make it? Move your seat to next week, up to 6 hours before class.',
  call: 'Reschedule free up to 12 hours before. No-shows aren’t refunded.',
  digital: 'Digital files can’t be returned, but message the seller if a file won’t open.',
  physical: 'Returns within 7 days if it arrives damaged — just send the seller a photo.',
}

export const args = {
  itemId: 'pune-meetup',
  bagCount: 0,
  added: false,
  contact: 'instagram only',
  agentOpen: false,
  wallet: 'guest',
}

export const argTypes = {
  itemId: {
    control: 'select',
    options: ['amigurumi-workshop', 'pune-meetup', 'coorg-retreat-2', 'crochet-circle', 'troubleshoot-call', 'intro-call', 'sunflower-pattern', 'zero-course', 'beginner-kit', 'market-tote', 'bunny-plush'],
  },
  bagCount: { control: 'number' },
  added: { control: 'boolean' },
  contact: { control: 'radio', options: ['instagram only', 'instagram + email', 'whatsapp + instagram'] },
  agentOpen: { control: 'boolean' },
  wallet: { control: 'radio', options: ['signed in', 'guest'] },
}
