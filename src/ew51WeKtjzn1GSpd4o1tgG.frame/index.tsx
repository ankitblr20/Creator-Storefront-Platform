import React, { useState } from 'react'
import { Search, X, Mail, Phone, MapPin, RotateCcw, Send, Ban, Download } from 'lucide-react'

import { AdminShell, Panel, Pill, Button, statusTone, type AdminNav } from '../shared/admin/AdminShell'
import { BUYERS, ORDERS, TRANSACTIONS, KPIS, inr, type OrderStatus } from '../shared/admin/data'

type Tab = 'buyers' | 'orders'

type Props = Partial<typeof args> & { onNavigate?: (key: AdminNav) => void; onOpenSeller?: (id: string) => void }

export default function BuyersAndOrders(props: Props) {
  const { tab: initialTab, selected: initialSelected, onNavigate } = { ...args, ...props }
  const [tab, setTab] = useState<Tab>(initialTab as Tab)
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<'All' | OrderStatus>('All')
  const [buyerId, setBuyerId] = useState<string | null>(initialTab === 'buyers' ? initialSelected || null : null)
  const [orderId, setOrderId] = useState<string | null>(initialTab === 'orders' ? initialSelected || null : null)
  const [refunded, setRefunded] = useState<Record<string, boolean>>({})

  const ql = q.toLowerCase()
  const buyers = BUYERS.filter((b) => (b.name + b.email + b.phone + b.city).toLowerCase().includes(ql))
  const orders = ORDERS.filter(
    (o) => (status === 'All' || o.status === status) && (o.id + o.buyer + o.seller + o.item + o.paymentId).toLowerCase().includes(ql),
  )
  const buyer = BUYERS.find((b) => b.id === buyerId)
  const order = ORDERS.find((o) => o.id === orderId)
  const txn = order && TRANSACTIONS.find((t) => t.id === order.paymentId)
  const panelOpen = (tab === 'buyers' && buyer) || (tab === 'orders' && order)

  return (
    <AdminShell
      active="buyers"
      title="Buyers & orders"
      subtitle={`${KPIS.buyers.toLocaleString('en-IN')} buyers · ${KPIS.orders30.toLocaleString('en-IN')} orders in 30 days · every purchase across every store`}
      onNavigate={onNavigate}
      actions={<Button><Download className="size-4" /> Export</Button>}
    >
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-md bg-surface p-0.5 ring-1 ring-line">
          {(['buyers', 'orders'] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`h-7 rounded px-3 text-[13px] capitalize ${tab === t ? 'bg-ink font-semibold text-white' : 'text-muted'}`}>{t}</button>
          ))}
        </div>
        <label className="flex h-8 min-w-0 flex-1 items-center gap-2 rounded-md bg-surface px-2.5 ring-1 ring-line focus-within:ring-accent sm:max-w-sm">
          <Search className="size-3.5 text-faint" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={tab === 'buyers' ? 'Name, email, phone, city' : 'Order ID, buyer, store, item, pay_…'} className="min-w-0 flex-1 bg-transparent text-[13px] outline-none" />
        </label>
        {tab === 'orders' && (
          <select value={status} onChange={(e) => setStatus(e.target.value as 'All' | OrderStatus)} className="h-8 rounded-md bg-surface px-2 text-[13px] ring-1 ring-line outline-none">
            {['All', 'Paid', 'Fulfilled', 'Dispatched', 'Refunded', 'Disputed', 'Failed'].map((s) => <option key={s}>{s}</option>)}
          </select>
        )}
      </div>

      <div className={`mt-4 grid gap-5 ${panelOpen ? 'xl:grid-cols-[minmax(0,1fr)_380px]' : ''}`}>
        <Panel>
          <div className="overflow-x-auto">
            {tab === 'buyers' ? (
              <table className="w-full min-w-[760px] text-[13px]">
                <thead className="border-b border-line text-left text-xs text-muted">
                  <tr><th className="px-4 py-2.5 font-medium">Buyer</th><th className="px-2 py-2.5 font-medium">Phone</th><th className="px-2 py-2.5 font-medium">City</th><th className="px-2 py-2.5 font-medium">Bought from</th><th className="px-2 py-2.5 text-right font-medium">Orders</th><th className="px-2 py-2.5 text-right font-medium">Spent</th><th className="px-4 py-2.5 font-medium">Last order</th></tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {buyers.map((b) => (
                    <tr key={b.id} onClick={() => setBuyerId(b.id)} className={`cursor-pointer ${buyerId === b.id ? 'bg-accent-soft/50' : 'hover:bg-canvas'}`}>
                      <td className="px-4 py-2.5"><p className="font-medium">{b.name}</p><p className="text-xs text-muted">{b.email}</p></td>
                      <td className="whitespace-nowrap px-2 py-2.5 text-muted">{b.phone}</td>
                      <td className="px-2 py-2.5 text-muted">{b.city}</td>
                      <td className="max-w-[200px] truncate px-2 py-2.5 text-muted">{b.stores.join(', ')}</td>
                      <td className="px-2 py-2.5 text-right tabular-nums">{b.orders}</td>
                      <td className="px-2 py-2.5 text-right font-medium tabular-nums">{inr(b.spent)}</td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-xs text-muted">{b.lastOrder}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full min-w-[820px] text-[13px]">
                <thead className="border-b border-line text-left text-xs text-muted">
                  <tr><th className="px-4 py-2.5 font-medium">Order</th><th className="px-2 py-2.5 font-medium">Buyer</th><th className="px-2 py-2.5 font-medium">Store</th><th className="px-2 py-2.5 font-medium">Item</th><th className="px-2 py-2.5 font-medium">Status</th><th className="px-2 py-2.5 font-medium">Method</th><th className="px-4 py-2.5 text-right font-medium">Amount</th></tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {orders.map((o) => {
                    const st = refunded[o.id] ? 'Refunded' : o.status
                    return (
                      <tr key={o.id} onClick={() => setOrderId(o.id)} className={`cursor-pointer ${orderId === o.id ? 'bg-accent-soft/50' : 'hover:bg-canvas'}`}>
                        <td className="px-4 py-2.5"><p className="font-medium tabular-nums">{o.id}</p><p className="text-xs text-muted">{o.time}</p></td>
                        <td className="px-2 py-2.5">{o.buyer}</td>
                        <td className="px-2 py-2.5 text-muted">{o.seller}</td>
                        <td className="max-w-[200px] truncate px-2 py-2.5">{o.item}<span className="block text-xs text-muted">{o.module}</span></td>
                        <td className="px-2 py-2.5"><Pill tone={statusTone(st)}>{st}</Pill></td>
                        <td className="px-2 py-2.5 text-muted">{o.method}</td>
                        <td className="px-4 py-2.5 text-right font-medium tabular-nums">{inr(o.amount)}</td>
                      </tr>
                    )
                  })}
                  {!orders.length && <tr><td colSpan={7} className="px-4 py-12 text-center text-muted">No orders match.</td></tr>}
                </tbody>
              </table>
            )}
          </div>
        </Panel>

        {/* Detail */}
        {tab === 'buyers' && buyer && (
          <Panel className="self-start xl:sticky xl:top-24">
            <div className="flex items-start justify-between border-b border-line px-4 py-3">
              <div>
                <p className="text-base font-semibold">{buyer.name}</p>
                <p className="text-xs text-muted">Buyer since {buyer.firstSeen} · {buyer.id}</p>
              </div>
              <button aria-label="Close" onClick={() => setBuyerId(null)} className="text-muted"><X className="size-4" /></button>
            </div>
            <div className="space-y-1.5 px-4 py-3 text-[13px]">
              <p className="flex items-center gap-2"><Mail className="size-3.5 text-faint" />{buyer.email}</p>
              <p className="flex items-center gap-2"><Phone className="size-3.5 text-faint" />{buyer.phone}</p>
              <p className="flex items-center gap-2"><MapPin className="size-3.5 text-faint" />{buyer.city}</p>
            </div>
            <dl className="grid grid-cols-3 border-y border-line text-center">
              <div className="py-3"><dt className="text-xs text-muted">Orders</dt><dd className="font-semibold">{buyer.orders}</dd></div>
              <div className="border-x border-line py-3"><dt className="text-xs text-muted">Spent</dt><dd className="font-semibold">{inr(buyer.spent)}</dd></div>
              <div className="py-3"><dt className="text-xs text-muted">Refunds</dt><dd className={`font-semibold ${buyer.refunds > 1 ? 'text-danger' : ''}`}>{buyer.refunds}</dd></div>
            </dl>
            <p className="px-4 pt-3 text-xs font-semibold text-muted">Purchases</p>
            <ul className="divide-y divide-line">
              {ORDERS.filter((o) => o.buyerId === buyer.id).map((o) => (
                <li key={o.id}>
                  <button onClick={() => { setTab('orders'); setOrderId(o.id) }} className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-[13px] hover:bg-canvas">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{o.item}</p>
                      <p className="text-xs text-muted">{o.id} · {o.seller} · {o.time}</p>
                    </div>
                    <Pill tone={statusTone(o.status)}>{o.status}</Pill>
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2 border-t border-line p-4">
              <Button><Send className="size-4" /> Resend receipts</Button>
              <Button danger><Ban className="size-4" /> Block buyer</Button>
            </div>
          </Panel>
        )}

        {tab === 'orders' && order && (
          <Panel className="self-start xl:sticky xl:top-24">
            <div className="flex items-start justify-between border-b border-line px-4 py-3">
              <div>
                <p className="text-base font-semibold">{order.id}</p>
                <p className="text-xs text-muted">{order.item}</p>
              </div>
              <button aria-label="Close" onClick={() => setOrderId(null)} className="text-muted"><X className="size-4" /></button>
            </div>
            <dl className="space-y-2 px-4 py-3 text-[13px]">
              <L label="Buyer" value={order.buyer} />
              <L label="Store" value={order.seller} />
              <L label="Module" value={order.module} />
              <L label="Amount" value={inr(order.amount)} />
              <L label="Status" value={refunded[order.id] ? 'Refunded' : order.status} />
              <L label="Placed" value={order.time} />
            </dl>
            <div className="border-t border-line px-4 py-3">
              <p className="text-xs font-semibold text-muted">Payment</p>
              <dl className="mt-2 space-y-2 text-[13px]">
                <L label="Razorpay ID" value={order.paymentId} mono />
                <L label="Method" value={`${order.method}${txn?.vpa ? ` · ${txn.vpa}` : ''}`} />
                {txn && <L label="Gateway fee" value={inr(txn.gatewayFee)} />}
                {txn && <L label="Settlement" value={txn.settlement} />}
              </dl>
              {txn?.reason && <p className="mt-3 rounded-md bg-warn-soft px-3 py-2 text-[13px] text-warn">{txn.reason}</p>}
            </div>
            <ol className="space-y-2 border-t border-line px-4 py-3 text-[13px]">
              {TIMELINE(order.status).map((t) => (
                <li key={t.label} className="flex gap-2.5">
                  <span className={`mt-1.5 size-1.5 shrink-0 rounded-full ${t.done ? 'bg-accent' : 'bg-line'}`} />
                  <span className={t.done ? '' : 'text-faint'}>{t.label}</span>
                </li>
              ))}
            </ol>
            <div className="flex flex-wrap gap-2 border-t border-line p-4">
              <Button><Send className="size-4" /> Resend confirmation</Button>
              {!refunded[order.id] && order.status !== 'Refunded' && order.status !== 'Failed' && (
                <Button danger onClick={() => setRefunded((r) => ({ ...r, [order.id]: true }))}><RotateCcw className="size-4" /> Refund {inr(order.amount)}</Button>
              )}
            </div>
          </Panel>
        )}
      </div>
    </AdminShell>
  )
}

function L({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="shrink-0 text-muted">{label}</dt>
      <dd className={`min-w-0 break-all text-right font-medium ${mono ? 'font-mono text-xs' : ''}`}>{value}</dd>
    </div>
  )
}

function TIMELINE(status: OrderStatus) {
  const steps = ['Checkout started', 'Payment captured', 'Confirmation sent to buyer', 'Fulfilled by seller']
  const reached = status === 'Failed' ? 1 : status === 'Paid' || status === 'Disputed' ? 3 : 4
  const list = steps.map((label, i) => ({ label, done: i < reached }))
  if (status === 'Failed') list[1] = { label: 'Payment failed', done: true }
  if (status === 'Refunded') list.push({ label: 'Refunded to buyer', done: true })
  if (status === 'Disputed') list.push({ label: 'Chargeback opened by buyer’s bank', done: true })
  return list
}

export const args = {
  tab: 'orders',
  selected: 'MB-88120',
}

export const argTypes = {
  tab: { control: 'radio', options: ['buyers', 'orders'] },
  selected: { control: 'select', options: ['', 'MB-88120', 'SF-2487', 'GZ-0418', 'BA-0912', 'by_ananya', 'by_ishaan', 'by_fatima'] },
}
