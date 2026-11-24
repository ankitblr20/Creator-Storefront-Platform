import React, { useState } from 'react'

import StorePage from '../wjHfkWRZxDAc6FQcVT8oAM.frame'
import ProductDetail from '../3d6VkJTDHH6PCmLi24M8W9.frame'
import Bag from '../3ZoUnm9ppoSyDcMwxfRNBn.frame'
import Checkout from '../o6cymj3gdYJVTTxU9VwTwj.frame'
import OrderConfirmed from '../e75TbB69Qvp2rUAhiz4p2U.frame'
import MyOrders from '../2awLUKtqeRa3rhnyWPYrWm.frame'
import AboutSeller from '../u6VzqufYvG1LNmM3sqF25S.frame'

import { bagTotals, findItem, isBookable, type BagLine, type ModuleKey } from '../shared/storefront/data'
import { AgentProvider, type AgentResult } from '../shared/buyer/ShopAgent'

const STORE_PAGE = 'wjHfkWRZxDAc6FQcVT8oAM'
const DETAIL = '3d6VkJTDHH6PCmLi24M8W9'
const BAG = '3ZoUnm9ppoSyDcMwxfRNBn'
const CHECKOUT = 'o6cymj3gdYJVTTxU9VwTwj'
const CONFIRMED = 'e75TbB69Qvp2rUAhiz4p2U'
const MY_ORDERS = '2awLUKtqeRa3rhnyWPYrWm'
const ABOUT = 'u6VzqufYvG1LNmM3sqF25S'

/** The size every frame draws at, unless one exports its own. */
export const viewport = 'mobile'

export const args = {
  contact: 'instagram only',
  payment: 'test',
  paymentFails: false,
  emailsWired: false,
  wallet: 'guest',
}

export const argTypes = {
  contact: { control: 'radio', options: ['instagram only', 'instagram + email', 'whatsapp + instagram'] },
  payment: { control: 'radio', options: ['test', 'razorpay'] },
  paymentFails: { control: 'boolean' },
  emailsWired: { control: 'boolean' },
  wallet: { control: 'radio', options: ['signed in', 'guest'] },
}

type Props = Partial<typeof args> & { start?: string }

export default function BuyerStorefront(props: Props) {
  const { contact, payment, paymentFails, emailsWired, wallet, start } = { ...args, ...props }
  const [ordersTab, setOrdersTab] = useState<'orders' | 'bookings'>('orders')
  const [aboutFocus, setAboutFocus] = useState<'top' | 'past'>('top')
  const [step, setStep] = useState(() => start ?? STORE_PAGE)
  const [history, setHistory] = useState<string[]>([])
  const [category, setCategory] = useState<'all' | ModuleKey>('all')
  const [itemId, setItemId] = useState('beginner-kit')
  const [bag, setBag] = useState<BagLine[]>(
    start === BAG || start === CHECKOUT || start === CONFIRMED
      ? [{ id: 'beginner-kit', qty: 1, option: 'Sage' }, { id: 'sunflower-pattern', qty: 1 }]
      : [],
  )
  const [checkout, setCheckout] = useState<{ mode: 'bag' | 'booking'; lines: BagLine[] }>({ mode: 'bag', lines: bag })
  const [order, setOrder] = useState({ quantity: 1, slot: undefined as string | undefined, ticket: undefined as string | undefined, email: 'ananya.rao@gmail.com', orderNo: 2487 })
  const [payState, setPayState] = useState<'default' | 'paying' | 'error'>('default')

  const go = (next: string) => {
    setHistory((h) => [...h, step])
    setStep(next)
  }
  const back = () => {
    setPayState('default')
    setStep(history[history.length - 1] ?? STORE_PAGE)
    setHistory(history.slice(0, -1))
  }
  const open = (id: string) => {
    setItemId(id)
    go(DETAIL)
  }
  const addToBag = (line: BagLine) =>
    setBag((b) => {
      const existing = b.find((l) => l.id === line.id && l.option === line.option)
      return existing ? b.map((l) => (l === existing ? { ...l, qty: l.qty + line.qty } : l)) : [...b, line]
    })
  const bagCount = bagTotals(bag).count

  /** The agent paid from the buyer's wallet with the details it collected: show that order's confirmation */
  const agentPaid = (r: AgentResult) => {
    const it = findItem(r.itemId)
    const booking = isBookable(it.type)
    setItemId(it.id)
    setCheckout({ mode: booking ? 'booking' : 'bag', lines: booking ? [] : [{ id: it.id, qty: r.qty, option: r.option }] })
    setOrder({
      quantity: r.qty,
      slot: r.slot,
      ticket: r.ticket,
      email: r.email,
      orderNo: Number(r.orderId.replace(/\D/g, '')) || 2489,
    })
    setHistory([])
    setStep(CONFIRMED)
  }

  /** One agent for the whole store: sign-in, wallet and orders carry from screen to screen */
  const wrap = (screen: React.ReactNode) => (
    <AgentProvider key={wallet} signedIn={wallet === 'signed in'} onViewOrder={agentPaid}>
      {screen}
    </AgentProvider>
  )

  if (step === MY_ORDERS) {
    return wrap(<MyOrders key={ordersTab} tab={ordersTab} step="lookup" bagCount={bagCount} onBack={back} onBag={() => go(BAG)} />)
  }

  if (step === ABOUT) {
    return wrap(
      <AboutSeller
        key={aboutFocus}
        contact={contact}
        focus={aboutFocus}
        bagCount={bagCount}
        onBack={back}
        onBag={() => go(BAG)}
        onShop={() => {
          setHistory([])
          setCategory('all')
          setStep(STORE_PAGE)
        }}
      />
    )
  }

  if (step === DETAIL) {
    return wrap(
      <ProductDetail
        key={itemId}
        itemId={itemId}
        contact={contact}
        onAbout={() => {
          setAboutFocus('top')
          go(ABOUT)
        }}
        bagCount={bagCount}
        onBack={back}
        onBag={() => go(BAG)}
        onOpen={open}
        onAddToBag={addToBag}
        onBuyNow={(line) => {
          setCheckout({ mode: 'bag', lines: [line] })
          go(CHECKOUT)
        }}
        onBook={(id) => {
          setItemId(id)
          setCheckout({ mode: 'booking', lines: [] })
          go(CHECKOUT)
        }}
      />
    )
  }

  if (step === BAG) {
    return wrap(
      <Bag
        lines={bag}
        onChange={setBag}
        onBack={back}
        onOpen={open}
        onCheckout={() => {
          setCheckout({ mode: 'bag', lines: bag })
          go(CHECKOUT)
        }}
      />
    )
  }

  if (step === CHECKOUT) {
    return wrap(
      <Checkout
        key={checkout.mode + itemId}
        mode={checkout.mode}
        itemId={itemId}
        lines={checkout.lines}
        state={payState}
        payment={payment}
        onBack={back}
        onPay={(r) => {
          setPayState('paying')
          setTimeout(() => {
            if (paymentFails) return setPayState('error')
            setOrder((o) => ({ quantity: r.quantity, slot: r.slot, ticket: r.ticket, email: r.email, orderNo: o.orderNo + 1 }))
            if (checkout.mode === 'bag' && checkout.lines === bag) setBag([])
            setPayState('default')
            setHistory([])
            setStep(CONFIRMED)
          }, 700)
        }}
      />
    )
  }

  if (step === CONFIRMED) {
    return wrap(
      <OrderConfirmed
        mode={checkout.mode}
        itemId={itemId}
        quantity={order.quantity}
        slot={order.slot}
        ticket={order.ticket}
        lines={checkout.lines}
        email={order.email}
        orderId={`SF-${order.orderNo}`}
        emailSent={emailsWired}
        onBackToStore={() => {
          setHistory([])
          setStep(STORE_PAGE)
        }}
      />
    )
  }

  return wrap(
    <StorePage
      state="default"
      category={category}
      onCategoryChange={setCategory}
      contact={contact}
      bagCount={bagCount}
      onOpen={open}
      onBag={() => go(BAG)}
      onFindOrder={() => {
        setOrdersTab('orders')
        go(MY_ORDERS)
      }}
      onBookings={() => {
        setOrdersTab('bookings')
        go(MY_ORDERS)
      }}
      onAbout={(focus) => {
        setAboutFocus(focus)
        go(ABOUT)
      }}
    />
  )
}
