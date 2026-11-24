import React from 'react'

/** A QR-style code drawn from a seed (illustrative — not scannable) */
export function QR({ seed = 7, className = 'size-28', label = 'QR code' }: { seed?: number; className?: string; label?: string }) {
  const n = 21
  const finders = [[0, 0], [n - 7, 0], [0, n - 7]]
  let s = seed
  const rects: React.ReactNode[] = []
  for (let i = 0; i < n * n; i++) {
    s = (s * 9301 + 49297) % 233280
    const x = i % n
    const y = Math.floor(i / n)
    const f = finders.find(([fx, fy]) => x >= fx && x < fx + 7 && y >= fy && y < fy + 7)
    let on = s / 233280 > 0.52
    if (f) {
      const dx = x - f[0]
      const dy = y - f[1]
      on = dx === 0 || dy === 0 || dx === 6 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4)
    }
    if (on) rects.push(<rect key={i} x={x} y={y} width={1} height={1} fill="#1b1d1c" />)
  }
  return (
    <svg viewBox={`-1 -1 ${n + 2} ${n + 2}`} className={`rounded-lg bg-white ${className}`} aria-label={label}>
      {rects}
    </svg>
  )
}
