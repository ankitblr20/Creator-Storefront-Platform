import React from 'react'
import { Sparkles } from 'lucide-react'

import { Chat } from '../shared/agent/Chat'
import { TabBar, WalletChip, type Tab } from '../shared/agent/Chrome'
import { ORDERS, type Order } from '../shared/agent/data'

type Props = Partial<typeof args> & {
  orders?: Order[]
  onTab?: (t: Tab) => void
  onTopUp?: (amount: number) => void
  onPaid?: (order: Order) => void
  onViewOrder?: (id?: string) => void
  onOpenShop?: (handle: string) => void
}

export default function Agent(props: Props) {
  const { balance, ask, orders = ORDERS, onTab, onTopUp, onPaid, onViewOrder, onOpenShop } = { ...args, ...props }
  const active = orders.filter((o) => o.status !== 'Delivered' && o.status !== 'Completed').length

  return (
    <div className="flex h-screen flex-col bg-paper">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-line bg-card px-4">
        <span className="grid size-8 place-items-center rounded-full bg-ink text-white"><Sparkles className="size-4" /></span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">Your agent</p>
          <p className="truncate text-xs text-muted">Works in every Riftori shop</p>
        </div>
        <WalletChip balance={balance} onClick={() => onTab?.('wallet')} />
      </header>

      <div className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col">
        <Chat
          key={ask}
          firstAsk={ask || undefined}
          balance={balance}
          orders={orders}
          onTopUp={onTopUp}
          onPaid={onPaid}
          onViewOrder={onViewOrder}
          onOpenShop={onOpenShop}
        />
      </div>

      <TabBar active="agent" badge={active} onTab={onTab} />
    </div>
  )
}

export const args = {
  balance: 4250,
  ask: '',
}

export const argTypes = {
  balance: { control: 'number' },
  ask: { control: 'select', options: ['', 'Book Saturday’s amigurumi workshop', 'Buy the speckled chai mug', 'Book the brew coaching call about my bitter pour-overs', 'Where is my coffee?', 'Open Mitti Ceramics on Instagram'] },
}
