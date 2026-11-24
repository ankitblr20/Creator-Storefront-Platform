import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

import { STORE, IMAGES, formatINR } from '../../shared/storefront/data'

/** The hero visual: the seller's link with real sales arriving under it — what Riftori is for, without a device mock-up */
export function LiveSales() {
  const reduce = useReducedMotion()
  const [count, setCount] = useState(3)

  useEffect(() => {
    if (reduce) return
    const t = setInterval(() => setCount((c) => c + 1), 2400)
    return () => clearInterval(t)
  }, [reduce])

  const visible = Array.from({ length: 3 }, (_, i) => {
    const n = count - 1 - i
    return { key: n, ...SALES[((n % SALES.length) + SALES.length) % SALES.length] }
  })
  let earned = 124020
  for (let n = 3; n < count; n++) earned += SALES[n % SALES.length].amount

  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* Photo collage — the things being sold */}
      <div className="grid grid-cols-3 gap-3">
        {[IMAGES.workshop, IMAGES.tote, IMAGES.pattern].map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            className={`aspect-[3/4] w-full rounded-2xl object-cover ${i === 1 ? 'translate-y-6' : ''}`}
          />
        ))}
      </div>

      {/* Link + live sales */}
      <div className="relative -mt-10 rounded-2xl bg-surface p-4 shadow-[0_12px_40px_-12px_rgba(27,29,28,0.25)] ring-1 ring-line sm:mx-4">
        <div className="flex items-center justify-between gap-3">
          <p className="min-w-0 truncate text-sm font-semibold">{STORE.link}</p>
          <span className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-accent">
            <span className="relative flex size-2">
              {!reduce && <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />}
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            Live
          </span>
        </div>

        <ul className="mt-3 h-[192px] overflow-hidden">
          <AnimatePresence initial={false}>
            {visible.map((s) => (
              <motion.li
                key={s.key}
                layout={!reduce}
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                className="mb-2 flex items-center gap-3 rounded-xl bg-canvas px-3 py-2.5"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent-soft text-xs font-semibold text-accent-ink">{s.initials}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{s.who} {s.verb}</p>
                  <p className="truncate text-xs text-muted">{s.what} · UPI</p>
                </div>
                <p className="shrink-0 text-sm font-semibold tabular-nums text-accent">+{formatINR(s.amount)}</p>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        <div className="flex items-baseline justify-between border-t border-line pt-3">
          <span className="text-xs text-muted">Earned this month</span>
          <span className="text-sm">
            <span className="font-semibold tabular-nums">{formatINR(earned)}</span>
            <span className="ml-2 text-xs text-muted">₹0 commission</span>
          </span>
        </div>
      </div>
    </div>
  )
}

const SALES = [
  { initials: 'AR', who: 'Ananya', verb: 'booked 2 seats', what: 'Saturday Amigurumi Workshop', amount: 3600 },
  { initials: 'KM', who: 'Kavya', verb: 'ordered', what: 'Striped market tote', amount: 1850 },
  { initials: 'MK', who: 'Meher', verb: 'downloaded', what: 'Sunflower granny square pattern', amount: 249 },
  { initials: 'RI', who: 'Rohit', verb: 'booked a call', what: 'Stuck on a pattern? 1:1', amount: 600 },
  { initials: 'IB', who: 'Ishita', verb: 'enrolled', what: 'Crochet from zero course', amount: 1499 },
  { initials: 'NK', who: 'Neha', verb: 'ordered', what: 'Chai coaster set × 2', amount: 1300 },
]
