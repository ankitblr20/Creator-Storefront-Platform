import React from 'react'
import { AlertTriangle, ArrowRight, Download } from 'lucide-react'

import { AdminShell, Panel, Pill, Delta, Button, Bars, HealthBadge, statusTone, type AdminNav } from '../shared/admin/AdminShell'
import {
  KPIS, GMV_DAILY, SIGNUPS_DAILY, MODULE_MIX, FUNNEL, SELLERS, ORDERS, SYSTEM_HEALTH, CATEGORY_MIX, inr, inrShort, pctChange,
} from '../shared/admin/data'

type Props = Partial<typeof args> & { onNavigate?: (key: AdminNav) => void; onOpenSeller?: (id: string) => void }

export default function AdminOverview(props: Props) {
  const { showAlerts, onNavigate, onOpenSeller } = { ...args, ...props }
  const top = [...SELLERS].sort((a, b) => b.gmv30 - a.gmv30).slice(0, 6)
  const moduleMax = Math.max(...MODULE_MIX.map((m) => m.gmv))

  return (
    <AdminShell
      active="overview"
      title="Overview"
      subtitle="Riftori platform · last 30 days vs previous 30 · updated 2 min ago"
      onNavigate={onNavigate}
      actions={<Button><Download className="size-4" /> Export report</Button>}
    >
      {/* Needs attention */}
      {showAlerts && (
        <Panel className="mb-5">
          <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
            <AlertTriangle className="size-4 text-danger" />
            <h2 className="text-[13px] font-semibold">Needs attention</h2>
            <span className="text-xs text-muted">· 5 items</span>
          </div>
          <ul className="grid divide-y divide-line md:grid-cols-2 md:divide-y-0 xl:grid-cols-5 xl:divide-x">
            {ALERTS.map((a) => (
              <li key={a.text}>
                <button onClick={() => onNavigate?.(a.go)} className="flex h-full w-full flex-col items-start gap-1 px-4 py-3 text-left transition-colors duration-150 ease-out hover:bg-canvas">
                  <Pill tone={a.tone}>{a.tag}</Pill>
                  <span className="text-[13px] font-medium leading-snug">{a.text}</span>
                </button>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      {/* Headline: GMV is the business */}
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <Panel>
          <div className="p-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[13px] text-muted">GMV processed through Riftori stores</p>
                <p className="mt-1 text-3xl font-semibold tabular-nums tracking-tight">{inrShort(KPIS.gmv30)}</p>
              </div>
              <div className="text-right">
                <Delta value={pctChange(KPIS.gmv30, KPIS.gmvPrev30)} />
                <p className="text-xs text-muted">vs {inrShort(KPIS.gmvPrev30)}</p>
              </div>
            </div>
            <div className="mt-5"><Bars values={GMV_DAILY} height={150} /></div>
            <div className="mt-1.5 flex justify-between text-[11px] text-faint"><span>11 May</span><span>Weekends peak — events</span><span>Today</span></div>
          </div>
          <dl className="grid grid-cols-2 border-t border-line sm:grid-cols-4">
            <Stat label="Orders" value={KPIS.orders30.toLocaleString('en-IN')} />
            <Stat label="Avg order value" value={inr(KPIS.aov)} />
            <Stat label="Payment success" value={`${KPIS.paymentSuccess}%`} />
            <Stat label="Refund rate" value={`${KPIS.refundRate}%`} />
          </dl>
        </Panel>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-1">
          <Panel>
            <div className="p-4">
              <p className="text-[13px] text-muted">MRR (subscriptions)</p>
              <div className="mt-1 flex items-baseline justify-between">
                <p className="text-2xl font-semibold tabular-nums">{inrShort(KPIS.mrr)}</p>
                <Delta value={pctChange(KPIS.mrr, KPIS.mrrPrev)} />
              </div>
              <p className="mt-1 text-xs text-muted">ARR run-rate {inrShort(KPIS.mrr * 12)} · churn {KPIS.churn}% · trial → paid {KPIS.trialConversion}%</p>
              <button onClick={() => onNavigate?.('subscriptions')} className="mt-3 flex items-center gap-1 text-xs font-semibold text-accent">Subscriptions <ArrowRight className="size-3" /></button>
            </div>
          </Panel>
          <Panel>
            <dl className="grid grid-cols-2 divide-x divide-line">
              <div className="p-4">
                <dt className="text-[13px] text-muted">Sellers</dt>
                <dd className="mt-1 text-2xl font-semibold tabular-nums">{KPIS.activeSellers.toLocaleString('en-IN')}</dd>
                <dd className="text-xs text-muted">+{KPIS.newSellers30} new · {KPIS.trialing} on trial</dd>
              </div>
              <div className="p-4">
                <dt className="text-[13px] text-muted">Buyers</dt>
                <dd className="mt-1 text-2xl font-semibold tabular-nums">{KPIS.buyers.toLocaleString('en-IN')}</dd>
                <dd className="text-xs text-muted">+{KPIS.newBuyers30.toLocaleString('en-IN')} new</dd>
              </div>
            </dl>
            <div className="border-t border-line px-4 py-3">
              <p className="mb-2 text-xs text-muted">New sellers per day</p>
              <Bars values={SIGNUPS_DAILY} height={40} />
            </div>
          </Panel>
        </div>
      </div>

      {/* Activation, modules, categories */}
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Panel title="Seller activation (last 30 days)">
          <ol className="space-y-2.5 p-4">
            {FUNNEL.map((f, i) => (
              <li key={f.step}>
                <div className="flex justify-between text-[13px]">
                  <span>{f.step}</span>
                  <span className="tabular-nums text-muted">
                    {f.count}
                    {i > 0 && <span className="ml-2 text-xs">{Math.round((f.count / FUNNEL[i - 1].count) * 100)}%</span>}
                  </span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-canvas">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${(f.count / FUNNEL[0].count) * 100}%` }} />
                </div>
              </li>
            ))}
          </ol>
          <p className="border-t border-line px-4 py-2.5 text-xs text-muted">Biggest drop: <span className="font-medium text-ink">Razorpay connect (35% lost)</span></p>
        </Panel>

        <Panel title="GMV by module">
          <ul className="space-y-3 p-4">
            {MODULE_MIX.map((m) => (
              <li key={m.module}>
                <div className="flex justify-between text-[13px]">
                  <span className="font-medium">{m.module}</span>
                  <span className="tabular-nums">{inrShort(m.gmv)}</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-canvas">
                  <div className="h-full rounded-full bg-ink/70" style={{ width: `${(m.gmv / moduleMax) * 100}%` }} />
                </div>
                <p className="mt-0.5 text-xs text-muted">{m.orders.toLocaleString('en-IN')} orders · {m.sellers} sellers</p>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="By seller category">
          <table className="w-full text-[13px]">
            <tbody className="divide-y divide-line">
              {CATEGORY_MIX.map((c) => (
                <tr key={c.category}>
                  <td className="px-4 py-2.5">{c.category}</td>
                  <td className="px-2 py-2.5 text-right tabular-nums text-muted">{c.sellers}</td>
                  <td className="px-4 py-2.5 text-right font-medium tabular-nums">{inrShort(c.gmv)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>

      {/* Top sellers + live orders */}
      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Panel title="Top sellers by GMV" action={<button onClick={() => onNavigate?.('sellers')} className="text-xs font-semibold text-accent">All sellers</button>}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-[13px]">
              <thead className="text-left text-xs text-muted">
                <tr><th className="px-4 py-2 font-medium">Store</th><th className="px-2 py-2 font-medium">Plan</th><th className="px-2 py-2 text-right font-medium">GMV 30d</th><th className="px-2 py-2 text-right font-medium">Δ</th><th className="px-4 py-2 text-right font-medium">Health</th></tr>
              </thead>
              <tbody className="divide-y divide-line">
                {top.map((s) => (
                  <tr key={s.id} onClick={() => onOpenSeller?.(s.id)} className="cursor-pointer hover:bg-canvas">
                    <td className="px-4 py-2.5">
                      <p className="font-medium">{s.store}</p>
                      <p className="text-xs text-muted">{s.category} · {s.city}</p>
                    </td>
                    <td className="px-2 py-2.5"><Pill tone={s.plan === 'Business' ? 'info' : 'neutral'}>{s.plan}</Pill></td>
                    <td className="px-2 py-2.5 text-right font-medium tabular-nums">{inr(s.gmv30)}</td>
                    <td className="px-2 py-2.5 text-right"><Delta value={pctChange(s.gmv30, s.gmvPrev30)} /></td>
                    <td className="px-4 py-2.5 text-right"><HealthBadge value={s.health} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Latest orders across all stores" action={<button onClick={() => onNavigate?.('buyers')} className="text-xs font-semibold text-accent">All orders</button>}>
          <ul className="divide-y divide-line">
            {ORDERS.slice(0, 7).map((o) => (
              <li key={o.id} className="flex items-center gap-3 px-4 py-2.5 text-[13px]">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{o.buyer} <span className="font-normal text-muted">→ {o.seller}</span></p>
                  <p className="truncate text-xs text-muted">{o.id} · {o.item} · {o.time}</p>
                </div>
                <Pill tone={statusTone(o.status)}>{o.status}</Pill>
                <span className="w-16 text-right font-medium tabular-nums">{inr(o.amount)}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {/* Systems */}
      <Panel title="System health" className="mt-5">
        <ul className="grid grid-cols-2 divide-line sm:grid-cols-3 lg:grid-cols-5 lg:divide-x">
          {SYSTEM_HEALTH.map((h) => (
            <li key={h.name} className="px-4 py-3">
              <p className="flex items-center gap-1.5 text-xs text-muted">
                <span className={`size-1.5 rounded-full ${h.ok ? 'bg-accent' : 'bg-warn'}`} /> {h.name}
              </p>
              <p className={`mt-0.5 text-[15px] font-semibold ${h.ok ? '' : 'text-warn'}`}>{h.value}</p>
            </li>
          ))}
        </ul>
      </Panel>
    </AdminShell>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-line px-5 py-3 [&:not(:last-child)]:border-r">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-0.5 text-[15px] font-semibold tabular-nums">{value}</dd>
    </div>
  )
}

const ALERTS: { tag: string; tone: 'danger' | 'warn' | 'info'; text: string; go: AdminNav }[] = [
  { tag: 'SLA breached', tone: 'danger', text: '2 tickets over 24 h — refund dispute on MB-88120', go: 'support' },
  { tag: 'Chargeback', tone: 'danger', text: '₹5,998 card dispute · respond by 14 Jun', go: 'transactions' },
  { tag: 'Risk', tone: 'warn', text: 'Mumbai Beats Live: 38 refund requests after postponement', go: 'risk' },
  { tag: 'Billing', tone: 'warn', text: 'Bake by Anu renewal failed 3×, store goes read-only 12 Jun', go: 'subscriptions' },
  { tag: 'KYC', tone: 'info', text: '3 sellers stuck in Razorpay KYC — can’t take payments', go: 'risk' },
]

export const args = {
  showAlerts: true,
}

export const argTypes = {
  showAlerts: { control: 'boolean' },
}
