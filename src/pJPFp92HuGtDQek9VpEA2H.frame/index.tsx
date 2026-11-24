import React, { useState } from 'react'
import { Lock, Plus, UploadCloud, RotateCcw, ChevronRight } from 'lucide-react'

import { Shell, type NavKey } from '../shared/seller/Shell'
import { BuyersDrawer } from '../shared/seller/BuyersDrawer'
import { ITEMS, DRAFTS, ORDERS, formatINR } from '../shared/storefront/data'

type Props = Partial<typeof args> & { onNavigate?: (key: NavKey) => void; onNewItem?: () => void }

export default function DigitalProducts(props: Props) {
  const { published, buyersOf, onNavigate, onNewItem } = { ...args, ...props }
  const [drawer, setDrawer] = useState<string | null>(buyersOf === 'none' ? null : buyersOf)
  const items = [...ITEMS, ...DRAFTS].filter((i) => i.type === 'digital')
  const revenue = items.reduce((s, i) => s + i.revenue, 0)
  const purchases = ORDERS.filter((o) => o.type === 'digital')

  return (
    <Shell
      active="digital"
      title="Digital products"
      subtitle={`${items.filter((i) => i.published).length} live · ${formatINR(revenue)} earned · files stay private until payment is confirmed`}
      published={published}
      onNavigate={onNavigate}
      onNewItem={onNewItem}
      actions={
        <button onClick={onNewItem} className="flex h-9 items-center gap-1.5 rounded-lg bg-surface px-3.5 text-sm font-medium ring-1 ring-line hover:bg-canvas">
          <UploadCloud className="size-4" /> Upload file
        </button>
      }
    >
      <div className="overflow-x-auto rounded-xl bg-surface ring-1 ring-line">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-line text-xs text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Protected file</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 text-right font-medium">Buyers</th>
              <th className="px-4 py-3 text-right font-medium">Revenue</th>
              <th className="px-4 py-3 text-right font-medium">Refunds</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {items.map((i) => (
              <tr key={i.id} onClick={() => i.sold && setDrawer(i.id)} className={`transition-colors duration-150 ease-out ${i.sold ? 'cursor-pointer hover:bg-canvas/60' : ''}`}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {i.image ? <img src={i.image} alt="" className="size-10 shrink-0 rounded-lg object-cover" /> : <div className="size-10 shrink-0 rounded-lg bg-canvas" />}
                    <div className="min-w-0">
                      <p className="truncate font-medium">{i.title}</p>
                      <p className="text-xs text-muted">{i.published ? 'On store' : 'Draft · add a file to publish'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {i.file ? (
                    <span className="flex items-center gap-1.5 text-muted"><Lock className="size-3.5 shrink-0" />{i.file}</span>
                  ) : (
                    <button className="flex items-center gap-1.5 font-medium text-accent"><Plus className="size-3.5" /> Add file</button>
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-3 tabular-nums">{formatINR(i.price)}</td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {i.sold ? (
                    <span className="inline-flex items-center gap-0.5 font-medium text-accent">{i.sold}<ChevronRight className="size-3.5" /></span>
                  ) : (
                    <span className="text-faint">0</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right font-medium tabular-nums">{formatINR(i.revenue)}</td>
                <td className="px-4 py-3 text-right tabular-nums text-muted">{i.id === 'zero-course' ? 1 : 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="mt-6 rounded-xl bg-surface ring-1 ring-line">
        <h2 className="border-b border-line px-5 py-3.5 text-sm font-semibold">Recent purchases</h2>
        <ul className="divide-y divide-line">
          {purchases.map((o) => (
            <li key={o.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{o.buyer} <span className="font-normal text-muted">· {o.email}</span></p>
                <p className="truncate text-xs text-muted">{o.item} · {o.detail} · {o.when}</p>
              </div>
              <p className="text-sm font-medium tabular-nums">{formatINR(o.amount)}</p>
              <button className="flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs text-muted hover:bg-canvas hover:text-ink"><RotateCcw className="size-3.5" /> Refund</button>
            </li>
          ))}
        </ul>
      </section>
      <BuyersDrawer itemId={drawer} onClose={() => setDrawer(null)} />
    </Shell>
  )
}

export const args = {
  published: true,
  buyersOf: 'none',
}

export const argTypes = {
  published: { control: 'boolean' },
  buyersOf: { control: 'select', options: ['none', 'sunflower-pattern', 'bunny-pattern', 'zero-course'] },
}
