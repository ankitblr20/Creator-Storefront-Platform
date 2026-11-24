import React from 'react'
import { ArrowRight, CheckCircle2, Circle, Truck, Megaphone, CalendarDays, TrendingUp } from 'lucide-react'

import { Shell, StatusPill, type NavKey } from '../shared/seller/Shell'
import { STORE, ITEMS, ORDERS, BOOKINGS, DAILY_SALES, formatINR, kindLabel as typeLabel, type ItemType } from '../shared/storefront/data'

type Props = Partial<typeof args> & {
  onConnect?: () => void
  onProfile?: () => void
  onAddItem?: (type?: ItemType) => void
  onNavigate?: (key: NavKey) => void
}

export default function Dashboard(props: Props) {
  const { catalog, razorpay, profile, balance, onConnect, onProfile, onAddItem, onNavigate } = { ...args, ...props }
  const empty = catalog === 'empty'
  /** The public store only exists once something real is published */
  const published = !empty
  const toShip = ORDERS.filter((o) => o.status === 'New' || o.status === 'Packed')
  const revenue = DAILY_SALES.reduce((a, b) => a + b, 0)
  const max = Math.max(...DAILY_SALES)
  const top = [...ITEMS].sort((a, b) => b.revenue - a.revenue).slice(0, 4)

  return (
    <Shell
      active="overview"
      title={empty ? 'Welcome to Riftori, Priya' : 'Good evening, Priya'}
      subtitle={empty ? `${STORE.link} goes live the moment your first item is published.` : 'Here’s what needs you today.'}
      published={published}
      onNavigate={onNavigate}
      onNewItem={() => onAddItem?.()}
    >
      {empty ? (
        <section className="rounded-xl bg-surface ring-1 ring-line">
          <ol className="divide-y divide-line">
            <li className="flex items-center gap-4 px-6 py-4">
              {profile ? <CheckCircle2 className="size-5 shrink-0 text-accent" /> : <Circle className="size-5 shrink-0 text-faint" />}
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-medium ${profile ? 'text-muted' : ''}`}>{profile ? `${STORE.name} · ${STORE.link}` : 'Name your store and pick your link'}</p>
                <p className="text-xs text-faint">{profile ? 'Store name, link and Instagram set' : 'Use your Instagram name — it becomes riftori.com/yourname'}</p>
              </div>
              {profile ? (
                <button onClick={onProfile} className="text-sm font-medium text-accent">Edit</button>
              ) : (
                <button onClick={onProfile} className="h-9 whitespace-nowrap rounded-lg bg-accent px-4 text-sm font-semibold text-white hover:bg-accent-ink">Set up</button>
              )}
            </li>
            <li className="flex items-center gap-4 px-6 py-4">
              {razorpay ? <CheckCircle2 className="size-5 shrink-0 text-accent" /> : <Circle className="size-5 shrink-0 text-faint" />}
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-medium ${razorpay ? 'text-muted' : ''}`}>{razorpay ? 'Razorpay connected' : 'Connect Razorpay'}</p>
                <p className="text-xs text-faint">{razorpay ? 'Payments settle to HDFC ••4410' : 'So buyers can pay by UPI, card or net banking'}</p>
              </div>
              {!razorpay && (
                <button onClick={onConnect} className="h-9 whitespace-nowrap rounded-lg bg-accent px-4 text-sm font-semibold text-white hover:bg-accent-ink">Connect</button>
              )}
            </li>
            <li className="px-6 py-5">
              <div className="flex items-center gap-4">
                <Circle className="size-5 shrink-0 text-faint" />
                <div>
                  <p className="text-sm font-medium">Publish your first item</p>
                  <p className="text-xs text-faint">Your store has no empty shelves — buyers only see what you publish.</p>
                </div>
              </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {TYPES.map((t) => (
              <button
                key={t.type}
                onClick={() => onAddItem?.(t.type)}
                className="flex flex-col items-start rounded-xl bg-surface p-5 text-left ring-1 ring-line transition-shadow duration-150 ease-out hover:ring-2 hover:ring-accent"
              >
                <span className="text-sm font-semibold">{typeLabel(t.type)}</span>
                <span className="mt-1 text-sm text-muted">{t.hint}</span>
              </button>
            ))}
          </div>
            </li>
          </ol>
        </section>
      ) : (
        <>
          {/* Needs you today */}
          <section className="grid gap-3 md:grid-cols-3">
            <Todo icon={Truck} title={`${toShip.length} orders to dispatch`} body="Kavya’s tote is new, Sneha’s kit is packed" cta="Open orders" onClick={() => onNavigate?.('orders')} />
            <Todo icon={CalendarDays} title="2 meetings this week" body="Next: Lakshmi, Tue 6:00 pm" cta="See meetings" onClick={() => onNavigate?.('meetings')} />
            <Todo icon={Megaphone} title="4 seats left Saturday" body="A Story countdown fills these fast" cta="Get the Story kit" onClick={() => onNavigate?.('promote')} />
          </section>

          {/* Sales — the primary panel */}
          <section className="mt-6 grid gap-6 rounded-xl bg-surface p-6 ring-1 ring-line lg:grid-cols-[minmax(0,1fr)_220px]">
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <p className="text-sm text-muted">Sales, last 14 days</p>
                  <p className="mt-1 text-3xl font-semibold tabular-nums tracking-tight">{formatINR(revenue)}</p>
                </div>
                <p className="flex items-center gap-1 text-sm font-medium text-accent"><TrendingUp className="size-4" /> 32% vs previous 14 days</p>
              </div>
              <div className="mt-6 flex h-36 items-end gap-1.5">
                {DAILY_SALES.map((v, i) => (
                  <div key={i} className="group relative flex-1">
                    <div className={`w-full rounded-t ${i === DAILY_SALES.length - 1 ? 'bg-accent' : 'bg-accent/25 group-hover:bg-accent/50'}`} style={{ height: `${(v / max) * 136}px` }} />
                  </div>
                ))}
              </div>
              <div className="mt-2 flex justify-between text-xs text-faint"><span>28 May</span><span>Today</span></div>
            </div>
            <dl className="grid grid-cols-3 gap-4 border-t border-line pt-5 lg:grid-cols-1 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
              <Stat label="Orders" value="86" />
              <Stat label="Store visits" value="4,912" />
              <Stat label="Visit → buy" value="1.8%" />
            </dl>
          </section>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {/* Recent orders */}
            <section className="rounded-xl bg-surface ring-1 ring-line">
              <Header title="Recent orders" cta="All orders" onClick={() => onNavigate?.('orders')} />
              <ul className="divide-y divide-line">
                {ORDERS.slice(0, 5).map((o) => (
                  <li key={o.id} className="flex items-center gap-3 px-5 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{o.buyer}</p>
                      <p className="truncate text-xs text-muted">{o.item}</p>
                    </div>
                    <StatusPill status={o.status} />
                    <p className="w-16 text-right text-sm font-medium tabular-nums">{formatINR(o.amount)}</p>
                  </li>
                ))}
              </ul>
            </section>

            {/* Coming up */}
            <section className="rounded-xl bg-surface ring-1 ring-line">
              <Header title="Coming up" cta="Events" onClick={() => onNavigate?.('events')} />
              <ul className="divide-y divide-line">
                {BOOKINGS.slice(0, 5).map((b) => (
                  <li key={b.id} className="flex items-center gap-4 px-5 py-3">
                    <div className="w-16 shrink-0 text-xs">
                      <p className="font-semibold">{b.day.split(' ').slice(0, 2).join(' ')}</p>
                      <p className="text-muted">{b.time}</p>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{b.title}</p>
                      <p className="truncate text-xs text-muted">{b.who} · {b.where}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Best sellers */}
          <section className="mt-6 rounded-xl bg-surface ring-1 ring-line">
            <Header title="Best sellers" cta="Analytics" onClick={() => onNavigate?.('analytics')} />
            <ul className="divide-y divide-line">
              {top.map((p, i) => (
                <li key={p.id} className="flex items-center gap-4 px-5 py-3 text-sm">
                  <span className="w-4 text-faint tabular-nums">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{p.title}</p>
                    <p className="text-xs text-muted">{typeLabel(p.type)} · {p.sold} sold</p>
                  </div>
                  <p className="font-medium tabular-nums">{formatINR(p.revenue)}</p>
                </li>
              ))}
            </ul>
          </section>

          <p className="mt-6 text-sm text-muted">
            Next Razorpay settlement: <span className="font-semibold text-ink">{formatINR(balance)}</span> on Thu 12 Jun ·{' '}
            <button onClick={() => onNavigate?.('payments')} className="font-medium text-accent hover:text-accent-ink">View payments</button>
          </p>
        </>
      )}
    </Shell>
  )
}

function Todo({ icon: Icon, title, body, cta, onClick }: { icon: typeof Truck; title: string; body: string; cta: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="group flex flex-col rounded-xl bg-surface p-4 text-left ring-1 ring-line transition-shadow duration-150 ease-out hover:ring-2 hover:ring-accent/40">
      <Icon className="size-5 text-accent" strokeWidth={1.75} />
      <p className="mt-3 text-[15px] font-semibold">{title}</p>
      <p className="mt-0.5 text-sm text-muted">{body}</p>
      <p className="mt-auto flex items-center gap-1 pt-3 text-sm font-medium text-accent">
        {cta} <ArrowRight className="size-3.5 transition-transform duration-150 ease-out group-hover:translate-x-0.5" />
      </p>
    </button>
  )
}

function Header({ title, cta, onClick }: { title: string; cta: string; onClick?: () => void }) {
  return (
    <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
      <h2 className="text-sm font-semibold">{title}</h2>
      <button onClick={onClick} className="text-sm font-medium text-accent hover:text-accent-ink">{cta}</button>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-0.5 text-lg font-semibold tabular-nums">{value}</dd>
    </div>
  )
}

const TYPES: { type: ItemType; hint: string }[] = [
  { type: 'event', hint: 'Ticketed workshops, meetups, retreats' },
  { type: 'call', hint: '1:1 sessions on your availability' },
  { type: 'digital', hint: 'Protected PDFs, templates, courses' },
  { type: 'physical', hint: 'Stock, variants and delivery' },
]

export const args = {
  catalog: 'full',
  profile: true,
  razorpay: true,
  balance: 18450,
}

export const argTypes = {
  catalog: { control: 'radio', options: ['full', 'empty'] },
  profile: { control: 'boolean' },
  razorpay: { control: 'boolean' },
  balance: { control: 'number' },
}
