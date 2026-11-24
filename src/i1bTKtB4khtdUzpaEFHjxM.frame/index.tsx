import React, { useState } from 'react'
import { ShieldAlert } from 'lucide-react'

import { AdminShell, Panel, Pill, Button, statusTone, type AdminNav } from '../shared/admin/AdminShell'
import { RISK_FLAGS, KYC_QUEUE, REPORTS, AUDIT_LOG, inr } from '../shared/admin/data'

type Props = Partial<typeof args> & { onNavigate?: (key: AdminNav) => void; onOpenSeller?: (id: string) => void }

export default function RiskAndModeration(props: Props) {
  const { onNavigate, onOpenSeller } = { ...args, ...props }
  const [reports, setReports] = useState(REPORTS)
  const exposure = RISK_FLAGS.reduce((s, r) => s + r.exposure, 0)

  return (
    <AdminShell
      active="risk"
      title="Risk & moderation"
      subtitle="Stores that could hurt buyers or Riftori’s standing with Razorpay. Review daily."
      onNavigate={onNavigate}
    >
      <Panel>
        <dl className="grid grid-cols-2 divide-line sm:grid-cols-4 sm:divide-x">
          <K label="Open risk flags" value={String(RISK_FLAGS.length)} bad />
          <K label="Money at risk" value={inr(exposure)} bad />
          <K label="KYC stuck" value={String(KYC_QUEUE.length)} />
          <K label="New buyer reports" value={String(reports.filter((r) => r.status === 'New').length)} />
        </dl>
      </Panel>

      <Panel title="Flagged stores" className="mt-5">
        <ul className="divide-y divide-line">
          {RISK_FLAGS.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
              <ShieldAlert className={`size-5 shrink-0 ${r.severity === 'Critical' ? 'text-danger' : 'text-warn'}`} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[13px] font-semibold">{r.store}</p>
                  <Pill tone={statusTone(r.severity)}>{r.severity}</Pill>
                  <Pill tone="neutral">{r.action}</Pill>
                </div>
                <p className="mt-0.5 text-[13px] text-muted">{r.reason}</p>
                <p className="text-xs text-faint">Since {r.since} · {inr(r.exposure)} exposed</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => onOpenSeller?.(r.sellerId)}>Review store</Button>
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Panel title="Buyer reports">
          <ul className="divide-y divide-line">
            {reports.map((r) => (
              <li key={r.id} className="flex items-center gap-3 px-4 py-2.5 text-[13px]">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{r.store} <span className="font-normal text-muted">· {r.reason}</span></p>
                  <p className="text-xs text-muted">by {r.by} · {r.when}</p>
                </div>
                {r.status === 'New' ? (
                  <div className="flex gap-1.5">
                    <Button onClick={() => setReports((all) => all.map((x) => (x.id === r.id ? { ...x, status: 'In review' } : x)))}>Review</Button>
                    <Button onClick={() => setReports((all) => all.map((x) => (x.id === r.id ? { ...x, status: 'Dismissed' } : x)))}>Dismiss</Button>
                  </div>
                ) : (
                  <Pill tone={statusTone(r.status)}>{r.status}</Pill>
                )}
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Razorpay KYC queue">
          <ul className="divide-y divide-line">
            {KYC_QUEUE.map((k) => (
              <li key={k.store} className="flex items-center gap-3 px-4 py-2.5 text-[13px]">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{k.store}</p>
                  <p className="text-xs text-muted">{k.owner} · submitted {k.submitted} · {k.issue}</p>
                </div>
                <span className="text-xs text-muted">{k.waiting}</span>
                <Button>Nudge</Button>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel title="Rules running automatically" className="mt-5">
        <ul className="grid gap-px bg-line text-[13px] sm:grid-cols-2">
          {RULES.map((r) => (
            <li key={r} className="bg-surface px-4 py-2.5">{r}</li>
          ))}
        </ul>
      </Panel>

      <Panel title="Admin audit log" className="mt-5">
        <ul className="divide-y divide-line">
          {AUDIT_LOG.map((a, i) => (
            <li key={i} className="flex justify-between gap-4 px-4 py-2.5 text-[13px]">
              <span><span className="font-medium">{a.who}</span> <span className="text-muted">{a.what}</span></span>
              <span className="shrink-0 text-xs text-muted">{a.when}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </AdminShell>
  )
}

function K({ label, value, bad }: { label: string; value: string; bad?: boolean }) {
  return (
    <div className="px-4 py-3">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className={`mt-0.5 text-lg font-semibold tabular-nums ${bad ? 'text-danger' : ''}`}>{value}</dd>
    </div>
  )
}

const RULES = [
  'Flag a store when refund rate exceeds 3% over 30 days',
  'Hold settlements when an event is postponed with 10+ refund requests',
  'Flag listings with “guaranteed income”, “100% returns” and similar claims',
  'Alert on any chargeback; auto-assign to Ops',
  'Flag new stores selling over ₹50,000 in their first 7 days',
  'Block prohibited categories: weapons, drugs, adult, counterfeit brands',
]

export const args = {}

export const argTypes = {}
