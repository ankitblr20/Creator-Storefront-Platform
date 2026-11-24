import React, { useState } from 'react'

import Browser from '../ujkyumKwb1XU9pL6jMSqnu.frame'
import Agent from '../98qtXg8XGVd7ZMwcsRBoFG.frame'
import Shop from '../toCiF3ZWAN5XM6svQJgGLf.frame'
import Orders from '../c6GSwcHjfRHtg8rBtRnoSB.frame'
import Wallet from '../3Xe8YjQHUDbs75RrHjier5.frame'
import History from '../4WdLjD4poBc75egchvUqva.frame'

import type { Tab } from '../shared/agent/Chrome'
import { ORDERS, WALLET, type Order, type Txn } from '../shared/agent/data'

const HOME = 'ujkyumKwb1XU9pL6jMSqnu'
const AGENT = '98qtXg8XGVd7ZMwcsRBoFG'
const SHOP = 'toCiF3ZWAN5XM6svQJgGLf'
const ORDERS_SCREEN = 'c6GSwcHjfRHtg8rBtRnoSB'
const WALLET_SCREEN = '3Xe8YjQHUDbs75RrHjier5'
const HISTORY = '4WdLjD4poBc75egchvUqva'

const TAB_TO_FRAME: Record<Tab, string> = { home: HOME, agent: AGENT, orders: ORDERS_SCREEN, wallet: WALLET_SCREEN }

/** The size every frame draws at, unless one exports its own. */
export const viewport = 'mobile'

export const args = {
  wallet: 'funded',
}

export const argTypes = {
  wallet: { control: 'radio', options: ['funded', 'low'] },
}

type Props = Partial<typeof args> & { start?: string }

export default function BuyerAgent(props: Props) {
  const { wallet, start } = { ...args, ...props }
  const [step, setStep] = useState(() => start ?? HOME)
  const [from, setFrom] = useState(HOME)
  const [shop, setShop] = useState('priya.crochet')
  const [ask, setAsk] = useState('')
  const [focusOrder, setFocusOrder] = useState('')
  const [balance, setBalance] = useState(wallet === 'low' ? 600 : WALLET.balance)
  const [orders, setOrders] = useState<Order[]>(ORDERS)
  const [recent, setRecent] = useState<Txn[]>([])

  const go = (next: string) => {
    setFrom(step)
    setStep(next)
  }
  const onTab = (t: Tab) => {
    if (t === 'agent') setAsk('')
    if (t === 'orders') setFocusOrder('')
    go(TAB_TO_FRAME[t])
  }
  const openAgent = (q?: string) => {
    setAsk(q ?? '')
    go(AGENT)
  }
  const openShop = (handle: string) => {
    setShop(handle)
    go(SHOP)
  }
  const viewOrder = (id?: string) => {
    setFocusOrder(id ?? '')
    go(ORDERS_SCREEN)
  }
  const topUp = (amount: number) => {
    setBalance((b) => b + amount)
    setRecent((r) => [{ id: `top-${Date.now()}`, title: 'Added from UPI', sub: 'ananya.rao@okicici', amount, by: 'topup', when: 'Just now' }, ...r])
  }
  const paid = (o: Order) => {
    setOrders((list) => [o, ...list])
    setBalance((b) => b - o.amount)
    if (o.amount > 0) setRecent((r) => [{ id: o.id, title: `@${o.shop}`, sub: o.title, amount: -o.amount, by: 'agent', when: 'Just now' }, ...r])
  }
  const chat = { balance, orders, onTopUp: topUp, onPaid: paid, onViewOrder: viewOrder, onOpenShop: openShop }

  switch (step) {
    case AGENT:
      return <Agent key={ask} ask={ask} {...chat} onTab={onTab} />
    case SHOP:
      return <Shop key={shop} handle={shop} agent="closed" {...chat} onBack={() => setStep(from === SHOP ? HOME : from)} onTab={onTab} />
    case ORDERS_SCREEN:
      return <Orders key={focusOrder} balance={balance} filter="all" openOrder={focusOrder} orders={orders} onTab={onTab} onShop={openShop} onAgent={openAgent} />
    case WALLET_SCREEN:
      return <Wallet state="default" balance={balance} pocket={WALLET.agent.pocket} recent={recent} onTab={onTab} onAddMoney={topUp} />
    case HISTORY:
      return <History onBack={() => setStep(HOME)} onShop={openShop} onAgent={openAgent} onTab={onTab} />
    default:
      return <Browser balance={balance} orders={orders} onAgent={openAgent} onShop={openShop} onOrder={viewOrder} onHistory={() => go(HISTORY)} onTab={onTab} />
  }
}
