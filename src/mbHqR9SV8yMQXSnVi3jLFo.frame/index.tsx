import React, { useState } from 'react'
import { Download, ExternalLink, X, RotateCcw, FileUp, Search } from 'lucide-react'

import { AdminShell, Panel, Pill, Button, statusTone, type AdminNav } from '../shared/admin/AdminShell'
import { TRANSACTIONS, KPIS, inr, inrShort, type Txn } from '../shared/admin/data'

type Props = Partial<typeof args> & { onNavigate?: (key: AdminNav) => void }

export default function Transactions(props: Props) {
  const { filter: initialFilter, selected: initialSelected, onNavigate } = { ...args, ...props }
  const [filter, setFilter] = useState<'All' | Txn['status']>(initialFilter as 'All' | Txn['status'])
  const [selected, setSelected] = useState<string | null>(initialSelected || null)
  const [q, setQ] = useState('')
  const rows = TRANSACTIONS.filter((t) => (filter === 'All' || t.status === filter) && (t.id + t.orderId + t.seller + t.buyer + (t.vpa ?? '')).toLowerCase().includes(q.toLowerCase()))
  const t = TRANSACTIONS.find((x) => x.id === selected)
  const count = (s: Txn['status']) => TRANSACTIONS.filter((x) => x.status === s).length

  return (
    <AdminShell
      active="transactions"
      title="Transactions"
      subtitle="Every payment through sellers’ Razorpay accounts. Riftori never holds funds — this is for support and risk."
      onNavigate={onNavigate}
      actions={<Button><Download className="size-4" /> Export CSV</Button>}
    >
      {/* Summary */}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Panel>
          <dl className="grid grid-cols-2 divide-line sm:grid-cols-4 sm:divide-x">
            <K label="Captured 30d" value={inrShort(KPIS.gmv30)} />
            <K label="Success rate" value={`${KPIS.paymentSuccess}%`} />
            <K label="Refund rate" value={`${KPIS.refundRate}%`} />
            <K label="Dispute rate" value={`${KPIS.disputeRate}%`} />
          </dl>
          <div className="border-t border-line px-4 py-3">
            <p className="mb-2 text-xs text-muted">Payment methods</p>
            <div className="flex h-2 overflow-hidden rounded-full">
              <div className="bg-accent" style={{ width: '78%' }} />
              <div className="bg-info" style={{ width: '15%' }} />
              <div className="bg-warn" style={{ width: '7%' }} />
            </div>
            <div className="mt-2 flex gap-4 text-xs text-muted">
              <span><span className="mr-1 inline-block size-2 rounded-full bg-accent" />UPI 78%</span>
              <span><span className="mr-1 inline-block size-2 rounded-full bg-info" />Card 15%</span>
              <span><span className="mr-1 inline-block size-2 rounded-full bg-warn" />Netbanking 7%</span>
            </div>
          </div>
        </Panel>
        <Panel title="Why payments failed (30 days)">
          <ul className="divide-y divide-line text-[13px]">
            {FAILURES.map((f) => (
              <li key={f.code} className="flex items-center gap-3 px-4 py-2">
                <span className="w-10 font-mono text-xs text-muted">{f.code}</span>
                <span className="flex-1">{f.reason}</span>
                <span className="tabular-nums text-muted">{f.share}%</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <div className="flex gap-1 overflow-x-auto [scrollbar-width:none]">
          {(['All', 'Captured', 'Pending', 'Failed', 'Refunded', 'Disputed'] as const).map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`h-8 shrink-0 rounded-md px-3 text-[13px] ${filter === s ? 'bg-ink font-semibold text-white' : 'bg-surface text-muted ring-1 ring-line'}`}>
              {s} <span className="text-xs opacity-60">{s === 'All' ? TRANSACTIONS.length : count(s)}</span>
            </button>
          ))}
        </div>
        <label className="ml-auto flex h-8 min-w-0 flex-1 items-center gap-2 rounded-md bg-surface px-2.5 ring-1 ring-line focus-within:ring-accent sm:max-w-xs">
          <Search className="size-3.5 text-faint" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="pay_…, order, store, buyer, UPI ID" className="min-w-0 flex-1 bg-transparent text-[13px] outline-none" />
        </label>
      </div>

      <div className={`mt-3 grid gap-5 ${t ? 'xl:grid-cols-[minmax(0,1fr)_380px]' : ''}`}>
        <Panel>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-[13px]">
              <thead className="border-b border-line text-left text-xs text-muted">
                <tr><th className="px-4 py-2.5 font-medium">Payment</th><th className="px-2 py-2.5 font-medium">Order</th><th className="px-2 py-2.5 font-medium">Store → buyer</th><th className="px-2 py-2.5 font-medium">Method</th><th className="px-2 py-2.5 font-medium">Status</th><th className="px-2 py-2.5 font-medium">Settlement</th><th className="px-2 py-2.5 text-right font-medium">Fee</th><th className="px-4 py-2.5 text-right font-medium">Amount</th></tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((x) => (
                  <tr key={x.id} onClick={() => setSelected(x.id)} className={`cursor-pointer ${selected === x.id ? 'bg-accent-soft/50' : 'hover:bg-canvas'}`}>
                    <td className="px-4 py-2.5"><p className="font-mono text-xs">{x.id}</p><p className="text-xs text-muted">{x.time}</p></td>
                    <td className="px-2 py-2.5 tabular-nums">{x.orderId}</td>
                    <td className="px-2 py-2.5"><p>{x.seller}</p><p className="text-xs text-muted">{x.buyer}</p></td>
                    <td className="px-2 py-2.5 text-muted">{x.method}</td>
                    <td className="px-2 py-2.5"><Pill tone={statusTone(x.status)}>{x.status}</Pill></td>
                    <td className="whitespace-nowrap px-2 py-2.5 text-xs text-muted">{x.settlement}</td>
                    <td className="px-2 py-2.5 text-right tabular-nums text-muted">{inr(x.gatewayFee)}</td>
                    <td className="px-4 py-2.5 text-right font-medium tabular-nums">{inr(x.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        {t && (
          <Panel className="self-start xl:sticky xl:top-24">
            <div className="flex items-start justify-between border-b border-line px-4 py-3">
              <div>
                <p className="font-mono text-[13px] font-semibold">{t.id}</p>
                <p className="mt-0.5"><Pill tone={statusTone(t.status)}>{t.status}</Pill></p>
              </div>
              <button aria-label="Close" onClick={() => setSelected(null)} className="text-muted"><X className="size-4" /></button>
            </div>
            <dl className="space-y-2 px-4 py-3 text-[13px]">
              <R label="Amount" value={inr(t.amount)} />
              <R label="Razorpay fee (~2%)" value={inr(t.gatewayFee)} />
              <R label="Seller receives" value={inr(t.amount - t.gatewayFee)} />
              <R label="Riftori commission" value="₹0" />
              <R label="Method" value={`${t.method}${t.vpa ? ` · ${t.vpa}` : ''}`} />
              <R label="Order" value={t.orderId} />
              <R label="Store" value={t.seller} />
              <R label="Buyer" value={t.buyer} />
              <R label="Time" value={t.time} />
              <R label="Settlement" value={t.settlement} />
            </dl>
            {t.reason && <p className={`mx-4 mb-3 rounded-md px-3 py-2 text-[13px] ${t.status === 'Disputed' ? 'bg-danger-soft text-danger' : 'bg-warn-soft text-warn'}`}>{t.reason}</p>}
            <div className="flex flex-wrap gap-2 border-t border-line p-4">
              <Button><ExternalLink className="size-4" /> Open in Razorpay</Button>
              {t.status === 'Captured' && <Button danger><RotateCcw className="size-4" /> Refund</Button>}
              {t.status === 'Disputed' && <Button primary><FileUp className="size-4" /> Submit evidence</Button>}
            </div>
          </Panel>
        )}
      </div>
    </AdminShell>
  )
}

function K({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-3">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-0.5 text-lg font-semibold tabular-nums">{value}</dd>
    </div>
  )
}

function R({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-4"><dt className="shrink-0 text-muted">{label}</dt><dd className="min-w-0 break-all text-right font-medium">{value}</dd></div>
}

const FAILURES = [
  { code: 'U69', reason: 'UPI collect request expired — buyer didn’t approve', share: 41 },
  { code: 'U30', reason: 'Buyer’s bank server unavailable', share: 22 },
  { code: 'U16', reason: 'Daily UPI limit exceeded', share: 14 },
  { code: 'C05', reason: 'Card declined by issuing bank', share: 13 },
  { code: 'OTP', reason: 'Card OTP not entered / timed out', share: 10 },
]

export const args = {
  filter: 'All',
  selected: 'pay_PQ7h90AkWe2b',
}

export const argTypes = {
  filter: { control: 'select', options: ['All', 'Captured', 'Pending', 'Failed', 'Refunded', 'Disputed'] },
  selected: { control: 'select', options: ['', 'pay_PQ7h90AkWe2b', 'pay_PQ8k21LmZt4x', 'pay_PQ4m71UiOp0s', 'pay_PQ5r82KoVb3n'] },
}
