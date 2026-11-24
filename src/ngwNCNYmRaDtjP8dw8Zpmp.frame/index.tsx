import React, { useMemo, useState } from 'react'
import { Download, Search, ArrowUpDown } from 'lucide-react'

import { AdminShell, Panel, Pill, Delta, Button, HealthBadge, statusTone, type AdminNav } from '../shared/admin/AdminShell'
import { SELLERS, KPIS, inr, pctChange, type SellerStatus, type Plan, type Module } from '../shared/admin/data'

type SortKey = 'gmv' | 'health' | 'refund' | 'orders'

type Props = Partial<typeof args> & { onNavigate?: (key: AdminNav) => void; onOpenSeller?: (id: string) => void }

export default function Sellers(props: Props) {
  const { status: initialStatus, onNavigate, onOpenSeller } = { ...args, ...props }
  const [status, setStatus] = useState<'All' | SellerStatus>(initialStatus as 'All' | SellerStatus)
  const [plan, setPlan] = useState<'All' | Plan>('All')
  const [module, setModule] = useState<'All' | Module>('All')
  const [q, setQ] = useState('')
  const [sort, setSort] = useState<SortKey>('gmv')

  const rows = useMemo(() => {
    const list = SELLERS.filter(
      (s) =>
        (status === 'All' || s.status === status) &&
        (plan === 'All' || s.plan === plan) &&
        (module === 'All' || s.modules.includes(module)) &&
        (s.store + s.owner + s.email + s.phone + s.handle + s.city).toLowerCase().includes(q.toLowerCase()),
    )
    const by: Record<SortKey, (a: (typeof SELLERS)[number]) => number> = {
      gmv: (a) => a.gmv30,
      health: (a) => a.health,
      refund: (a) => a.refundRate,
      orders: (a) => a.orders30,
    }
    return list.sort((a, b) => by[sort](b) - by[sort](a))
  }, [status, plan, module, q, sort])

  const count = (s: SellerStatus) => SELLERS.filter((x) => x.status === s).length

  return (
    <AdminShell
      active="sellers"
      title="Sellers"
      subtitle={`${KPIS.activeSellers.toLocaleString('en-IN')} active · ${KPIS.trialing} on trial · +${KPIS.newSellers30} joined in 30 days`}
      onNavigate={onNavigate}
      actions={<Button><Download className="size-4" /> Export CSV</Button>}
    >
      {/* Status tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-line [scrollbar-width:none]">
        {(['All', 'Active', 'Trial', 'Past due', 'Suspended', 'Churned'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`-mb-px flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap border-b-2 px-3 text-[13px] ${
              status === s ? 'border-ink font-semibold' : 'border-transparent text-muted hover:text-ink'
            }`}
          >
            {s}
            <span className="text-xs text-faint">{s === 'All' ? SELLERS.length : count(s)}</span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <label className="flex h-8 min-w-0 flex-1 items-center gap-2 rounded-md bg-surface px-2.5 ring-1 ring-line focus-within:ring-accent sm:max-w-xs">
          <Search className="size-3.5 text-faint" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Store, owner, email, phone, city" className="min-w-0 flex-1 bg-transparent text-[13px] outline-none" />
        </label>
        <Select value={plan} onChange={(v) => setPlan(v as 'All' | Plan)} options={['All', 'Trial', 'Starter', 'Pro', 'Business']} label="Plan" />
        <Select value={module} onChange={(v) => setModule(v as 'All' | Module)} options={['All', 'Events', 'Meetings', 'Digital', 'Physical']} label="Sells" />
        <Select value={sort} onChange={(v) => setSort(v as SortKey)} options={['gmv', 'orders', 'health', 'refund']} label="Sort" labels={{ gmv: 'GMV', orders: 'Orders', health: 'Health', refund: 'Refund rate' }} />
        <span className="ml-auto text-xs text-muted">{rows.length} shown</span>
      </div>

      <Panel className="mt-3">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1040px] text-[13px]">
            <thead className="border-b border-line text-left text-xs text-muted">
              <tr>
                <th className="px-4 py-2.5 font-medium">Store / owner</th>
                <th className="px-2 py-2.5 font-medium">Plan</th>
                <th className="px-2 py-2.5 font-medium">Status</th>
                <th className="px-2 py-2.5 font-medium">Razorpay</th>
                <th className="px-2 py-2.5 font-medium">Sells</th>
                <th className="px-2 py-2.5 text-right font-medium"><span className="inline-flex items-center gap-1">GMV 30d <ArrowUpDown className="size-3" /></span></th>
                <th className="px-2 py-2.5 text-right font-medium">Orders</th>
                <th className="px-2 py-2.5 text-right font-medium">Buyers</th>
                <th className="px-2 py-2.5 text-right font-medium">Refunds</th>
                <th className="px-2 py-2.5 text-right font-medium">Health</th>
                <th className="px-4 py-2.5 font-medium">Last active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((s) => (
                <tr key={s.id} onClick={() => onOpenSeller?.(s.id)} className="cursor-pointer transition-colors duration-100 hover:bg-canvas">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2.5">
                      {s.avatar ? (
                        <img src={s.avatar} alt="" className="size-8 shrink-0 rounded-full object-cover" />
                      ) : (
                        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-canvas text-[11px] font-semibold text-muted">
                          {s.store.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="truncate font-medium">{s.store}</p>
                        <p className="truncate text-xs text-muted">{s.owner} · {s.city}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-2.5"><Pill tone={s.plan === 'Business' ? 'info' : s.plan === 'Trial' ? 'neutral' : 'ok'}>{s.plan}</Pill></td>
                  <td className="px-2 py-2.5"><Pill tone={statusTone(s.status)}>{s.status}</Pill></td>
                  <td className="px-2 py-2.5"><Pill tone={statusTone(s.razorpay)}>{s.razorpay}</Pill></td>
                  <td className="px-2 py-2.5 text-xs text-muted">{s.modules.map((m) => m[0]).join(' · ')}</td>
                  <td className="px-2 py-2.5 text-right">
                    <p className="font-medium tabular-nums">{inr(s.gmv30)}</p>
                    <Delta value={pctChange(s.gmv30, s.gmvPrev30)} />
                  </td>
                  <td className="px-2 py-2.5 text-right tabular-nums">{s.orders30.toLocaleString('en-IN')}</td>
                  <td className="px-2 py-2.5 text-right tabular-nums">{s.buyers.toLocaleString('en-IN')}</td>
                  <td className={`px-2 py-2.5 text-right tabular-nums ${s.refundRate > 3 ? 'font-semibold text-danger' : ''}`}>{s.refundRate}%</td>
                  <td className="px-2 py-2.5 text-right"><HealthBadge value={s.health} /></td>
                  <td className="whitespace-nowrap px-4 py-2.5 text-xs text-muted">{s.lastActive}</td>
                </tr>
              ))}
              {!rows.length && <tr><td colSpan={11} className="px-4 py-12 text-center text-muted">No sellers match these filters.</td></tr>}
            </tbody>
          </table>
        </div>
      </Panel>
      <p className="mt-2 text-xs text-muted">Sells: E events · M meetings · D digital · P physical. Health blends activity, refund & dispute rate, payment setup and plan status.</p>
    </AdminShell>
  )
}

function Select({ value, onChange, options, label, labels }: { value: string; onChange: (v: string) => void; options: string[]; label: string; labels?: Record<string, string> }) {
  return (
    <label className="flex h-8 items-center gap-1.5 rounded-md bg-surface pl-2.5 pr-1 text-[13px] ring-1 ring-line">
      <span className="text-muted">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="bg-transparent font-medium outline-none">
        {options.map((o) => <option key={o} value={o}>{labels?.[o] ?? o}</option>)}
      </select>
    </label>
  )
}

export const args = {
  status: 'All',
}

export const argTypes = {
  status: { control: 'select', options: ['All', 'Active', 'Trial', 'Past due', 'Suspended', 'Churned'] },
}
