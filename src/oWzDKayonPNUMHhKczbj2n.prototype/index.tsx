import React, { useState } from 'react'

import AdminOverview from '../tWynkzFCRpCHHMaj4gCMvS.frame'
import Sellers from '../ngwNCNYmRaDtjP8dw8Zpmp.frame'
import SellerProfile from '../jS2MNRdZEbura2T3PzNuAF.frame'
import BuyersAndOrders from '../ew51WeKtjzn1GSpd4o1tgG.frame'
import Transactions from '../mbHqR9SV8yMQXSnVi3jLFo.frame'
import Subscriptions from '../gNMzDoaQaBLYH9E7RydNfi.frame'
import Support from '../mVArgP53YX4q1Jw7Y6iJge.frame'
import RiskAndModeration from '../i1bTKtB4khtdUzpaEFHjxM.frame'

import type { AdminNav } from '../shared/admin/AdminShell'

const OVERVIEW = 'tWynkzFCRpCHHMaj4gCMvS'
const SELLERS = 'ngwNCNYmRaDtjP8dw8Zpmp'
const SELLER_PROFILE = 'jS2MNRdZEbura2T3PzNuAF'
const BUYERS = 'ew51WeKtjzn1GSpd4o1tgG'
const TRANSACTIONS = 'mbHqR9SV8yMQXSnVi3jLFo'
const SUBSCRIPTIONS = 'gNMzDoaQaBLYH9E7RydNfi'
const SUPPORT = 'mVArgP53YX4q1Jw7Y6iJge'
const RISK = 'i1bTKtB4khtdUzpaEFHjxM'

const NAV: Record<AdminNav, string> = {
  overview: OVERVIEW,
  sellers: SELLERS,
  buyers: BUYERS,
  transactions: TRANSACTIONS,
  subscriptions: SUBSCRIPTIONS,
  support: SUPPORT,
  risk: RISK,
}

/** The size every frame draws at, unless one exports its own. */
export const viewport = 'web'

export const folders = [
  { id: 'business', name: 'Business', frames: [OVERVIEW, SUBSCRIPTIONS] },
  { id: 'people', name: 'Sellers & buyers', frames: [SELLERS, SELLER_PROFILE, BUYERS] },
  { id: 'money', name: 'Money & trust', frames: [TRANSACTIONS, SUPPORT, RISK] },
]

type Props = { start?: string }

export default function AdminConsole(props: Props) {
  const [step, setStep] = useState(() => props.start ?? OVERVIEW)
  const [sellerId, setSellerId] = useState('sl_priya')
  const [from, setFrom] = useState(SELLERS)

  const navigate = (key: AdminNav) => setStep(NAV[key])
  const openSeller = (id: string) => {
    setFrom(step)
    setSellerId(id)
    setStep(SELLER_PROFILE)
  }

  switch (step) {
    case SELLERS:
      return <Sellers onNavigate={navigate} onOpenSeller={openSeller} />
    case SELLER_PROFILE:
      return <SellerProfile key={sellerId} sellerId={sellerId} onNavigate={navigate} onBack={() => setStep(from === SELLER_PROFILE ? SELLERS : from)} />
    case BUYERS:
      return <BuyersAndOrders onNavigate={navigate} onOpenSeller={openSeller} />
    case TRANSACTIONS:
      return <Transactions onNavigate={navigate} />
    case SUBSCRIPTIONS:
      return <Subscriptions onNavigate={navigate} />
    case SUPPORT:
      return <Support onNavigate={navigate} onOpenSeller={openSeller} />
    case RISK:
      return <RiskAndModeration onNavigate={navigate} onOpenSeller={openSeller} />
    default:
      return <AdminOverview onNavigate={navigate} onOpenSeller={openSeller} />
  }
}
