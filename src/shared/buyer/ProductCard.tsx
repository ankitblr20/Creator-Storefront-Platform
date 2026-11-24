import React from 'react'
import { Video, Users, CalendarDays, Download, Package, Mountain } from 'lucide-react'

import { formatINR, typeLabel, type Item, type ItemType } from '../storefront/data'

export function ProductCard({ item, onOpen, className = '' }: { item: Item; onOpen?: (id: string) => void; className?: string }) {
  const low = (item.seatsLeft ?? item.stock ?? 99) <= 4
  return (
    <button
      onClick={() => onOpen?.(item.id)}
      className={`group flex flex-col text-left ${className}`}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-brand-soft">
        <ItemImage item={item} className="transition-transform duration-300 ease-out group-hover:scale-[1.03]" />
        {low && (
          <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2 py-0.5 text-[11px] font-semibold text-brand-ink">
            {item.seatsLeft !== undefined ? `${item.seatsLeft} seats left` : `Only ${item.stock} left`}
          </span>
        )}
      </div>
      <p className="mt-2 text-[11px] font-medium text-brand">{typeLabel(item.type)}</p>
      <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-5">{item.title}</h3>
      <p className="mt-0.5 truncate text-xs text-muted">{item.when}</p>
      <p className="mt-1.5 text-sm font-semibold">
        {item.price === 0 ? 'Free' : formatINR(item.price)}
        {item.compareAt && <span className="ml-1.5 text-xs font-normal text-faint line-through">{formatINR(item.compareAt)}</span>}
      </p>
    </button>
  )
}

export function ItemImage({ item, className = '' }: { item: Item; className?: string }) {
  if (item.image) return <img src={item.image} alt="" className={`size-full object-cover ${className}`} />
  const Icon = TYPE_ICON[item.type]
  return (
    <div className={`grid size-full place-items-center bg-brand-soft ${className}`}>
      <Icon className="size-8 text-brand" strokeWidth={1.5} />
    </div>
  )
}

export const TYPE_ICON: Record<ItemType, typeof Video> = {
  event: CalendarDays,
  call: Video,
  digital: Download,
  physical: Package,
  activity: Users,
  experience: Mountain,
}
