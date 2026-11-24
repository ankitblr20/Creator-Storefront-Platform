import React, { useState } from 'react'
import { Send, Check, Link2 } from 'lucide-react'

import { AdminShell, Panel, Pill, Button, statusTone, type AdminNav } from '../shared/admin/AdminShell'
import { TICKETS, ORDERS, SELLERS, inr, type Ticket } from '../shared/admin/data'

type Filter = 'Open' | 'Waiting on user' | 'Resolved' | 'All'

type Props = Partial<typeof args> & { onNavigate?: (key: AdminNav) => void; onOpenSeller?: (id: string) => void }

export default function Support(props: Props) {
  const { filter: initialFilter, selected: initialSelected, onNavigate, onOpenSeller } = { ...args, ...props }
  const [filter, setFilter] = useState<Filter>(initialFilter as Filter)
  const [selected, setSelected] = useState(initialSelected)
  const [state, setState] = useState<Record<string, Partial<Ticket>>>({})
  const [replies, setReplies] = useState<Record<string, Ticket['thread']>>({})
  const [draft, setDraft] = useState('')

  const merged = TICKETS.map((t) => ({ ...t, ...state[t.id], thread: [...t.thread, ...(replies[t.id] ?? [])] }))
  const list = merged.filter((t) => filter === 'All' || t.status === filter)
  const t = merged.find((x) => x.id === selected) ?? list[0]
  const order = t?.linked ? ORDERS.find((o) => o.id === t.linked) : undefined
  const seller = t?.linked ? SELLERS.find((s) => s.id === t.linked) ?? (order && SELLERS.find((s) => s.store === order.seller)) : undefined
  const count = (f: Filter) => merged.filter((x) => x.status === f).length

  const send = (resolve: boolean) => {
    if (!t) return
    if (draft.trim()) setReplies((r) => ({ ...r, [t.id]: [...(r[t.id] ?? []), { who: 'Arjun (Ops)', when: 'Just now', text: draft }] }))
    setState((s) => ({ ...s, [t.id]: { ...s[t.id], status: resolve ? 'Resolved' : 'Waiting on user', assignee: t.assignee === 'Unassigned' ? 'Arjun (Ops)' : t.assignee } }))
    setDraft('')
  }

  return (
    <AdminShell
      active="support"
      title="Support"
      subtitle="Median first reply 2 h 10 m · 92% within SLA this week · target: urgent 4 h, high 12 h, normal 24 h"
      onNavigate={onNavigate}
    >
      <div className="grid gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
        {/* Inbox */}
        <Panel className="self-start">
          <div className="flex gap-1 overflow-x-auto border-b border-line p-2 [scrollbar-width:none]">
            {(['Open', 'Waiting on user', 'Resolved', 'All'] as Filter[]).map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`h-7 shrink-0 whitespace-nowrap rounded px-2.5 text-xs ${filter === f ? 'bg-ink font-semibold text-white' : 'text-muted hover:bg-canvas'}`}>
                {f === 'Waiting on user' ? 'Waiting' : f} <span className="opacity-60">{f === 'All' ? merged.length : count(f)}</span>
              </button>
            ))}
          </div>
          <ul className="divide-y divide-line">
            {list.map((x) => (
              <li key={x.id}>
                <button onClick={() => setSelected(x.id)} className={`w-full px-4 py-3 text-left ${t?.id === x.id ? 'bg-accent-soft/50' : 'hover:bg-canvas'}`}>
                  <div className="flex items-center gap-2">
                    <Pill tone={statusTone(x.priority)}>{x.priority}</Pill>
                    <span className="text-xs text-muted">{x.from} · {x.category}</span>
                    <span className={`ml-auto text-xs ${x.sla === 'Breached' ? 'font-semibold text-danger' : 'text-muted'}`}>{x.age}</span>
                  </div>
                  <p className="mt-1.5 truncate text-[13px] font-medium">{x.subject}</p>
                  <p className="truncate text-xs text-muted">{x.name} · {x.assignee}</p>
                </button>
              </li>
            ))}
            {!list.length && <li className="px-4 py-10 text-center text-[13px] text-muted">Inbox zero.</li>}
          </ul>
        </Panel>

        {/* Conversation */}
        {t && (
          <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
            <Panel>
              <div className="border-b border-line px-5 py-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-muted">{t.id}</span>
                  <Pill tone={statusTone(t.status)}>{t.status}</Pill>
                  <Pill tone={statusTone(t.sla)}>SLA {t.sla}</Pill>
                </div>
                <h2 className="mt-1.5 text-base font-semibold">{t.subject}</h2>
                <p className="text-[13px] text-muted">{t.name} · {t.email}</p>
              </div>
              <ul className="space-y-4 px-5 py-4">
                {t.thread.map((m, i) => {
                  const staff = m.who.includes('(')
                  const bot = m.who.includes('bot')
                  return (
                    <li key={i} className={`max-w-[90%] rounded-lg px-4 py-3 text-[13px] ${bot ? 'bg-info-soft' : staff ? 'ml-auto bg-accent-soft' : 'bg-canvas'}`}>
                      <p className="text-xs font-semibold">{m.who} <span className="font-normal text-muted">· {m.when}</span></p>
                      <p className="mt-1 leading-relaxed">{m.text}</p>
                    </li>
                  )
                })}
              </ul>
              {t.status !== 'Resolved' && (
                <div className="border-t border-line p-4">
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {MACROS.map((m) => (
                      <button key={m.label} onClick={() => setDraft(m.text)} className="h-7 rounded-full px-3 text-xs ring-1 ring-line hover:bg-canvas">{m.label}</button>
                    ))}
                  </div>
                  <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={3} placeholder={`Reply to ${t.name.split(' ')[0]}…`} className="w-full resize-none rounded-md bg-canvas px-3 py-2 text-[13px] outline-none focus:ring-2 focus:ring-accent" />
                  <div className="mt-2 flex flex-wrap justify-end gap-2">
                    <Button onClick={() => send(true)}><Check className="size-4" /> Send & resolve</Button>
                    <Button primary onClick={() => send(false)}><Send className="size-4" /> Send reply</Button>
                  </div>
                </div>
              )}
            </Panel>

            {/* Context */}
            <div className="space-y-5">
              <Panel title="Ticket">
                <dl className="space-y-2 p-4 text-[13px]">
                  <Row label="From" value={`${t.from} · ${t.name}`} />
                  <Row label="Category" value={t.category} />
                  <Row label="Priority" value={t.priority} />
                  <Row label="Assignee" value={t.assignee} />
                  <Row label="Opened" value={`${t.age} ago`} />
                </dl>
              </Panel>
              {order && (
                <Panel title="Linked order">
                  <dl className="space-y-2 p-4 text-[13px]">
                    <Row label="Order" value={order.id} />
                    <Row label="Item" value={order.item} />
                    <Row label="Store" value={order.seller} />
                    <Row label="Amount" value={inr(order.amount)} />
                    <Row label="Status" value={order.status} />
                    <Row label="Payment" value={order.paymentId} />
                  </dl>
                  <div className="border-t border-line p-3"><Button onClick={() => onNavigate?.('buyers')}><Link2 className="size-4" /> Open order</Button></div>
                </Panel>
              )}
              {seller && (
                <Panel title="Seller">
                  <div className="p-4 text-[13px]">
                    <p className="font-medium">{seller.store}</p>
                    <p className="text-xs text-muted">{seller.owner} · {seller.plan} · health {seller.health}</p>
                    <p className="mt-1 text-xs text-muted">{seller.email} · {seller.phone}</p>
                  </div>
                  <div className="border-t border-line p-3"><Button onClick={() => onOpenSeller?.(seller.id)}>View seller profile</Button></div>
                </Panel>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-3"><dt className="shrink-0 text-muted">{label}</dt><dd className="min-w-0 break-words text-right font-medium">{value}</dd></div>
}

const MACROS = [
  { label: 'Contacted seller', text: 'Thanks for flagging this. I’ve contacted the seller and asked them to respond within 24 hours. I’ll update you here either way.' },
  { label: 'Refund issued', text: 'We’ve issued a full refund. It goes back to your original payment method and usually shows up within 5–7 working days.' },
  { label: 'Need KYC docs', text: 'Razorpay needs one more document to finish your KYC. Please re-upload a clear photo of your PAN card using the link in your email.' },
  { label: 'Billing grace', text: 'No worries — I’ve given you 7 extra days before your store is affected. Please update your UPI autopay from Settings → Plan & billing.' },
]

export const args = {
  filter: 'Open',
  selected: 'RF-20418',
}

export const argTypes = {
  filter: { control: 'radio', options: ['Open', 'Waiting on user', 'Resolved', 'All'] },
  selected: { control: 'select', options: ['RF-20418', 'RF-20415', 'RF-20412', 'RF-20409', 'RF-20401', 'RF-20398'] },
}
