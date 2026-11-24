import React, { useState } from 'react'
import { ArrowRight, Truck, ChevronRight } from 'lucide-react'

import { Shell, type NavKey } from '../shared/seller/Shell'
import { BuyersDrawer } from '../shared/seller/BuyersDrawer'
import { ITEMS, ORDERS, FULFILMENT, formatINR } from '../shared/storefront/data'

type Props = Partial<typeof args> & { onNavigate?: (key: NavKey) => void; onNewItem?: () => void }

export default function PhysicalProducts(props: Props) {
  const { published, buyersOf, onNavigate, onNewItem } = { ...args, ...props }
  const [drawer, setDrawer] = useState<string | null>(buyersOf === 'none' ? null : buyersOf)
  const items = ITEMS.filter((i) => i.type === 'physical')
  const physicalOrders = ORDERS.filter((o) => o.type === 'physical')

  return (
    <Shell
      active="physical"
      title="Physical products"
      subtitle="Stock, variants and dispatch for everything you ship."
      published={published}
      onNavigate={onNavigate}
      onNewItem={onNewItem}
    >
      {/* Fulfilment at a glance */}
      <section className="grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-line ring-1 ring-line sm:grid-cols-4">
        {FULFILMENT.map((stage) => {
          const n = physicalOrders.filter((o) => o.status === stage).length
          return (
            <button key={stage} onClick={() => onNavigate?.('orders')} className="group bg-surface p-4 text-left transition-colors duration-150 ease-out hover:bg-canvas">
              <p className="text-xs text-muted">{stage}</p>
              <p className={`mt-1 text-2xl font-semibold tabular-nums ${stage === 'New' && n ? 'text-warn' : ''}`}>{n}</p>
            </button>
          )
        })}
      </section>
      <button onClick={() => onNavigate?.('orders')} className="mt-2 flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-ink">
        Pack and dispatch in Orders <ArrowRight className="size-3.5" />
      </button>

      <div className="mt-6 overflow-x-auto rounded-xl bg-surface ring-1 ring-line">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="border-b border-line text-xs text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">SKU</th>
              <th className="px-4 py-3 font-medium">Variants</th>
              <th className="px-4 py-3 text-right font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Dispatch</th>
              <th className="px-4 py-3 text-right font-medium">Price</th>
              <th className="px-4 py-3 text-right font-medium">Buyers</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {items.map((i) => {
              const low = (i.stock ?? 99) <= 5
              return (
                <tr key={i.id} onClick={() => setDrawer(i.id)} className="cursor-pointer transition-colors duration-150 ease-out hover:bg-canvas/60">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={i.image} alt="" className="size-10 shrink-0 rounded-lg object-cover" />
                      <p className="font-medium">{i.title}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted">{i.sku}</td>
                  <td className="px-4 py-3 text-muted">{i.options?.join(', ') ?? '—'}</td>
                  <td className={`px-4 py-3 text-right tabular-nums ${low ? 'font-semibold text-warn' : ''}`}>{i.stock}{low && <span className="ml-1 text-xs font-normal">low</span>}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted">{i.dispatch}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums">{formatINR(i.price)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    <span className="inline-flex items-center gap-0.5 font-medium text-accent">{i.sold}<ChevronRight className="size-3.5" /></span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <section className="mt-6 flex gap-3 rounded-xl bg-surface p-5 ring-1 ring-line">
        <Truck className="mt-0.5 size-5 shrink-0 text-accent" strokeWidth={1.75} />
        <div className="text-sm">
          <p className="font-semibold">Shipping note shown to buyers</p>
          <p className="mt-1 text-muted">“Every piece is packed by hand in recycled kraft paper. Shipped by Delhivery across India — ₹80, free above ₹1,500. Tracking is sent as soon as it leaves Mumbai.”</p>
          <button className="mt-2 font-medium text-accent hover:text-accent-ink">Edit note</button>
        </div>
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
  buyersOf: { control: 'select', options: ['none', 'beginner-kit', 'market-tote', 'coaster-set', 'bunny-plush'] },
}
