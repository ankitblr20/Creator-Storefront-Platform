import React, { useState } from 'react'
import { Download, MessageCircle, Search } from 'lucide-react'

import { Shell, type NavKey } from '../shared/seller/Shell'
import { CUSTOMERS, formatINR } from '../shared/storefront/data'

type Props = Partial<typeof args> & { onNavigate?: (key: NavKey) => void; onNewItem?: () => void }

export default function Customers(props: Props) {
  const { published, onNavigate, onNewItem } = { ...args, ...props }
  const [q, setQ] = useState('')
  const rows = CUSTOMERS.filter((c) => (c.name + c.email + c.city).toLowerCase().includes(q.toLowerCase()))
  const repeat = CUSTOMERS.filter((c) => c.orders > 1).length

  return (
    <Shell
      active="customers"
      title="Customers"
      subtitle={`${CUSTOMERS.length} people have bought from you · ${repeat} came back for more`}
      published={published}
      onNavigate={onNavigate}
      onNewItem={onNewItem}
      actions={
        <button className="flex h-9 items-center gap-2 rounded-lg bg-surface px-3.5 text-sm font-medium ring-1 ring-line transition-colors duration-150 ease-out hover:bg-canvas">
          <Download className="size-4" /> Export
        </button>
      }
    >
      <label className="flex h-10 max-w-sm items-center gap-2 rounded-lg bg-surface px-3 ring-1 ring-line focus-within:ring-2 focus-within:ring-accent">
        <Search className="size-4 text-faint" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, email or city" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-faint" />
      </label>

      <div className="mt-4 overflow-x-auto rounded-xl bg-surface ring-1 ring-line">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-line text-xs text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">City</th>
              <th className="px-4 py-3 font-medium">Bought</th>
              <th className="px-4 py-3 text-right font-medium">Orders</th>
              <th className="px-4 py-3 text-right font-medium">Spent</th>
              <th className="px-4 py-3 font-medium">Last order</th>
              <th className="w-12 px-2 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((c) => (
              <tr key={c.email} className="transition-colors duration-150 ease-out hover:bg-canvas/60">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent-soft text-xs font-semibold text-accent-ink">
                      {c.name.split(' ').map((n) => n[0]).join('')}
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium">{c.name}{c.orders > 2 && <span className="ml-2 rounded-full bg-warn-soft px-2 py-0.5 text-[11px] font-medium text-warn">Regular</span>}</p>
                      <p className="truncate text-xs text-muted">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted">{c.city}</td>
                <td className="max-w-[200px] truncate px-4 py-3 text-muted">{c.bought}</td>
                <td className="px-4 py-3 text-right tabular-nums">{c.orders}</td>
                <td className="px-4 py-3 text-right font-medium tabular-nums">{formatINR(c.spent)}</td>
                <td className="whitespace-nowrap px-4 py-3 text-muted">{c.last}</td>
                <td className="px-2 py-3">
                  <button aria-label={`WhatsApp ${c.name}`} className="grid size-8 place-items-center rounded-lg text-muted hover:bg-canvas hover:text-ink">
                    <MessageCircle className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Shell>
  )
}

export const args = {
  published: true,
}

export const argTypes = {
  published: { control: 'boolean' },
}
