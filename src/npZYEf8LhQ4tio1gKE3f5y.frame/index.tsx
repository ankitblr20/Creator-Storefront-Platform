import React from 'react'
import { Download, ShieldCheck, AlertTriangle } from 'lucide-react'

import { Shell, StatusPill, type NavKey } from '../shared/seller/Shell'
import { ORDERS, formatINR } from '../shared/storefront/data'

type Props = Partial<typeof args> & { onNavigate?: (key: NavKey) => void; onNewItem?: () => void; onConnect?: () => void }

export default function Payments(props: Props) {
  const { razorpay, published, onNavigate, onNewItem, onConnect } = { ...args, ...props }
  const connected = razorpay === 'connected'
  const paid = ORDERS.filter((o) => o.amount > 0)
  const captured = paid.reduce((s, o) => s + o.amount, 0)

  return (
    <Shell
      active="payments"
      title="Payments"
      subtitle="Money captured through your Razorpay account. Riftori takes no commission."
      published={published}
      onNavigate={onNavigate}
      onNewItem={onNewItem}
      actions={
        <button className="flex h-9 items-center gap-2 rounded-lg bg-surface px-3.5 text-sm font-medium ring-1 ring-line hover:bg-canvas">
          <Download className="size-4" /> Export CSV
        </button>
      }
    >
      {!connected && (
        <section className="mb-6 flex flex-wrap items-center gap-4 rounded-xl bg-warn-soft p-5">
          <AlertTriangle className="size-5 shrink-0 text-warn" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold">Connect Razorpay to start taking payments</p>
            <p className="text-sm text-muted">Buyers can't check out until a payment account is connected.</p>
          </div>
          <button onClick={onConnect} className="h-10 whitespace-nowrap rounded-lg bg-accent px-5 text-sm font-semibold text-white hover:bg-accent-ink">Connect Razorpay</button>
        </section>
      )}

      <section className="grid gap-px overflow-hidden rounded-xl bg-line ring-1 ring-line md:grid-cols-[2fr_1fr_1fr]">
        <div className="bg-surface p-6">
          <p className="text-sm text-muted">Captured this month</p>
          <p className="mt-1 text-3xl font-semibold tabular-nums tracking-tight">{formatINR(connected ? 124020 : 0)}</p>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
            <ShieldCheck className="size-4 text-accent" /> {connected ? 'Razorpay · acc_PriyaCrochet · settles T+2 to HDFC ••4410' : 'Not connected'}
          </p>
        </div>
        <div className="bg-surface p-6">
          <p className="text-sm text-muted">Next settlement</p>
          <p className="mt-1 text-xl font-semibold tabular-nums">{formatINR(connected ? 18450 : 0)}</p>
          <p className="text-sm text-muted">Thu 12 Jun</p>
        </div>
        <div className="bg-surface p-6">
          <p className="text-sm text-muted">Refunded</p>
          <p className="mt-1 text-xl font-semibold tabular-nums">{formatINR(connected ? 1499 : 0)}</p>
          <p className="text-sm text-muted">1 this month</p>
        </div>
      </section>

      <section className="mt-6 overflow-x-auto rounded-xl bg-surface ring-1 ring-line">
        <h2 className="border-b border-line px-5 py-3.5 text-sm font-semibold">Recent payments <span className="font-normal text-muted">· {formatINR(captured)} across {paid.length}</span></h2>
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="text-xs text-muted">
            <tr>
              <th className="px-5 py-2.5 font-medium">Payment</th>
              <th className="px-5 py-2.5 font-medium">Order</th>
              <th className="px-5 py-2.5 font-medium">Customer</th>
              <th className="px-5 py-2.5 font-medium">Method</th>
              <th className="px-5 py-2.5 font-medium">Status</th>
              <th className="px-5 py-2.5 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {paid.map((o, i) => (
              <tr key={o.id}>
                <td className="px-5 py-3 font-mono text-xs text-muted">pay_N{(84213 - i * 37).toString(36).toUpperCase()}x{i}</td>
                <td className="px-5 py-3 tabular-nums">{o.id}</td>
                <td className="px-5 py-3">{o.buyer}</td>
                <td className="px-5 py-3 text-muted">{i % 3 === 1 ? 'Card' : 'UPI'}</td>
                <td className="px-5 py-3"><StatusPill status={o.id === 'SF-2480' ? 'Refunded' : 'Captured'} /></td>
                <td className="px-5 py-3 text-right font-medium tabular-nums">{formatINR(o.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </Shell>
  )
}

export const args = {
  razorpay: 'connected',
  published: true,
}

export const argTypes = {
  razorpay: { control: 'radio', options: ['connected', 'not connected'] },
  published: { control: 'boolean' },
}
