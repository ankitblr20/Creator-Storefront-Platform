import React, { useState } from 'react'
import { Minus, Plus, Trash2, ShoppingBag, Truck } from 'lucide-react'

import { TopBar } from '../shared/buyer/TopBar'
import { ItemImage } from '../shared/buyer/ProductCard'
import { findItem, formatINR, typeLabel, bagTotals, type BagLine } from '../shared/storefront/data'

type Props = Omit<Partial<typeof args>, 'lines'> & {
  lines?: BagLine[]
  onBack?: () => void
  onCheckout?: () => void
  onOpen?: (id: string) => void
  onChange?: (lines: BagLine[]) => void
}

export default function Bag(props: Props) {
  const { lines: initial, onBack, onCheckout, onOpen, onChange } = { ...args, ...props }
  const [local, setLocal] = useState<BagLine[]>(initial)
  const lines = props.onChange ? initial : local
  const update = (next: BagLine[]) => {
    setLocal(next)
    onChange?.(next)
  }
  const { subtotal, shipping, total, count, hasPhysical } = bagTotals(lines)

  return (
    <main className="flex min-h-full flex-col bg-paper">
      <TopBar bagCount={count} onBack={onBack} title="Your bag" />

      {lines.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 py-24 text-center">
          <ShoppingBag className="size-8 text-faint" strokeWidth={1.5} />
          <h1 className="text-lg font-semibold">Your bag is empty</h1>
          <p className="text-sm text-muted">Kits, handmade pieces and patterns you add show up here.</p>
          <button onClick={onBack} className="mt-2 h-11 rounded-full bg-brand px-6 text-sm font-semibold text-white transition-colors duration-150 ease-out hover:bg-brand-ink">
            Keep shopping
          </button>
        </div>
      ) : (
        <div className="mx-auto w-full max-w-5xl flex-1 lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10 lg:px-4 lg:pt-6">
          <ul className="divide-y divide-line px-4 lg:px-0">
            {lines.map((l) => {
              const item = findItem(l.id)
              const physical = item.type === 'physical'
              return (
                <li key={l.id + (l.option ?? '')} className="flex gap-3 py-4">
                  <button onClick={() => onOpen?.(item.id)} className="size-20 shrink-0 overflow-hidden rounded-xl">
                    <ItemImage item={item} />
                  </button>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="text-[11px] font-medium text-brand">{typeLabel(item.type)}</p>
                    <h2 className="text-sm font-semibold leading-snug">{item.title}</h2>
                    <p className="text-xs text-muted">{l.option ?? item.when}</p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      {physical ? (
                        <div className="flex items-center rounded-full ring-1 ring-line">
                          <button
                            aria-label="Fewer"
                            onClick={() => update(l.qty <= 1 ? lines.filter((x) => x !== l) : lines.map((x) => (x === l ? { ...x, qty: x.qty - 1 } : x)))}
                            className="grid size-8 place-items-center"
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="w-5 text-center text-sm font-semibold tabular-nums">{l.qty}</span>
                          <button
                            aria-label="More"
                            disabled={l.qty >= (item.stock ?? 9)}
                            onClick={() => update(lines.map((x) => (x === l ? { ...x, qty: x.qty + 1 } : x)))}
                            className="grid size-8 place-items-center disabled:text-faint"
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => update(lines.filter((x) => x !== l))} className="flex items-center gap-1 text-xs text-muted hover:text-ink">
                          <Trash2 className="size-3.5" /> Remove
                        </button>
                      )}
                      <p className="text-sm font-semibold tabular-nums">{formatINR(item.price * l.qty)}</p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>

          <aside className="sticky bottom-0 border-t border-line bg-paper px-4 pb-5 pt-4 lg:top-20 lg:self-start lg:rounded-2xl lg:border-0 lg:bg-card lg:p-5 lg:ring-1 lg:ring-line">
            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd className="tabular-nums">{formatINR(subtotal)}</dd></div>
              {hasPhysical && (
                <div className="flex justify-between">
                  <dt className="text-muted">Shipping</dt>
                  <dd className="tabular-nums">{shipping ? formatINR(shipping) : 'Free'}</dd>
                </div>
              )}
              <div className="flex justify-between pt-1.5 text-base font-semibold"><dt>Total</dt><dd className="tabular-nums">{formatINR(total)}</dd></div>
            </dl>
            {hasPhysical && shipping > 0 && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
                <Truck className="size-3.5" /> Add {formatINR(1500 - subtotal)} more for free shipping
              </p>
            )}
            <button
              onClick={onCheckout}
              className="mt-4 h-12 w-full rounded-full bg-brand text-[15px] font-semibold text-white transition-[background-color,transform] duration-150 ease-out hover:bg-brand-ink active:scale-[0.98]"
            >
              Checkout · {formatINR(total)}
            </button>
          </aside>
        </div>
      )}
    </main>
  )
}

export const args = {
  lines: [
    { id: 'beginner-kit', qty: 1, option: 'Sage' },
    { id: 'sunflower-pattern', qty: 1 },
  ],
}

export const argTypes = {}
