import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ExternalLink, Mail, Phone, MapPin, UserCog, PauseCircle, Ban, Check, X, Instagram } from 'lucide-react'

import { AdminShell, Panel, Pill, Delta, Button, Bars, HealthBadge, statusTone, type AdminNav } from '../shared/admin/AdminShell'
import { SELLERS, ORDERS, TRANSACTIONS, INVOICES, AUDIT_LOG, SELLER_GMV_DAILY, PLAN_PRICE, inr, pctChange } from '../shared/admin/data'

type Tab = 'overview' | 'orders' | 'payments' | 'subscription' | 'notes'

type Props = Partial<typeof args> & { onBack?: () => void; onNavigate?: (key: AdminNav) => void }

export default function SellerProfile(props: Props) {
  const { sellerId, tab: initialTab, onBack, onNavigate } = { ...args, ...props }
  const s = SELLERS.find((x) => x.id === sellerId) ?? SELLERS[0]
  const [tab, setTab] = useState<Tab>(initialTab as Tab)
  const [status, setStatus] = useState(s.status)
  const [held, setHeld] = useState(s.id === 'sl_mumbaibeats')
  const [confirm, setConfirm] = useState<null | 'suspend' | 'impersonate'>(null)
  const [notes, setNotes] = useState(NOTES[s.id] ?? [])
  const [draft, setDraft] = useState('')

  const orders = ORDERS.filter((o) => o.seller === s.store)
  const txns = TRANSACTIONS.filter((t) => t.seller === s.store)
  const invoices = INVOICES.filter((i) => i.seller === s.store)
  const gmvDaily = SELLER_GMV_DAILY[s.id] ?? Array.from({ length: 30 }, (_, i) => Math.round((s.gmv30 / 30) * (0.6 + ((i * 37) % 9) / 10)))
  const aov = s.orders30 ? Math.round(s.gmv30 / s.orders30) : 0
  const disputes = txns.filter((t) => t.status === 'Disputed').length

  return (
    <AdminShell
      active="sellers"
      title={s.store}
      subtitle={`Seller ${s.id} · joined ${s.joined} · last active ${s.lastActive}`}
      onNavigate={onNavigate}
      actions={
        <>
          <Button onClick={onBack}><ArrowLeft className="size-4" /> Sellers</Button>
          <Button onClick={() => setConfirm('impersonate')}><UserCog className="size-4" /> Log in as seller</Button>
          <Button onClick={() => setHeld((h) => !h)}><PauseCircle className="size-4" /> {held ? 'Release settlements' : 'Hold settlements'}</Button>
          {status === 'Suspended' ? (
            <Button primary onClick={() => setStatus('Active')}><Check className="size-4" /> Reinstate</Button>
          ) : (
            <Button danger onClick={() => setConfirm('suspend')}><Ban className="size-4" /> Suspend</Button>
          )}
        </>
      }
    >
      {/* Identity */}
      <Panel>
        <div className="flex flex-wrap items-start gap-5 p-5">
          {s.avatar ? (
            <img src={s.avatar} alt="" className="size-16 rounded-full object-cover" />
          ) : (
            <span className="grid size-16 place-items-center rounded-full bg-canvas text-lg font-semibold text-muted">{s.store.split(' ').map((w) => w[0]).slice(0, 2).join('')}</span>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-lg font-semibold">{s.owner}</p>
              <Pill tone={statusTone(status)}>{status}</Pill>
              <Pill tone={s.plan === 'Business' ? 'info' : 'ok'}>{s.plan}{PLAN_PRICE[s.plan] ? ` · ${inr(PLAN_PRICE[s.plan])}/mo` : ''}</Pill>
              <Pill tone={statusTone(s.razorpay)}>Razorpay: {s.razorpay}</Pill>
              {held && <Pill tone="danger">Settlements on hold</Pill>}
            </div>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-muted">
              <a href={`mailto:${s.email}`} className="flex items-center gap-1.5 hover:text-ink"><Mail className="size-3.5" />{s.email}</a>
              <a href={`tel:${s.phone}`} className="flex items-center gap-1.5 hover:text-ink"><Phone className="size-3.5" />{s.phone}</a>
              <span className="flex items-center gap-1.5"><MapPin className="size-3.5" />{s.city}</span>
              <span className="flex items-center gap-1.5"><Instagram className="size-3.5" />@{s.handle} · {s.followers}</span>
              <a href="#" className="flex items-center gap-1.5 font-medium text-accent"><ExternalLink className="size-3.5" />riftori.com/{s.handle}</a>
            </div>
            <p className="mt-1 text-xs text-muted">{s.category} · sells {s.modules.join(', ')} · {s.items} items published</p>
            <p className="mt-0.5 text-xs text-muted">
              Heard about us via <span className="font-medium text-ink">{s.heardVia}</span>
              {s.referredBy && <> · referred by <span className="font-medium text-ink">{s.referredBy}</span> (2 free months each once paid)</>}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted">Health</p>
            <p className="text-3xl font-semibold"><HealthBadge value={s.health} /></p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto border-t border-line px-3 [scrollbar-width:none]">
          {(['overview', 'orders', 'payments', 'subscription', 'notes'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`-mb-px h-10 shrink-0 whitespace-nowrap border-b-2 px-3 text-[13px] capitalize ${tab === t ? 'border-ink font-semibold' : 'border-transparent text-muted hover:text-ink'}`}
            >
              {t === 'notes' ? 'Notes & activity' : t}
            </button>
          ))}
        </div>
      </Panel>

      <div className="mt-5">
        {tab === 'overview' && (
          <div className="space-y-5">
            <Panel>
              <dl className="grid grid-cols-2 divide-line sm:grid-cols-4 lg:grid-cols-7 lg:divide-x">
                <Kpi label="GMV 30d" value={inr(s.gmv30)} extra={<Delta value={pctChange(s.gmv30, s.gmvPrev30)} />} />
                <Kpi label="Orders" value={s.orders30.toLocaleString('en-IN')} />
                <Kpi label="Buyers (all time)" value={s.buyers.toLocaleString('en-IN')} />
                <Kpi label="Avg order" value={inr(aov)} />
                <Kpi label="Visit → buy" value={`${s.conversion}%`} />
                <Kpi label="Refund rate" value={`${s.refundRate}%`} bad={s.refundRate > 3} />
                <Kpi label="Disputes" value={String(disputes)} bad={disputes > 0} />
              </dl>
            </Panel>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
              <Panel title="GMV, last 30 days">
                <div className="p-4"><Bars values={gmvDaily} height={160} /></div>
              </Panel>
              <Panel title="Setup & compliance">
                <ul className="divide-y divide-line text-[13px]">
                  <Check2 ok label="Email verified" />
                  <Check2 ok={s.razorpay === 'Connected'} label={`Razorpay ${s.razorpay.toLowerCase()}`} />
                  <Check2 ok={s.items > 0} label={`${s.items} items published`} />
                  <Check2 ok={s.plan !== 'Trial'} label={s.plan === 'Trial' ? 'On free trial' : `Paying · ${s.plan}`} />
                  <Check2 ok={s.refundRate <= 3} label={`Refund rate ${s.refundRate}% (limit 3%)`} />
                  <Check2 ok={disputes === 0} label={disputes ? `${disputes} open chargeback` : 'No chargebacks'} />
                </ul>
              </Panel>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <Panel title="Revenue by module">
                <ul className="space-y-3 p-4">
                  {s.modules.map((m, i) => {
                    const share = [0.46, 0.27, 0.17, 0.1][i] ?? 0.1
                    return (
                      <li key={m}>
                        <div className="flex justify-between text-[13px]"><span className="font-medium">{m}</span><span className="tabular-nums">{inr(s.gmv30 * share)}</span></div>
                        <div className="mt-1 h-1.5 rounded-full bg-canvas"><div className="h-full rounded-full bg-ink/70" style={{ width: `${share * 100}%` }} /></div>
                      </li>
                    )
                  })}
                </ul>
              </Panel>
              <Panel title="Buyer behaviour">
                <dl className="grid grid-cols-2 gap-px bg-line text-[13px]">
                  <Cell label="Repeat buyers" value="31%" />
                  <Cell label="Traffic from Instagram" value="72%" />
                  <Cell label="Mobile checkouts" value="94%" />
                  <Cell label="UPI share" value="81%" />
                </dl>
              </Panel>
            </div>
          </div>
        )}

        {tab === 'orders' && (
          <Panel title={`Orders · ${s.orders30} in 30 days`}>
            <SimpleTable
              head={['Order', 'Buyer', 'Item', 'Status', 'Payment', 'Amount']}
              rows={orders.map((o) => [o.id, o.buyer, o.item, <Pill key="s" tone={statusTone(o.status)}>{o.status}</Pill>, <span key="p" className="font-mono text-xs">{o.paymentId}</span>, inr(o.amount)])}
              empty="No orders in the sample for this seller."
            />
          </Panel>
        )}

        {tab === 'payments' && (
          <div className="space-y-5">
            <Panel>
              <dl className="grid grid-cols-2 divide-line sm:grid-cols-4 sm:divide-x">
                <Kpi label="Captured 30d" value={inr(s.gmv30)} />
                <Kpi label="Gateway fees (Razorpay)" value={inr(s.gmv30 * 0.02)} />
                <Kpi label="Riftori commission" value="₹0" />
                <Kpi label="Next settlement" value={held ? 'On hold' : 'T+2'} bad={held} />
              </dl>
            </Panel>
            <Panel title="Payments">
              <SimpleTable
                head={['Payment ID', 'Order', 'Buyer', 'Method', 'Status', 'Settlement', 'Amount']}
                rows={txns.map((t) => [<span key="i" className="font-mono text-xs">{t.id}</span>, t.orderId, t.buyer, t.method, <Pill key="s" tone={statusTone(t.status)}>{t.status}</Pill>, t.settlement, inr(t.amount)])}
                empty="No payments in the sample for this seller."
              />
            </Panel>
          </div>
        )}

        {tab === 'subscription' && (
          <div className="grid gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
            <Panel title="Plan">
              <dl className="space-y-2.5 p-4 text-[13px]">
                <Row label="Plan" value={`${s.plan}${PLAN_PRICE[s.plan] ? ` · ${inr(PLAN_PRICE[s.plan])}/mo + GST` : ''}`} />
                <Row label="Status" value={status} />
                <Row label="Started" value={s.joined} />
                <Row label="Next renewal" value={s.plan === 'Trial' ? 'Trial ends in 2 days' : '4 Jul 2025'} />
                <Row label="Payment method" value={s.status === 'Past due' ? 'UPI autopay — expired' : 'UPI autopay'} />
                <Row label="Lifetime paid" value={inr(PLAN_PRICE[s.plan] * 1.18 * 5)} />
              </dl>
              <div className="flex flex-wrap gap-2 border-t border-line p-4">
                <Button>Change plan</Button>
                <Button>Extend trial 7 days</Button>
                <Button>Issue credit</Button>
              </div>
            </Panel>
            <Panel title="Invoices">
              <SimpleTable
                head={['Invoice', 'Date', 'Plan', 'Status', 'Note', 'Amount']}
                rows={invoices.map((i) => [i.id, i.date, i.plan, <Pill key="s" tone={i.status === 'Paid' ? 'ok' : i.status === 'Failed' ? 'danger' : 'neutral'}>{i.status}</Pill>, i.note, inr(i.amount)])}
                empty="No invoices yet."
              />
            </Panel>
          </div>
        )}

        {tab === 'notes' && (
          <div className="grid gap-5 lg:grid-cols-2">
            <Panel title="Internal notes">
              <div className="p-4">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={3}
                  placeholder="Visible to the Riftori team only"
                  className="w-full resize-none rounded-md bg-canvas px-3 py-2 text-[13px] outline-none focus:ring-2 focus:ring-accent"
                />
                <div className="mt-2 flex justify-end">
                  <Button primary onClick={() => { if (draft.trim()) { setNotes((n) => [{ who: 'Arjun (Ops)', when: 'Just now', text: draft }, ...n]); setDraft('') } }}>Add note</Button>
                </div>
              </div>
              <ul className="divide-y divide-line border-t border-line">
                {notes.map((n, i) => (
                  <li key={i} className="px-4 py-3 text-[13px]">
                    <p>{n.text}</p>
                    <p className="mt-1 text-xs text-muted">{n.who} · {n.when}</p>
                  </li>
                ))}
                {!notes.length && <li className="px-4 py-6 text-center text-[13px] text-muted">No notes yet.</li>}
              </ul>
            </Panel>
            <Panel title="Activity">
              <ul className="divide-y divide-line">
                {[
                  { who: s.owner, what: 'Logged in', when: s.lastActive },
                  { who: s.owner, what: 'Published a new item', when: '2 days ago' },
                  ...AUDIT_LOG.filter((a) => a.what.includes(s.store)),
                  { who: 'System', what: 'Store created', when: s.joined },
                ].map((a, i) => (
                  <li key={i} className="flex justify-between gap-4 px-4 py-2.5 text-[13px]">
                    <span><span className="font-medium">{a.who}</span> <span className="text-muted">{a.what}</span></span>
                    <span className="shrink-0 text-xs text-muted">{a.when}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        )}
      </div>

      {/* Confirmations */}
      <AnimatePresence>
        {confirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4" onClick={() => setConfirm(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              className="w-full max-w-md rounded-xl bg-surface p-5 shadow-xl"
            >
              <div className="flex items-start justify-between">
                <h2 className="text-base font-semibold">{confirm === 'suspend' ? `Suspend ${s.store}?` : `Log in as ${s.owner}?`}</h2>
                <button aria-label="Close" onClick={() => setConfirm(null)} className="text-muted"><X className="size-4" /></button>
              </div>
              <p className="mt-1.5 text-[13px] text-muted">
                {confirm === 'suspend'
                  ? 'The store goes offline immediately, buyers see “temporarily unavailable”, and the seller gets an email with the reason. Existing orders stay in their dashboard.'
                  : 'You’ll see their dashboard exactly as they do, read-only. The session is logged and the seller is notified.'}
              </p>
              {confirm === 'suspend' && (
                <select className="mt-4 h-9 w-full rounded-md bg-canvas px-2 text-[13px] outline-none">
                  <option>Prohibited or counterfeit items</option>
                  <option>High refund / chargeback rate</option>
                  <option>Fraud suspected</option>
                  <option>Terms violation — other</option>
                </select>
              )}
              <div className="mt-5 flex justify-end gap-2">
                <Button onClick={() => setConfirm(null)}>Cancel</Button>
                {confirm === 'suspend' ? (
                  <Button danger onClick={() => { setStatus('Suspended'); setConfirm(null) }}><Ban className="size-4" /> Suspend store</Button>
                ) : (
                  <Button primary onClick={() => setConfirm(null)}>Start read-only session</Button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminShell>
  )
}

function Kpi({ label, value, extra, bad }: { label: string; value: string; extra?: React.ReactNode; bad?: boolean }) {
  return (
    <div className="px-4 py-3">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className={`mt-0.5 text-[15px] font-semibold tabular-nums ${bad ? 'text-danger' : ''}`}>{value}</dd>
      {extra}
    </div>
  )
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface px-4 py-3">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-0.5 text-[15px] font-semibold">{value}</dd>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-4"><dt className="text-muted">{label}</dt><dd className="text-right font-medium">{value}</dd></div>
}

function Check2({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li className="flex items-center gap-2.5 px-4 py-2.5">
      {ok ? <Check className="size-4 text-accent" /> : <X className="size-4 text-danger" />}
      <span className={ok ? '' : 'font-medium text-danger'}>{label}</span>
    </li>
  )
}

function SimpleTable({ head, rows, empty }: { head: string[]; rows: React.ReactNode[][]; empty: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-[13px]">
        <thead className="border-b border-line text-left text-xs text-muted">
          <tr>{head.map((h, i) => <th key={h} className={`px-4 py-2.5 font-medium ${i === head.length - 1 ? 'text-right' : ''}`}>{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((r, i) => (
            <tr key={i}>{r.map((c, j) => <td key={j} className={`px-4 py-2.5 ${j === r.length - 1 ? 'text-right font-medium tabular-nums' : ''}`}>{c}</td>)}</tr>
          ))}
          {!rows.length && <tr><td colSpan={head.length} className="px-4 py-10 text-center text-muted">{empty}</td></tr>}
        </tbody>
      </table>
    </div>
  )
}

const NOTES: Record<string, { who: string; when: string; text: string }[]> = {
  sl_priya: [{ who: 'Sara (Support)', when: '2 Jun', text: 'Asked about international payments — told her it’s on Pro, she upgraded the same day.' }],
  sl_mumbaibeats: [{ who: 'Arjun (Ops)', when: '8 Jun', text: 'Show postponed to 29 Jun. Seller says refunds will go out after the new date is confirmed. Holding settlements until refunds or transfers are offered.' }],
  sl_glowbyzara: [{ who: 'Arjun (Ops)', when: '6 Jun', text: '4 counterfeit reports with photos. Suspended. Seller asked for appeal — needs supplier invoices.' }],
}

export const args = {
  sellerId: 'sl_priya',
  tab: 'overview',
}

export const argTypes = {
  sellerId: { control: 'select', options: ['sl_priya', 'sl_fitwithrhea', 'sl_mumbaibeats', 'sl_thriftkaro', 'sl_notionwala', 'sl_bakebyanu', 'sl_glowbyzara', 'sl_inkandclay'] },
  tab: { control: 'radio', options: ['overview', 'orders', 'payments', 'subscription', 'notes'] },
}
