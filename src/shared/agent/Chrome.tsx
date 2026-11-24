import React from 'react'
import { ArrowLeft, Lock, Wallet, Home, Sparkles, Package } from 'lucide-react'

import { formatINR } from './data'

/** The in-app browser bar on a shop: back, the shop's @username, and the wallet */
export function AddressBar({ handle, balance, onBack, onWallet }: { handle: string; balance: number; onBack?: () => void; onWallet?: () => void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-card/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-3xl items-center gap-2 px-3">
        <button aria-label="Back" onClick={onBack} className="grid size-10 shrink-0 place-items-center rounded-full transition-colors duration-150 ease-out hover:bg-paper">
          <ArrowLeft className="size-5" />
        </button>
        <div className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-full bg-paper px-3.5 text-sm">
          <Lock className="size-3.5 shrink-0 text-ok" />
          <span className="truncate font-medium">riftori.com/@{handle}</span>
        </div>
        <WalletChip balance={balance} onClick={onWallet} />
      </div>
    </header>
  )
}

export function WalletChip({ balance, onClick }: { balance: number; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-brand-soft px-3 text-sm font-semibold tabular-nums text-brand-ink transition-colors duration-150 ease-out hover:bg-brand/15"
    >
      <Wallet className="size-4" /> {formatINR(balance)}
    </button>
  )
}

export type Tab = 'home' | 'agent' | 'orders' | 'wallet'

const TABS: { key: Tab; label: string; icon: typeof Home }[] = [
  { key: 'home', label: 'Home', icon: Home },
  { key: 'agent', label: 'Agent', icon: Sparkles },
  { key: 'orders', label: 'Orders', icon: Package },
  { key: 'wallet', label: 'Wallet', icon: Wallet },
]

export function TabBar({ active, badge, onTab }: { active?: Tab; badge?: number; onTab?: (t: Tab) => void }) {
  return (
    <nav className="sticky bottom-0 z-30 border-t border-line bg-card/95 backdrop-blur">
      <ul className="mx-auto flex h-16 max-w-3xl">
        {TABS.map(({ key, label, icon: Icon }) => (
          <li key={key} className="flex-1">
            <button
              onClick={() => onTab?.(key)}
              aria-current={active === key ? 'page' : undefined}
              className={`relative flex h-full w-full flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors duration-150 ease-out ${
                active === key ? 'text-ink' : 'text-faint hover:text-muted'
              }`}
            >
              <Icon className="size-[22px]" strokeWidth={active === key ? 2.25 : 1.75} />
              {label}
              {key === 'orders' && !!badge && (
                <span className="absolute left-1/2 top-2 ml-2 grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">{badge}</span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
