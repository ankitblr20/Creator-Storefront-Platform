import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Download, Instagram, Sparkles, Mail, Phone, ChevronDown } from 'lucide-react'

import { StatusPill } from './Shell'
import { buyersFor } from './buyers'
import { findItem, formatINR, kindLabel } from '../storefront/data'

/** Side panel: everyone who bought one item, with their contact details one tap away. */
export function BuyersDrawer({ itemId, onClose }: { itemId: string | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {itemId && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={onClose} className="fixed inset-0 z-40 bg-ink/30" />
          <motion.aside
            key={itemId}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
            role="dialog"
            aria-modal="true"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-surface shadow-xl"
          >
            <Panel itemId={itemId} onClose={onClose} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function Panel({ itemId, onClose }: { itemId: string; onClose: () => void }) {
  const item = findItem(itemId)
  const buyers = buyersFor(itemId)
  const [open, setOpen] = useState<string | null>(buyers[0]?.name ?? null)
  const agentCount = buyers.filter((b) => b.viaAgent).length

  return (
    <>
      <div className="flex items-start gap-3 border-b border-line px-5 py-4">
        {item.image ? <img src={item.image} alt="" className="size-12 shrink-0 rounded-lg object-cover" /> : <div className="size-12 shrink-0 rounded-lg bg-canvas" />}
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted">{kindLabel(item.type)}</p>
          <h2 className="truncate font-semibold">{item.title}</h2>
          <p className="mt-0.5 text-sm text-muted"><span className="font-medium text-ink">{item.sold} bought</span> · {formatINR(item.revenue)} · {item.views.toLocaleString('en-IN')} views</p>
        </div>
        <button aria-label="Close" onClick={onClose} className="grid size-9 shrink-0 place-items-center rounded-lg hover:bg-canvas"><X className="size-5" /></button>
      </div>

      <div className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
        <p className="text-muted">
          {agentCount > 0 && <span className="inline-flex items-center gap-1"><Sparkles className="size-3.5" /> {agentCount} paid by a buyer’s agent</span>}
        </p>
        <button className="flex items-center gap-1.5 font-medium text-accent hover:text-accent-ink"><Download className="size-4" /> Export</button>
      </div>

      <ul className="flex-1 divide-y divide-line overflow-y-auto border-t border-line">
        {buyers.map((b) => {
          const expanded = open === b.name
          return (
            <li key={b.name}>
              <button onClick={() => setOpen(expanded ? null : b.name)} aria-expanded={expanded} className="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors duration-150 ease-out hover:bg-canvas/60">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-canvas text-xs font-semibold text-muted">{b.name.split(' ').map((p) => p[0]).join('')}</span>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 truncate text-sm font-medium">
                    {b.name}
                    {b.viaAgent && <Sparkles className="size-3 shrink-0 text-muted" aria-label="Paid by agent" />}
                  </p>
                  <p className="truncate text-xs text-muted">{b.detail} · {b.when}</p>
                </div>
                <span className="shrink-0 text-sm font-medium tabular-nums">{b.amount === 0 ? 'Free' : formatINR(b.amount)}</span>
                <ChevronDown className={`size-4 shrink-0 text-faint transition-transform duration-150 ease-out ${expanded ? 'rotate-180' : ''}`} />
              </button>
              {expanded && (
                <div className="space-y-2 bg-canvas/50 px-5 pb-4 pl-[68px] pt-1 text-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusPill status={b.status} />
                    <span className="text-xs text-muted">{b.city} · {b.orders === 1 ? 'First order' : `${b.orders} orders with you`}{b.viaAgent ? ' · bought via agent' : ''}</span>
                  </div>
                  <p className="flex items-center gap-2 text-muted"><Mail className="size-3.5" /> {b.email}</p>
                  {b.phone && <p className="flex items-center gap-2 text-muted"><Phone className="size-3.5" /> {b.phone}</p>}
                  <a href="#" className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-surface px-3 text-xs font-medium ring-1 ring-line transition-colors duration-150 ease-out hover:bg-canvas">
                    <Instagram className="size-3.5" /> Message @{b.instagram}
                  </a>
                </div>
              )}
            </li>
          )
        })}
        {item.sold > buyers.length && (
          <li className="px-5 py-4 text-center text-sm text-muted">+ {item.sold - buyers.length} earlier buyers in Customers</li>
        )}
      </ul>
    </>
  )
}
