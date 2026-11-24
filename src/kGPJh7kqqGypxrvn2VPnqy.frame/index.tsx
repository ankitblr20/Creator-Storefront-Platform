import React, { useState } from 'react'
import { Video, Clock, CalendarClock, Pencil, Users } from 'lucide-react'

import { Shell, type NavKey } from '../shared/seller/Shell'
import { BuyersDrawer } from '../shared/seller/BuyersDrawer'
import { ITEMS, formatINR } from '../shared/storefront/data'

type Props = Partial<typeof args> & { onNavigate?: (key: NavKey) => void; onNewItem?: () => void }

export default function Meetings(props: Props) {
  const { published, buyersOf, onNavigate, onNewItem } = { ...args, ...props }
  const services = ITEMS.filter((i) => i.type === 'call')
  const [days, setDays] = useState(AVAILABILITY)
  const [drawer, setDrawer] = useState<string | null>(buyersOf === 'none' ? null : buyersOf)

  return (
    <Shell
      active="meetings"
      title="Meetings"
      subtitle="Your 1:1 services, the sessions booked, and when you're free."
      published={published}
      onNavigate={onNavigate}
      onNewItem={onNewItem}
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-6">
          {/* Booked sessions */}
          <section className="rounded-xl bg-surface ring-1 ring-line">
            <h2 className="border-b border-line px-5 py-3.5 text-sm font-semibold">Booked sessions</h2>
            <ul className="divide-y divide-line">
              {SESSIONS.map((s) => (
                <li key={s.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3.5">
                  <div className="w-28 shrink-0">
                    <p className="text-sm font-semibold">{s.day}</p>
                    <p className="text-xs text-muted">{s.time}</p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{s.who}</p>
                    <p className="truncate text-xs text-muted">{s.service} · {s.paid}</p>
                  </div>
                  {s.soon ? (
                    <button className="flex h-8 items-center gap-1.5 rounded-lg bg-accent px-3 text-xs font-semibold text-white hover:bg-accent-ink"><Video className="size-3.5" /> Join</button>
                  ) : (
                    <button className="h-8 rounded-lg px-3 text-xs font-medium ring-1 ring-line hover:bg-canvas">Reschedule</button>
                  )}
                </li>
              ))}
            </ul>
          </section>

          {/* Services */}
          <section>
            <h2 className="text-sm font-semibold">Your services</h2>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              {services.map((s) => (
                <div key={s.id} className="flex flex-col rounded-xl bg-surface p-4 ring-1 ring-line">
                  <p className="text-sm font-semibold leading-snug">{s.title}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-muted"><Clock className="size-3.5" /> {s.when}</p>
                  <p className="mt-3 text-lg font-semibold tabular-nums">{s.price === 0 ? 'Free' : formatINR(s.price)}</p>
                  <p className="text-xs text-muted">{s.sold} booked · {formatINR(s.revenue)} earned</p>
                  <div className="mt-auto flex items-center gap-4 pt-4 text-sm font-medium">
                    <button onClick={() => setDrawer(s.id)} className="flex items-center gap-1.5 text-accent hover:text-accent-ink"><Users className="size-3.5" /> Who booked</button>
                    <button className="flex items-center gap-1.5 text-muted hover:text-ink"><Pencil className="size-3.5" /> Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Availability */}
        <aside className="self-start rounded-xl bg-surface ring-1 ring-line xl:sticky xl:top-24">
          <div className="border-b border-line px-5 py-3.5">
            <h2 className="flex items-center gap-2 text-sm font-semibold"><CalendarClock className="size-4 text-accent" /> Weekly availability</h2>
            <p className="mt-0.5 text-xs text-muted">Buyers can only pick slots inside these hours.</p>
          </div>
          <ul className="divide-y divide-line">
            {days.map((d, i) => (
              <li key={d.day} className="flex items-center gap-3 px-5 py-3">
                <button
                  role="switch"
                  aria-checked={d.on}
                  aria-label={`${d.day} availability`}
                  onClick={() => setDays((all) => all.map((x, j) => (j === i ? { ...x, on: !x.on } : x)))}
                  className={`relative h-5 w-9 shrink-0 rounded-full transition-colors duration-150 ease-out ${d.on ? 'bg-accent' : 'bg-line'}`}
                >
                  <span className={`absolute top-0.5 size-4 rounded-full bg-white transition-transform duration-150 ease-out ${d.on ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
                </button>
                <span className="w-10 text-sm font-medium">{d.day}</span>
                <span className={`text-sm ${d.on ? '' : 'text-faint'}`}>{d.on ? d.hours : 'Unavailable'}</span>
              </li>
            ))}
          </ul>
          <div className="space-y-1 border-t border-line px-5 py-4 text-sm">
            <p className="flex justify-between"><span className="text-muted">Meeting location</span><span className="font-medium">Google Meet</span></p>
            <p className="flex justify-between"><span className="text-muted">Calendar sync</span><span className="font-medium text-accent">Google Calendar · on</span></p>
            <p className="flex justify-between"><span className="text-muted">Buffer between calls</span><span className="font-medium">15 min</span></p>
            <p className="flex justify-between"><span className="text-muted">Book at least</span><span className="font-medium">12 h ahead</span></p>
          </div>
        </aside>
      </div>
      <BuyersDrawer itemId={drawer} onClose={() => setDrawer(null)} />
    </Shell>
  )
}

const SESSIONS = [
  { id: 's1', day: 'Today', time: '6:00 – 6:15 pm', who: 'Lakshmi Narayan', service: 'Free 15-min intro call', paid: 'Free', soon: true },
  { id: 's2', day: 'Wed 11 Jun', time: '11:00 – 11:30 am', who: 'Rohit Iyer', service: 'Stuck on a pattern? 1:1 call', paid: '₹600 paid', soon: false },
  { id: 's3', day: 'Fri 13 Jun', time: '5:00 – 6:00 pm', who: 'Divya Menon', service: 'Plan your first blanket', paid: '₹1,200 paid', soon: false },
  { id: 's4', day: 'Mon 16 Jun', time: '7:00 – 7:15 pm', who: 'Harsh Vora', service: 'Free 15-min intro call', paid: 'Free', soon: false },
]

const AVAILABILITY = [
  { day: 'Mon', on: true, hours: '7:00 – 9:00 pm' },
  { day: 'Tue', on: true, hours: '6:00 – 8:00 pm' },
  { day: 'Wed', on: true, hours: '11:00 am – 1:00 pm, 7 – 8 pm' },
  { day: 'Thu', on: false, hours: '' },
  { day: 'Fri', on: true, hours: '5:00 – 7:00 pm' },
  { day: 'Sat', on: false, hours: '' },
  { day: 'Sun', on: false, hours: '' },
]

export const args = {
  published: true,
  buyersOf: 'none',
}

export const argTypes = {
  published: { control: 'boolean' },
  buyersOf: { control: 'select', options: ['none', 'intro-call', 'troubleshoot-call', 'project-call'] },
}
