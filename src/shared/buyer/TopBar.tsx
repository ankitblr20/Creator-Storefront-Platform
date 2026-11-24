import React from 'react'
import { ArrowLeft, Menu, Search, ShoppingBag } from 'lucide-react'

import { STORE } from '../storefront/data'
import { AgentButton, AgentSheet } from './ShopAgent'

/** The store's sticky top bar: menu or back, the store, search, the buyer's agent and the bag */
export function TopBar({
  bagCount,
  onBack,
  onMenu,
  onSearch,
  onBag,
  title,
  agent = true,
  agentItemId,
}: {
  bagCount: number
  onBack?: () => void
  onMenu?: () => void
  onSearch?: () => void
  onBag?: () => void
  title?: string
  /** Show the agent button. Off on checkout, where the buyer is already paying. */
  agent?: boolean
  /** The product on screen, so the agent knows what "this" is */
  agentItemId?: string
}) {
  return (
    <>
    <header className="sticky top-0 z-30 border-b border-line/70 bg-paper/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-1 px-2 sm:px-4">
        {onBack ? (
          <IconButton label="Back" onClick={onBack}>
            <ArrowLeft className="size-5" />
          </IconButton>
        ) : (
          <IconButton label="Menu" onClick={onMenu}>
            <Menu className="size-5" />
          </IconButton>
        )}
        <div className="flex min-w-0 flex-1 items-center gap-2 px-1">
          <img src={STORE.avatar} alt="" className="size-7 shrink-0 rounded-full object-cover" />
          <span className="truncate text-[15px] font-semibold">{title ?? STORE.name}</span>
        </div>
        {onSearch && (
          <IconButton label="Search" onClick={onSearch}>
            <Search className="size-5" />
          </IconButton>
        )}
        {agent && <span className="mx-0.5"><AgentButton /></span>}
        <IconButton label={`Bag, ${bagCount} items`} onClick={onBag}>
          <span className="relative">
            <ShoppingBag className="size-5" />
            {bagCount > 0 && (
              <span className="absolute -right-2 -top-1.5 grid size-[18px] place-items-center rounded-full bg-brand text-[10px] font-bold text-white">
                {bagCount}
              </span>
            )}
          </span>
        </IconButton>
      </div>
    </header>
    {/* Outside the header: its backdrop blur would trap a fixed sheet inside it */}
    {agent && <AgentSheet itemId={agentItemId} />}
    </>
  )
}

function IconButton({ label, onClick, children }: { label: string; onClick?: () => void; children: React.ReactNode }) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className="grid size-10 shrink-0 place-items-center rounded-full transition-colors duration-150 ease-out hover:bg-line/70"
    >
      {children}
    </button>
  )
}
