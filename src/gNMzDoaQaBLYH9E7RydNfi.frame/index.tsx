import React from 'react'
import { Download, RefreshCw, Mail } from 'lucide-react'

import { AdminShell, Panel, Pill, Delta, Button, type AdminNav } from '../shared/admin/AdminShell'
import {
  KPIS, PLAN_MIX, MRR_MOVEMENT, MRR_MONTHLY, INVOICES, TRIALS_ENDING, HEARD_MIX, REFERRAL_STATS, TOP_REFERRERS, inr, inrShort, pctChange,
} from '../shared/admin/data'

type Props = Partial<typeof args> & { onNavigate?: (key: AdminNav) => void }

export default function Subscriptions(props: Props) {
  const { onNavigate } = { ...args, ...props }
  const maxMrr = Math.max(...MRR_MONTHLY.map((m) => m.mrr))
  const paying = PLAN_MIX.filter((p) => p.plan !== 'Trial').reduce((s, p) => s + p.sellers, 0)
  const net = MRR_MOVEMENT.reduce((s, m) => s + m.value, 0)

  return (
    <AdminShell
      active="subscriptions"
      title="Subscriptions"
      subtitle="Riftori’s own revenue: seller plans billed monthly. 0% commission on sales."
      onNavigate={onNavigate}
      actions={<Button><Download className="size-4" /> Export invoices</Button>}
    >
      <Panel>
        <dl className="grid grid-cols-2 divide-line sm:grid-cols-3 lg:grid-cols-6 lg:divide-x">
          <K label="MRR" value={inrShort(KPIS.mrr)} extra={<Delta value={pctChange(KPIS.mrr, KPIS.mrrPrev)} />} />
          <K label="ARR run-rate" value={inrShort(KPIS.mrr * 12)} />
          <K label="Paying sellers" value={paying.toLocaleString('en-IN')} />
          <K label="ARPU" value={inr(KPIS.mrr / paying)} />
          <K label="Trial → paid" value={`${KPIS.trialConversion}%`} />
          <K label="Monthly churn" value={`${KPIS.churn}%`} />
        </dl>
      </Panel>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <Panel title="MRR, last 6 months">
          <div className="flex h-48 items-end gap-4 p-5">
            {MRR_MONTHLY.map((m, i) => (
              <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-[11px] tabular-nums text-muted">{inrShort(m.mrr)}</span>
                <div className={`w-full rounded-t ${i === MRR_MONTHLY.length - 1 ? 'bg-accent' : 'bg-accent/30'}`} style={{ height: `${(m.mrr / maxMrr) * 120}px` }} />
                <span className="text-xs text-muted">{m.month}</span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="This month’s MRR movement">
          <ul className="divide-y divide-line text-[13px]">
            {MRR_MOVEMENT.map((m) => (
              <li key={m.label} className="flex justify-between px-4 py-2.5">
                <span>{m.label}</span>
                <span className={`font-medium tabular-nums ${m.value < 0 ? 'text-danger' : 'text-accent'}`}>{m.value < 0 ? '−' : '+'}{inr(Math.abs(m.value))}</span>
              </li>
            ))}
            <li className="flex justify-between px-4 py-2.5 font-semibold"><span>Net new MRR</span><span className="tabular-nums">+{inr(net)}</span></li>
          </ul>
        </Panel>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Panel title="Plan mix">
          <table className="w-full text-[13px]">
            <thead className="text-left text-xs text-muted"><tr><th className="px-4 py-2 font-medium">Plan</th><th className="px-2 py-2 text-right font-medium">Sellers</th><th className="px-2 py-2 text-right font-medium">Price</th><th className="px-4 py-2 text-right font-medium">MRR</th></tr></thead>
            <tbody className="divide-y divide-line">
              {PLAN_MIX.map((p) => (
                <tr key={p.plan}>
                  <td className="px-4 py-2.5 font-medium">{p.plan}</td>
                  <td className="px-2 py-2.5 text-right tabular-nums">{p.sellers.toLocaleString('en-IN')}</td>
                  <td className="px-2 py-2.5 text-right tabular-nums text-muted">{p.plan === 'Trial' ? '14 days free' : inr(p.mrr / p.sellers)}</td>
                  <td className="px-4 py-2.5 text-right font-medium tabular-nums">{inr(p.mrr)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel title="Trials ending this week" action={<Button><Mail className="size-4" /> Nudge all</Button>}>
          <ul className="divide-y divide-line text-[13px]">
            {TRIALS_ENDING.map((t) => (
              <li key={t.store} className="flex items-center gap-3 px-4 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{t.store}</p>
                  <p className="text-xs text-muted">{t.owner} · {t.sales} sales · {inr(t.gmv)} GMV</p>
                </div>
                <span className="text-xs text-muted">in {t.endsIn}</span>
                <Pill tone={t.likely === 'High' ? 'ok' : t.likely === 'Medium' ? 'warn' : 'danger'}>{t.likely}</Pill>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {/* Acquisition */}
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Panel title="How new sellers heard about us (30 days)">
          <table className="w-full text-[13px]">
            <thead className="text-left text-xs text-muted"><tr><th className="px-4 py-2 font-medium">Source</th><th className="px-2 py-2 text-right font-medium">Sign-ups</th><th className="px-2 py-2 text-right font-medium">Paid</th><th className="px-4 py-2 text-right font-medium">Conversion</th></tr></thead>
            <tbody className="divide-y divide-line">
              {HEARD_MIX.map((h) => {
                const conv = Math.round((h.paid / h.sellers) * 100)
                return (
                  <tr key={h.source}>
                    <td className="px-4 py-2.5">{h.source}</td>
                    <td className="px-2 py-2.5 text-right tabular-nums">{h.sellers}</td>
                    <td className="px-2 py-2.5 text-right tabular-nums">{h.paid}</td>
                    <td className={`px-4 py-2.5 text-right font-medium tabular-nums ${conv >= 30 ? 'text-accent' : ''}`}>{conv}%</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <p className="border-t border-line px-4 py-2.5 text-xs text-muted">Referrals convert best — {Math.round((58 / 156) * 100)}% go on to pay vs 17% from Instagram.</p>
        </Panel>

        <Panel title="Referral programme · give 2 months, get 2 months">
          <dl className="grid grid-cols-2 divide-line border-b border-line sm:grid-cols-4 sm:divide-x">
            <K label="Referred sign-ups" value={String(REFERRAL_STATS.signups30)} />
            <K label="Became paid" value={`${REFERRAL_STATS.paid30} · ${REFERRAL_STATS.conversion}%`} />
            <K label="Free months given" value={String(REFERRAL_STATS.monthsCredited30)} />
            <K label="Cost (MRR forgone)" value={inr(REFERRAL_STATS.costMonthly)} />
          </dl>
          <table className="w-full text-[13px]">
            <thead className="text-left text-xs text-muted"><tr><th className="px-4 py-2 font-medium">Top referrers</th><th className="px-2 py-2 font-medium">Code</th><th className="px-2 py-2 text-right font-medium">Sign-ups</th><th className="px-2 py-2 text-right font-medium">Paid</th><th className="px-4 py-2 text-right font-medium">Months earned</th></tr></thead>
            <tbody className="divide-y divide-line">
              {[...TOP_REFERRERS].sort((a, b) => b.signups - a.signups).map((r) => (
                <tr key={r.code}>
                  <td className="px-4 py-2.5 font-medium">{r.store}</td>
                  <td className="px-2 py-2.5 font-mono text-xs">{r.code}</td>
                  <td className="px-2 py-2.5 text-right tabular-nums">{r.signups}</td>
                  <td className="px-2 py-2.5 text-right tabular-nums">{r.paid}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">{r.months}{r.months >= 12 && <span className="ml-1.5"><Pill tone="warn">Cap</Pill></span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>

      <Panel title="Recent invoices" className="mt-5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-[13px]">
            <thead className="border-b border-line text-left text-xs text-muted"><tr><th className="px-4 py-2.5 font-medium">Invoice</th><th className="px-2 py-2.5 font-medium">Seller</th><th className="px-2 py-2.5 font-medium">Plan</th><th className="px-2 py-2.5 font-medium">Date</th><th className="px-2 py-2.5 font-medium">Status</th><th className="px-2 py-2.5 font-medium">Note</th><th className="px-2 py-2.5 text-right font-medium">Amount (incl. GST)</th><th className="px-4 py-2.5" /></tr></thead>
            <tbody className="divide-y divide-line">
              {INVOICES.map((i) => (
                <tr key={i.id}>
                  <td className="px-4 py-2.5 font-mono text-xs">{i.id}</td>
                  <td className="px-2 py-2.5 font-medium">{i.seller}</td>
                  <td className="px-2 py-2.5">{i.plan}</td>
                  <td className="px-2 py-2.5 text-muted">{i.date}</td>
                  <td className="px-2 py-2.5"><Pill tone={i.status === 'Paid' ? 'ok' : i.status === 'Failed' ? 'danger' : 'neutral'}>{i.status}</Pill></td>
                  <td className="max-w-[260px] truncate px-2 py-2.5 text-muted">{i.note}</td>
                  <td className="px-2 py-2.5 text-right font-medium tabular-nums">{inr(i.amount)}</td>
                  <td className="px-4 py-2.5 text-right">{i.status === 'Failed' && <Button><RefreshCw className="size-3.5" /> Retry</Button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </AdminShell>
  )
}

function K({ label, value, extra }: { label: string; value: string; extra?: React.ReactNode }) {
  return (
    <div className="px-4 py-3">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-0.5 text-lg font-semibold tabular-nums">{value}</dd>
      {extra}
    </div>
  )
}

export const args = {}

export const argTypes = {}
