import React, { useState } from 'react'
import { ScanLine, Download, Link2, MapPin, CalendarDays, Check, Eye } from 'lucide-react'

import { Shell, Tabs, type NavKey } from '../shared/seller/Shell'
import { BuyersDrawer } from '../shared/seller/BuyersDrawer'
import { buyersFor } from '../shared/seller/buyers'
import { ITEMS, PAST, EVENT_ATTENDEES, formatINR, kindLabel, moduleOf } from '../shared/storefront/data'

type Props = Partial<typeof args> & { onNavigate?: (key: NavKey) => void; onNewItem?: () => void }

export default function Events(props: Props) {
  const { view: initialView, eventId: initialEvent, published, onNavigate, onNewItem } = { ...args, ...props }
  const [view, setView] = useState<'upcoming' | 'past'>(initialView as 'upcoming' | 'past')
  const [eventId, setEventId] = useState(initialEvent)
  const [checked, setChecked] = useState<Record<string, boolean>>(() => Object.fromEntries(EVENT_ATTENDEES.map((a) => [a.name, a.checkedIn])))
  const events = ITEMS.filter((i) => moduleOf(i.type) === 'events')
  const ev = events.find((e) => e.id === eventId) ?? events[0]
  const sold = (ev.seats ?? 0) - (ev.seatsLeft ?? 0)
  const [drawer, setDrawer] = useState<string | null>(null)
  const attendees =
    ev.id === 'amigurumi-workshop'
      ? EVENT_ATTENDEES
      : buyersFor(ev.id).map((b) => ({ name: b.name, ticket: b.detail, order: b.when, phone: b.phone, checkedIn: false }))
  const inCount = attendees.filter((a) => checked[a.name]).length

  return (
    <Shell
      active="events"
      title="Events"
      subtitle="Tickets, attendees and check-in for everything with a date."
      published={published}
      onNavigate={onNavigate}
      onNewItem={onNewItem}
    >
      <Tabs<'upcoming' | 'past'>
        value={view}
        onChange={setView}
        options={[
          { key: 'upcoming', label: 'Upcoming', count: events.length },
          { key: 'past', label: 'Past events', count: PAST.length },
        ]}
      />

      {view === 'past' ? (
        <section className="mt-5">
          <p className="text-sm text-muted">Past events stay on your store as proof of what you've run. Buyers see the photo, date and outcome.</p>
          <ul className="mt-4 divide-y divide-line rounded-xl bg-surface ring-1 ring-line">
            {PAST.map((p) => (
              <li key={p.id} className="flex items-center gap-4 px-5 py-4">
                <img src={p.image} alt="" className="size-14 shrink-0 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{p.title}</p>
                  <p className="text-sm text-muted">{p.when} · {p.outcome}</p>
                </div>
                <span className="hidden items-center gap-1.5 text-sm text-muted sm:flex"><Eye className="size-4" /> Shown on store</span>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <div className="mt-5 grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
          {/* Event list */}
          <ul className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {events.map((e) => {
              const pct = e.seats ? ((e.seats - (e.seatsLeft ?? 0)) / e.seats) * 100 : 0
              return (
                <li key={e.id} className="w-64 shrink-0 lg:w-auto">
                  <button
                    onClick={() => setEventId(e.id)}
                    className={`w-full rounded-xl bg-surface p-4 text-left ring-1 transition-shadow duration-150 ease-out ${eventId === e.id ? 'ring-2 ring-accent' : 'ring-line hover:ring-ink/20'}`}
                  >
                    <p className="text-xs text-muted">{kindLabel(e.type)} · {e.when}</p>
                    <p className="mt-0.5 truncate text-sm font-semibold">{e.title}</p>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-canvas">
                      <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="mt-1.5 text-xs text-muted">{e.seats ? `${e.seats - (e.seatsLeft ?? 0)} of ${e.seats} sold` : 'Unlimited'}</p>
                  </button>
                </li>
              )
            })}
          </ul>

          {/* Selected event */}
          <div className="min-w-0 space-y-6">
            <section className="rounded-xl bg-surface p-6 ring-1 ring-line">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-xl font-semibold tracking-tight">{ev.title}</h2>
                  <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
                    <span className="flex items-center gap-1.5"><CalendarDays className="size-4" />{ev.when}</span>
                    {ev.location && <span className="flex items-center gap-1.5"><MapPin className="size-4" />{ev.location}</span>}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium ring-1 ring-line hover:bg-canvas"><Link2 className="size-4" /> Copy event link</button>
                  <button className="flex h-9 items-center gap-1.5 rounded-lg bg-accent px-3.5 text-sm font-semibold text-white transition-colors duration-150 ease-out hover:bg-accent-ink"><ScanLine className="size-4" /> Scan tickets</button>
                </div>
              </div>
              <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-line pt-5">
                <div><dt className="text-xs text-muted">Tickets sold</dt><dd className="mt-0.5 text-2xl font-semibold tabular-nums">{sold}<span className="text-base font-normal text-muted">/{ev.seats ?? '∞'}</span></dd></div>
                <div><dt className="text-xs text-muted">Revenue</dt><dd className="mt-0.5 text-2xl font-semibold tabular-nums">{formatINR(ev.revenue)}</dd></div>
                <div><dt className="text-xs text-muted">Checked in</dt><dd className="mt-0.5 text-2xl font-semibold tabular-nums">{inCount}<span className="text-base font-normal text-muted">/{attendees.length}</span></dd></div>
              </dl>
            </section>

            {ev.tickets && (
              <section className="overflow-x-auto rounded-xl bg-surface ring-1 ring-line">
                <h3 className="border-b border-line px-5 py-3.5 text-sm font-semibold">Ticket types</h3>
                <table className="w-full min-w-[440px] text-left text-sm">
                  <thead className="text-xs text-muted"><tr><th className="px-5 py-2.5 font-medium">Type</th><th className="px-5 py-2.5 font-medium">Price</th><th className="px-5 py-2.5 font-medium">Left</th><th className="px-5 py-2.5 font-medium">Note</th></tr></thead>
                  <tbody className="divide-y divide-line">
                    {ev.tickets.map((t) => (
                      <tr key={t.name}>
                        <td className="px-5 py-3 font-medium">{t.name}</td>
                        <td className="px-5 py-3 tabular-nums">{formatINR(t.price)}</td>
                        <td className={`px-5 py-3 tabular-nums ${t.left === 0 ? 'text-faint' : t.left <= 4 ? 'font-medium text-warn' : ''}`}>{t.left === 0 ? 'Closed' : t.left}</td>
                        <td className="px-5 py-3 text-muted">{t.note ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}

            <section className="rounded-xl bg-surface ring-1 ring-line">
              <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
                <h3 className="text-sm font-semibold">Who bought <span className="font-normal text-muted">· {attendees.length}</span></h3>
                <div className="flex items-center gap-4">
                  <button onClick={() => setDrawer(ev.id)} className="text-sm font-medium text-accent hover:text-accent-ink">Buyer details</button>
                  <button className="flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink"><Download className="size-4" /> Export</button>
                </div>
              </div>
              {attendees.length ? (
                <ul className="divide-y divide-line">
                  {attendees.map((a) => (
                    <li key={a.name} className="flex items-center gap-4 px-5 py-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{a.name}</p>
                        <p className="truncate text-xs text-muted">{a.ticket} · {a.order} · {a.phone}</p>
                      </div>
                      <button
                        onClick={() => setChecked((c) => ({ ...c, [a.name]: !c[a.name] }))}
                        className={`flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-colors duration-150 ease-out ${
                          checked[a.name] ? 'bg-accent text-white' : 'ring-1 ring-line hover:bg-canvas'
                        }`}
                      >
                        {checked[a.name] ? <><Check className="size-3.5" /> Checked in</> : 'Check in'}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-5 py-8 text-center text-sm text-muted">No tickets sold yet. Buyers appear here the moment they pay.</p>
              )}
            </section>
          </div>
        </div>
      )}
      <BuyersDrawer itemId={drawer} onClose={() => setDrawer(null)} />
    </Shell>
  )
}

export const args = {
  view: 'upcoming',
  eventId: 'amigurumi-workshop',
  published: true,
}

export const argTypes = {
  view: { control: 'radio', options: ['upcoming', 'past'] },
  eventId: { control: 'select', options: ['amigurumi-workshop', 'pune-meetup', 'crochet-circle', 'kids-class', 'coorg-retreat-2'] },
  published: { control: 'boolean' },
}
