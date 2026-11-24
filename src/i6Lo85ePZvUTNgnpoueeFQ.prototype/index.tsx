import React, { useState } from 'react'

import Landing from '../2avAd8QFuoZ8isAA7TJyND.frame'
import LegalAndContact from '../iy2jbSYAfTfPSzy7ZphcXZ.frame'
import SignUp from '../6qQZoymgQw5eTHP19YbzGn.frame'
import Dashboard from '../eoZhasFqe8fQNL9k6u2p7Z.frame'
import Orders from '../8NKeBdfZQ7yVQW1qoK8pTD.frame'
import Customers from '../77sk9LeBu6NdB3DrFZKemc.frame'
import Events from '../amGmjwKYVkKpD8r84XpApP.frame'
import Meetings from '../kGPJh7kqqGypxrvn2VPnqy.frame'
import DigitalProducts from '../pJPFp92HuGtDQek9VpEA2H.frame'
import PhysicalProducts from '../8hF8p1ZE74VCQBf2p7NutX.frame'
import AddItem from '../akz1RTZU9Y7VGpQ3pXHk1A.frame'
import Analytics from '../1xWqr5UnaZ9gaKwgjoTXsP.frame'
import Promote from '../7ZLFxEBPFAdW26cFEXT8HQ.frame'
import Payments from '../npZYEf8LhQ4tio1gKE3f5y.frame'
import Settings from '../3LpkcvoP6b1sZny92vmJu4.frame'
import StoreLive from '../s52aAguceAorm2HTCDYfvR.frame'
import ReferAndEarn from '../5GbPESoB96s43X9iDJxrD8.frame'
import SellerAgent from '../kAd3RX79JpXJPfyExWAGgk.frame'

import type { NavKey } from '../shared/seller/Shell'
import type { LegalPage } from '../shared/seller/SiteFooter'
import type { ItemType } from '../shared/storefront/data'

const LANDING = '2avAd8QFuoZ8isAA7TJyND'
const LEGAL = 'iy2jbSYAfTfPSzy7ZphcXZ'
const SIGN_UP = '6qQZoymgQw5eTHP19YbzGn'
const OVERVIEW = 'eoZhasFqe8fQNL9k6u2p7Z'
const ORDERS = '8NKeBdfZQ7yVQW1qoK8pTD'
const CUSTOMERS = '77sk9LeBu6NdB3DrFZKemc'
const EVENTS = 'amGmjwKYVkKpD8r84XpApP'
const MEETINGS = 'kGPJh7kqqGypxrvn2VPnqy'
const DIGITAL = 'pJPFp92HuGtDQek9VpEA2H'
const PHYSICAL = '8hF8p1ZE74VCQBf2p7NutX'
const ADD_ITEM = 'akz1RTZU9Y7VGpQ3pXHk1A'
const ANALYTICS = '1xWqr5UnaZ9gaKwgjoTXsP'
const PROMOTE = '7ZLFxEBPFAdW26cFEXT8HQ'
const PAYMENTS = 'npZYEf8LhQ4tio1gKE3f5y'
const SETTINGS = '3LpkcvoP6b1sZny92vmJu4'
const STORE_LIVE = 's52aAguceAorm2HTCDYfvR'
const REFERRALS = '5GbPESoB96s43X9iDJxrD8'
const AGENT = 'kAd3RX79JpXJPfyExWAGgk'

/** A sample item for each kind, used for the "you're live" screen */
const FIRST_ITEM: Record<ItemType, string> = {
  event: 'amigurumi-workshop',
  activity: 'amigurumi-workshop',
  experience: 'amigurumi-workshop',
  call: 'troubleshoot-call',
  digital: 'sunflower-pattern',
  physical: 'beginner-kit',
}

const NAV_TO_FRAME: Record<NavKey, string> = {
  agent: AGENT,
  overview: OVERVIEW,
  orders: ORDERS,
  customers: CUSTOMERS,
  events: EVENTS,
  meetings: MEETINGS,
  digital: DIGITAL,
  physical: PHYSICAL,
  analytics: ANALYTICS,
  promote: PROMOTE,
  referrals: REFERRALS,
  payments: PAYMENTS,
  settings: SETTINGS,
  logout: LANDING,
}

/** The size every frame draws at, unless one exports its own. */
export const viewport = 'web'

export const folders = [
  { id: 'onboarding', name: 'First visit', frames: [LANDING, LEGAL, SIGN_UP, STORE_LIVE] },
  { id: 'run', name: 'Run the business', frames: [AGENT, OVERVIEW, ORDERS, CUSTOMERS] },
  { id: 'sell', name: 'Sell', frames: [EVENTS, MEETINGS, DIGITAL, PHYSICAL, ADD_ITEM] },
  { id: 'grow', name: 'Grow', frames: [ANALYTICS, PROMOTE, REFERRALS] },
  { id: 'business', name: 'Business', frames: [PAYMENTS, SETTINGS] },
]

export const args = {
  account: 'new',
}

export const argTypes = {
  account: { control: 'radio', options: ['new', 'established'] },
}

type Props = Partial<typeof args> & { start?: string }

export default function SellerDashboard(props: Props) {
  const { account, start } = { ...args, ...props }
  const established = account === 'established' || (start !== undefined && start !== LANDING && start !== SIGN_UP && start !== OVERVIEW)
  const [step, setStep] = useState(() => start ?? (established ? OVERVIEW : LANDING))
  const [hasItems, setHasItems] = useState(established)
  const [razorpay, setRazorpay] = useState(established)
  const [profileDone, setProfileDone] = useState(established)
  const [settingsTab, setSettingsTab] = useState<'profile' | 'payments'>('profile')
  const openSettings = (tab: 'profile' | 'payments') => {
    setSettingsTab(tab)
    setStep(SETTINGS)
  }
  const [newType, setNewType] = useState<ItemType>('event')
  const [legalPage, setLegalPage] = useState<LegalPage>('privacy')
  const published = hasItems

  const navigate = (key: NavKey) => setStep(NAV_TO_FRAME[key])
  const newItem = (type?: ItemType) => {
    setNewType(type ?? 'event')
    setStep(ADD_ITEM)
  }
  const shared = { published, onNavigate: navigate, onNewItem: () => newItem() }

  switch (step) {
    case LANDING:
      return (
        <Landing
          onStart={() => setStep(SIGN_UP)}
          onSignIn={() => setStep(OVERVIEW)}
          onLegal={(p) => {
            setLegalPage(p)
            setStep(LEGAL)
          }}
        />
      )
    case LEGAL:
      return <LegalAndContact page={legalPage} onHome={() => setStep(LANDING)} onStart={() => setStep(SIGN_UP)} />
    case SIGN_UP:
      return <SignUp state="default" onSubmit={() => setStep(OVERVIEW)} />
    case ORDERS:
      return <Orders {...shared} />
    case CUSTOMERS:
      return <Customers {...shared} />
    case EVENTS:
      return <Events {...shared} />
    case MEETINGS:
      return <Meetings {...shared} />
    case DIGITAL:
      return <DigitalProducts {...shared} />
    case PHYSICAL:
      return <PhysicalProducts {...shared} />
    case ADD_ITEM:
      return (
        <AddItem
          key={newType}
          type={newType}
          published={published}
          onNavigate={navigate}
          onBack={() => setStep(OVERVIEW)}
          onSave={(asDraft) => {
            const first = !asDraft && !hasItems
            if (!asDraft) setHasItems(true)
            setStep(first ? STORE_LIVE : OVERVIEW)
          }}
        />
      )
    case STORE_LIVE:
      return <StoreLive itemId={FIRST_ITEM[newType]} onDashboard={() => setStep(OVERVIEW)} onPromote={() => setStep(PROMOTE)} />
    case REFERRALS:
      return <ReferAndEarn {...shared} />
    case AGENT:
      return (
        <SellerAgent
          conversation="empty"
          {...shared}
          onEditDraft={(type) => {
            setNewType(type)
            setStep(ADD_ITEM)
          }}
        />
      )
    case ANALYTICS:
      return <Analytics {...shared} />
    case PROMOTE:
      return <Promote {...shared} />
    case PAYMENTS:
      return <Payments {...shared} razorpay={razorpay ? 'connected' : 'not connected'} onConnect={() => openSettings('payments')} />
    case SETTINGS:
      return (
        <Settings
          key={settingsTab}
          {...shared}
          tab={settingsTab}
          firstTime={!profileDone}
          razorpay={razorpay ? 'connected' : 'not connected'}
          onConnected={() => setRazorpay(true)}
          onSaved={() => {
            if (!profileDone) {
              setProfileDone(true)
              setStep(OVERVIEW)
            }
          }}
        />
      )
    default:
      return (
        <Dashboard
          catalog={hasItems ? 'full' : 'empty'}
          razorpay={razorpay}
          profile={profileDone}
          balance={18450}
          onNavigate={navigate}
          onConnect={() => openSettings('payments')}
          onProfile={() => openSettings('profile')}
          onAddItem={newItem}
        />
      )
  }
}
