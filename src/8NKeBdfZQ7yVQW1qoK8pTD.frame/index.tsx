import React, { useState } from 'react'
import { Download, Mail, MessageCircle, X, RotateCcw, Check, MapPin, StickyNote } from 'lucide-react'

import { Shell, Tabs, StatusPill, type NavKey } from '../shared/seller/Shell'
import { ORDERS, FULFILMENT, formatINR, kindLabel, type OrderStatus } from '../shared/storefront/data'

type Filter = 'all' | 'fulfil' | 'transit' | 'upcoming' | 'done'
type Order = (typeof ORDERS)[number]

type Props = Partial<typeof args> & { onNavigate?: (key: NavKey) => void; onNewItem?: () => void }

export default function Orders(props: Props) {
  const { filter: initialFilter, selected: initialSelected, published, onNavigate, onNewItem } = { ...args, ...props }
  const [filter, setFilter] = useState<Filter>(initialFilter as Filter)
  const [selected, setSelected] = useState<string | null>(initialSelected || null)
  const [overrides, setOverrides] = useState<Record<string, { status?: OrderStatus; tracking?: string }>>({})
  const [trackingDraft, setTrackingDraft] = useState('')

  const status = (o: Order): OrderStatus => overrides[o.id]?.status ?? o.status
  const tracking = (o: Order) => overrides[o.id]?.tracking ?? o.tracking
  const update = (id: string, patch: { status?: OrderStatus; tracking?: string }) =>
    setOverrides((s) => ({ ...s, [id]: { ...s[id], ...patch } }))

  const inFilter = (s: OrderStatus) =>
    filter === 'all' ? true
    : filter === 'fulfil' ? s === 'New' || s === 'Packed'
    : filter === 'transit' ? s === 'Dispatched'
    : filter === 'upcoming' ? s === 'Upcoming'
    : s === 'Delivered' || s === 'Completed' || s === 'Checked in' || s === 'Refunded'
  const rows = ORDERS.filter((o) => inFilter(status(o)))
  const order = ORDERS.find((o) => o.id === selected)
  const count = (f: (s: OrderStatus) => boolean) => ORDERS.filter((o) => f(status(o))).length

  return (
    <Shell
      active="orders"
      title="Orders"
      subtitle="Every ticket, booking, download and parcel in one list."
      published={published}
      onNavigate={onNavigate}
      onNewItem={onNewItem}
      actions={
        <button className="flex h-9 items-center gap-2 rounded-lg bg-surface px-3.5 text-sm font-medium ring-1 ring-line transition-colors duration-150 ease-out hover:bg-canvas">
          <Download className="size-4" /> Export CSV
        </button>
      }
    >
      <Tabs<Filter>
        value={filter}
        onChange={setFilter}
        options={[
          { key: 'all', label: 'All', count: ORDERS.length },
          { key: 'fulfil', label: 'To fulfil', count: count((s) => s === 'New' || s === 'Packed') },
          { key: 'transit', label: 'In transit', count: count((s) => s === 'Dispatched') },
          { key: 'upcoming', label: 'Upcoming bookings', count: count((s) => s === 'Upcoming') },
          { key: 'done', label: 'Completed' },
        ]}
      />

      <div className={`mt-4 grid gap-6 ${order ? 'xl:grid-cols-[minmax(0,1fr)_380px]' : ''}`}>
        <div className="min-w-0 overflow-x-auto rounded-xl bg-surface ring-1 ring-line">
          <table className="w-full min-w-[660px] text-left text-sm">
            <thead className="border-b border-line text-xs text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Item</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((o) => (
                <tr
                  key={o.id}
                  onClick={() => { setSelected(o.id); setTrackingDraft('') }}
                  className={`cursor-pointer transition-colors duration-150 ease-out ${selected === o.id ? 'bg-accent-soft/50' : 'hover:bg-canvas/70'}`}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium tabular-nums">{o.id}</p>
                    <p className="text-xs text-muted">{o.when}</p>
                  </td>
                  <td className="px-4 py-3 font-medium">{o.buyer}</td>
                  <td className="max-w-[240px] px-4 py-3">
                    <p className="truncate">{o.item}</p>
                    <p className="truncate text-xs text-muted">{kindLabel(o.type)} · {o.detail}</p>
                  </td>
                  <td className="px-4 py-3"><StatusPill status={status(o)} /></td>
                  <td className="px-4 py-3 text-right font-medium tabular-nums">{o.amount === 0 ? 'Free' : formatINR(o.amount)}</td>
                </tr>
              ))}
              {!rows.length && (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-muted">Nothing here — you’re all caught up.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {order && (
          <aside className="self-start rounded-xl bg-surface ring-1 ring-line xl:sticky xl:top-24">
            <div className="flex items-start justify-between border-b border-line px-5 py-4">
              <div className="min-w-0">
                <p className="text-xs text-muted">{order.id} · {order.when} · {kindLabel(order.type)}</p>
                <h2 className="mt-0.5 text-base font-semibold">{order.item}</h2>
                <p className="text-sm text-muted">{order.detail}</p>
              </div>
              <button aria-label="Close" onClick={() => setSelected(null)} className="grid size-8 shrink-0 place-items-center rounded-lg text-muted hover:bg-canvas"><X className="size-4" /></button>
            </div>

            {/* Physical fulfilment */}
            {order.type === 'physical' && status(order) !== 'Refunded' && (
              <div className="border-b border-line px-5 py-4">
                <ol className="grid grid-cols-4 gap-1">
                  {FULFILMENT.map((s) => {
                    const reached = FULFILMENT.indexOf(s) <= FULFILMENT.indexOf(status(order) as (typeof FULFILMENT)[number])
                    return (
                      <li key={s}>
                        <div className={`h-1.5 rounded-full ${reached ? 'bg-accent' : 'bg-canvas'}`} />
                        <p className={`mt-1.5 text-[11px] ${status(order) === s ? 'font-semibold text-ink' : reached ? 'text-muted' : 'text-faint'}`}>{s}</p>
                      </li>
                    )
                  })}
                </ol>
                {status(order) === 'New' && (
                  <button onClick={() => update(order.id, { status: 'Packed' })} className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-accent text-sm font-semibold text-white hover:bg-accent-ink">
                    <Check className="size-4" /> Mark as packed
                  </button>
                )}
                {status(order) === 'Packed' && (
                  <div className="mt-4 flex gap-2">
                    <input value={trackingDraft} onChange={(e) => setTrackingDraft(e.target.value)} placeholder="Courier + tracking no." className="h-10 min-w-0 flex-1 rounded-lg px-3 text-sm ring-1 ring-line outline-none focus:ring-2 focus:ring-accent" />
                    <button
                      disabled={!trackingDraft.trim()}
                      onClick={() => update(order.id, { status: 'Dispatched', tracking: trackingDraft })}
                      className="h-10 whitespace-nowrap rounded-lg bg-accent px-4 text-sm font-semibold text-white hover:bg-accent-ink disabled:opacity-40"
                    >
                      Dispatch
                    </button>
                  </div>
                )}
                {status(order) === 'Dispatched' && (
                  <div className="mt-4">
                    <p className="text-sm"><span className="text-muted">Tracking:</span> <span className="font-medium">{tracking(order)}</span></p>
                    <button onClick={() => update(order.id, { status: 'Delivered' })} className="mt-3 h-10 w-full rounded-lg text-sm font-semibold ring-1 ring-line hover:bg-canvas">Mark as delivered</button>
                  </div>
                )}
              </div>
            )}

            <dl className="space-y-3 px-5 py-4 text-sm">
              <Line label="Customer" value={order.buyer} />
              <Line label="Email" value={order.email} />
              {order.phone && <Line label="Phone" value={order.phone} />}
              <Line label="Paid" value={order.amount === 0 ? 'Free' : `${formatINR(order.amount)} · Razorpay`} />
              {order.address && (
                <div className="flex gap-2.5 rounded-lg bg-canvas p-3"><MapPin className="mt-0.5 size-4 shrink-0 text-faint" /><p>{order.address}</p></div>
              )}
              {order.note && (
                <div className="flex gap-2.5 rounded-lg bg-warn-soft p-3"><StickyNote className="mt-0.5 size-4 shrink-0 text-warn" /><p>{order.note}</p></div>
              )}
              <div className="flex items-center justify-between"><dt className="text-muted">Status</dt><dd><StatusPill status={status(order)} /></dd></div>
            </dl>

            <div className="space-y-2 border-t border-line px-5 py-4">
              <div className="grid grid-cols-2 gap-2">
                <button className="flex h-9 items-center justify-center gap-1.5 rounded-lg text-sm font-medium ring-1 ring-line hover:bg-canvas"><MessageCircle className="size-4" /> WhatsApp</button>
                <button className="flex h-9 items-center justify-center gap-1.5 rounded-lg text-sm font-medium ring-1 ring-line hover:bg-canvas"><Mail className="size-4" /> Resend receipt</button>
              </div>
              {status(order) !== 'Refunded' && order.amount > 0 && (
                <button onClick={() => update(order.id, { status: 'Refunded' })} className="flex h-9 w-full items-center justify-center gap-1.5 rounded-lg text-sm text-muted hover:bg-canvas hover:text-ink">
                  <RotateCcw className="size-4" /> Refund {formatINR(order.amount)}
                </button>
              )}
            </div>
          </aside>
        )}
      </div>
    </Shell>
  )
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="shrink-0 text-muted">{label}</dt>
      <dd className="min-w-0 break-words text-right font-medium">{value}</dd>
    </div>
  )
}

export const args = {
  filter: 'all',
  selected: 'SF-2486',
  published: true,
}

export const argTypes = {
  filter: { control: 'radio', options: ['all', 'fulfil', 'transit', 'upcoming', 'done'] },
  selected: { control: 'select', options: ['', 'SF-2486', 'SF-2482', 'SF-2479', 'SF-2485', 'SF-2484'] },
  published: { control: 'boolean' },
}
