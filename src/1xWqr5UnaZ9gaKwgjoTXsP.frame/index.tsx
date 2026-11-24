import React, { useState } from 'react'
import { TrendingUp } from 'lucide-react'

import { Shell, type NavKey } from '../shared/seller/Shell'
import { ITEMS, MODULE_REVENUE, DAILY_SALES, formatINR, kindLabel } from '../shared/storefront/data'

type Props = Partial<typeof args> & { onNavigate?: (key: NavKey) => void; onNewItem?: () => void }

export default function Analytics(props: Props) {
  const { range: initialRange, published, onNavigate, onNewItem } = { ...args, ...props }
  const [range, setRange] = useState(initialRange)
  const total = MODULE_REVENUE.reduce((s, m) => s + m.revenue, 0)
  const max = Math.max(...DAILY_SALES)
  const ranked = [...ITEMS].sort((a, b) => b.revenue - a.revenue)

  return (
    <Shell
      active="analytics"
      title="Analytics"
      subtitle="What sells, and where buyers come from."
      published={published}
      onNavigate={onNavigate}
      onNewItem={onNewItem}
      actions={
        <div className="flex rounded-lg bg-surface p-0.5 ring-1 ring-line">
          {['7 days', '30 days', '90 days'].map((r) => (
            <button key={r} onClick={() => setRange(r)} className={`h-8 whitespace-nowrap rounded-md px-3 text-sm transition-colors duration-150 ease-out ${range === r ? 'bg-ink font-medium text-white' : 'text-muted hover:text-ink'}`}>{r}</button>
          ))}
        </div>
      }
    >
      {/* Revenue — primary */}
      <section className="rounded-xl bg-surface p-6 ring-1 ring-line">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted">Revenue</p>
            <p className="mt-1 text-4xl font-semibold tabular-nums tracking-tight">{formatINR(total)}</p>
          </div>
          <p className="flex items-center gap-1 text-sm font-medium text-accent"><TrendingUp className="size-4" /> 32% vs previous period</p>
        </div>
        <div className="mt-6 flex h-40 items-end gap-1.5">
          {DAILY_SALES.map((v, i) => (
            <div key={i} className={`flex-1 rounded-t ${i === DAILY_SALES.length - 1 ? 'bg-accent' : 'bg-accent/25'}`} style={{ height: `${(v / max) * 100}%` }} />
          ))}
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* By module */}
        <section className="rounded-xl bg-surface p-6 ring-1 ring-line">
          <h2 className="text-sm font-semibold">By module</h2>
          <ul className="mt-4 space-y-4">
            {MODULE_REVENUE.map((m) => (
              <li key={m.key}>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{m.label}</span>
                  <span className="tabular-nums">{formatINR(m.revenue)} <span className="text-muted">· {m.orders} orders</span></span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-canvas">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${(m.revenue / MODULE_REVENUE[0].revenue) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Traffic */}
        <section className="rounded-xl bg-surface p-6 ring-1 ring-line">
          <h2 className="text-sm font-semibold">Where buyers came from</h2>
          <dl className="mt-4 divide-y divide-line text-sm">
            {SOURCES.map(([src, visits, orders]) => (
              <div key={src} className="flex items-center justify-between py-2.5">
                <dt>{src}</dt>
                <dd className="tabular-nums text-muted">{visits} visits · <span className="font-medium text-ink">{orders} orders</span></dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      {/* By item */}
      <section className="mt-6 overflow-x-auto rounded-xl bg-surface ring-1 ring-line">
        <h2 className="border-b border-line px-5 py-3.5 text-sm font-semibold">By item</h2>
        <table className="w-full min-w-[620px] text-left text-sm">
          <thead className="text-xs text-muted">
            <tr><th className="px-5 py-2.5 font-medium">Item</th><th className="px-5 py-2.5 font-medium">Module</th><th className="px-5 py-2.5 text-right font-medium">Views</th><th className="px-5 py-2.5 text-right font-medium">Sold</th><th className="px-5 py-2.5 text-right font-medium">Conversion</th><th className="px-5 py-2.5 text-right font-medium">Revenue</th></tr>
          </thead>
          <tbody className="divide-y divide-line">
            {ranked.slice(0, 8).map((i) => (
              <tr key={i.id}>
                <td className="px-5 py-3 font-medium">{i.title}</td>
                <td className="px-5 py-3 text-muted">{kindLabel(i.type)}</td>
                <td className="px-5 py-3 text-right tabular-nums text-muted">{i.views.toLocaleString('en-IN')}</td>
                <td className="px-5 py-3 text-right tabular-nums">{i.sold}</td>
                <td className="px-5 py-3 text-right tabular-nums">{((i.sold / i.views) * 100).toFixed(1)}%</td>
                <td className="px-5 py-3 text-right font-medium tabular-nums">{formatINR(i.revenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </Shell>
  )
}

const SOURCES = [
  ['Instagram bio', '2,840', '58'],
  ['Instagram Stories', '1,120', '31'],
  ['WhatsApp', '640', '22'],
  ['Direct item links', '230', '19'],
  ['Other', '82', '4'],
]

export const args = {
  range: '30 days',
  published: true,
}

export const argTypes = {
  range: { control: 'radio', options: ['7 days', '30 days', '90 days'] },
  published: { control: 'boolean' },
}
