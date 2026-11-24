import { IMAGES, ITEMS, formatINR, type Item } from '../storefront/data'

export { formatINR }

/**
 * Every Riftori shop is addressed by its Instagram username: @priya.crochet opens that shop,
 * the same way a link in their bio does. The code is the short id printed on receipts.
 */
export type Shop = {
  handle: string
  name: string
  code: string
  category: string
  city: string
  avatar: string
  brand: string
  followers: string
}

const IMG = {
  mitti: 'https://cdn.magicpatterns.com/patterns/generated-images/ccad60d3-3eda-40f5-ac5e-ce2c1414e333.jpg',
  kaafi: 'https://cdn.magicpatterns.com/patterns/generated-images/2f75e87c-08f8-41a3-9054-1cb71fddd537.jpg',
  bandra: 'https://cdn.magicpatterns.com/patterns/generated-images/737edb44-ac7d-4d34-baf1-6db87b52f5bd.jpg',
  inkpot: 'https://cdn.magicpatterns.com/patterns/generated-images/065c7e87-506d-473a-8f5e-5e79bbf631c1.jpg',
}

export const SHOPS: Shop[] = [
  { handle: 'priya.crochet', name: 'Priya Crochet', code: 'RF-1048', category: 'Crochet kits & workshops', city: 'Mumbai', avatar: IMAGES.avatar, brand: '#b4472f', followers: '18.2k' },
  { handle: 'mitti.ceramics', name: 'Mitti Ceramics', code: 'RF-2213', category: 'Studio pottery', city: 'Pondicherry', avatar: IMG.mitti, brand: '#8a5a3c', followers: '42.7k' },
  { handle: 'kaafi.roasters', name: 'Kaafi Roasters', code: 'RF-0871', category: 'Single-origin coffee', city: 'Chikmagalur', avatar: IMG.kaafi, brand: '#5b3a24', followers: '9.6k' },
  { handle: 'bandra.thrift', name: 'Bandra Thrift', code: 'RF-3390', category: 'Vintage clothing', city: 'Mumbai', avatar: IMG.bandra, brand: '#2f4b6e', followers: '61.3k' },
  { handle: 'inkpot.studio', name: 'Inkpot Studio', code: 'RF-1702', category: 'Art prints & notebooks', city: 'Bengaluru', avatar: IMG.inkpot, brand: '#3d5a4a', followers: '12.1k' },
]

export function shopBy(handle: string): Shop {
  return SHOPS.find((s) => s.handle === handle) ?? SHOPS[0]
}

export function instagramUrl(handle: string): string {
  return `https://instagram.com/${handle}`
}

/* ───────────────────────── Products across every shop ───────────────────────── */

export type Kind = 'physical' | 'event' | 'call' | 'digital'

export type Product = {
  id: string
  shop: string
  title: string
  image: string
  kind: Kind
  price: number
  about: string
  options?: string[]
  stock?: number
  dispatch?: string
  tickets?: { name: string; price: number; left: number }[]
  when?: string
  location?: string
  length?: string
  slots?: { day: string; times: string[] }[]
  file?: string
}

const SLOTS = [
  { day: 'Tue 10 Jun', times: ['6:00 pm', '7:00 pm'] },
  { day: 'Wed 11 Jun', times: ['11:00 am', '11:30 am'] },
  { day: 'Fri 13 Jun', times: ['5:00 pm', '5:30 pm', '6:00 pm'] },
]

function kindOf(i: Item): Kind {
  return i.type === 'call' ? 'call' : i.type === 'digital' ? 'digital' : i.type === 'physical' ? 'physical' : 'event'
}

const PRIYA: Product[] = ITEMS.map((i) => ({
  id: i.id,
  shop: 'priya.crochet',
  title: i.title,
  image: i.image ?? IMAGES.cover,
  kind: kindOf(i),
  price: i.price,
  about: i.details,
  options: i.options,
  stock: i.stock,
  dispatch: i.dispatch,
  tickets: i.tickets ?? (i.seats ? [{ name: 'Seat', price: i.price, left: i.seatsLeft ?? i.seats }] : undefined),
  when: i.when,
  location: i.location,
  length: i.type === 'call' ? i.when : undefined,
  slots: i.slots?.map((d) => ({ day: `${d.day} Jun`, times: d.times.filter((t) => !t.taken).map((t) => t.time) })),
  file: i.file,
}))

const OTHERS: Product[] = [
  { id: 'mitti-mug', shop: 'mitti.ceramics', title: 'Speckled chai mug', image: IMG.mitti, kind: 'physical', price: 890, options: ['Rust dip', 'Moss dip', 'Plain cream'], stock: 3, dispatch: 'Ships Thursday', about: 'Wheel-thrown stoneware, 300 ml, food and dishwasher safe. Each glaze dip is a little different.' },
  { id: 'mitti-bowl', shop: 'mitti.ceramics', title: 'Nut bowl, small', image: IMG.mitti, kind: 'physical', price: 420, options: ['Rust dip', 'Plain cream'], stock: 8, dispatch: 'Ships Thursday', about: 'A 10 cm bowl for nuts, olives or rings. Speckled stoneware.' },
  { id: 'mitti-class', shop: 'mitti.ceramics', title: 'Wheel-throwing taster', image: IMG.mitti, kind: 'event', price: 2200, when: 'Sun, 15 Jun · 10 am–1 pm', location: 'Mitti studio, White Town, Pondicherry', tickets: [{ name: 'Solo', price: 2200, left: 5 }, { name: 'Pair', price: 4000, left: 2 }], about: 'Three hours on the wheel. You throw two pieces; we glaze, fire and post them to you.' },
  { id: 'kaafi-ratnagiri', shop: 'kaafi.roasters', title: 'Ratnagiri Estate, 250 g', image: IMG.kaafi, kind: 'physical', price: 640, options: ['Whole bean', 'Pour-over grind', 'Espresso grind'], stock: 40, dispatch: 'Roasted Monday, ships Tuesday', about: 'Medium roast from a family estate in Chikmagalur. Notes of jaggery, orange and cocoa.' },
  { id: 'kaafi-call', shop: 'kaafi.roasters', title: 'Brew coaching call', image: IMG.kaafi, kind: 'call', price: 500, length: '20 min · Google Meet', slots: SLOTS, about: 'Show us your setup on video and we dial in your grind, ratio and pour.' },
  { id: 'bandra-denim', shop: 'bandra.thrift', title: '90s denim jacket', image: IMG.bandra, kind: 'physical', price: 2400, options: ['Size M'], stock: 1, dispatch: 'Ships in 2 days', about: 'Faded mid-wash, boxy fit, original brass buttons. One of one — chest 42 in, length 25 in.' },
  { id: 'bandra-shirt', shop: 'bandra.thrift', title: 'Block-print shirt', image: IMG.bandra, kind: 'physical', price: 1100, options: ['Size L'], stock: 1, dispatch: 'Ships in 2 days', about: 'Soft cotton with a rust paisley block print. One of one.' },
  { id: 'inkpot-csmt', shop: 'inkpot.studio', title: 'CSMT print, A4', image: IMG.inkpot, kind: 'physical', price: 750, options: ['Unframed', 'Teak frame (+₹0, launch offer)'], stock: 20, dispatch: 'Ships in 3 days, rolled in a tube', about: 'Ink and watercolour of the station, printed on 300 gsm cotton rag.' },
  { id: 'inkpot-sketchbook', shop: 'inkpot.studio', title: 'Linen sketchbook, A5', image: IMG.inkpot, kind: 'physical', price: 980, options: ['Natural linen', 'Charcoal linen'], stock: 12, dispatch: 'Ships in 3 days', about: '120 pages of 160 gsm paper that takes light watercolour. Lies flat.' },
  { id: 'inkpot-brushes', shop: 'inkpot.studio', title: 'Procreate brush pack', image: IMG.inkpot, kind: 'digital', price: 399, file: '18 brushes · .brushset', about: 'The 18 ink and wash brushes behind every Inkpot print.' },
]

export const PRODUCTS: Product[] = [...PRIYA, ...OTHERS]

export function productBy(id: string): Product {
  return PRODUCTS.find((p) => p.id === id) ?? PRODUCTS[0]
}

/* ───────────────────────── The buyer ───────────────────────── */

/** Saved once in the wallet, prefilled into every checkout the agent runs */
export const PROFILE = {
  name: 'Ananya Rao',
  phone: '+91 99300 11872',
  email: 'ananya.rao@gmail.com',
  addresses: [
    { label: 'Home', line: 'Flat 802, Sea Breeze CHS, 14th Road, Khar West, Mumbai 400052' },
    { label: 'Office', line: '4th floor, Trade View, Kamala Mills, Lower Parel, Mumbai 400013' },
  ],
}

export const WALLET = {
  id: 'ananya@riftori',
  balance: 4250,
  agent: { pocket: 1500, weeklyLimit: 2000, perPurchase: 1000, spentThisWeek: 500 },
}

/* ───────────────────────── Orders ───────────────────────── */

export type OrderStatus = 'Confirmed' | 'Packed' | 'On the way' | 'Delivered' | 'Upcoming' | 'Ready' | 'Completed'

export type Order = {
  id: string
  productId: string
  shop: string
  title: string
  image: string
  kind: Kind
  amount: number
  placed: string
  paidBy: 'you' | 'agent'
  status: OrderStatus
  qty: number
  variant?: string
  ticket?: string
  attendees?: string[]
  when?: string
  location?: string
  slot?: string
  topic?: string
  meet?: string
  name: string
  phone?: string
  email: string
  address?: string
  note?: string
  tracking?: string
  file?: string
}

export const ORDERS: Order[] = [
  {
    id: 'SF-2485', productId: 'amigurumi-workshop', shop: 'priya.crochet', title: 'Saturday Amigurumi Workshop', image: IMAGES.workshop, kind: 'event',
    amount: 3600, placed: 'Today, 10:12 am', paidBy: 'you', status: 'Upcoming', qty: 2, ticket: 'Early bird', attendees: ['Ananya Rao', 'Meera Rao'],
    when: 'Sat, 14 Jun · 4–7 pm', location: 'The Yarn Social, Bandra', name: 'Ananya Rao', phone: PROFILE.phone, email: PROFILE.email,
  },
  {
    id: 'KR-0412', productId: 'kaafi-ratnagiri', shop: 'kaafi.roasters', title: 'Ratnagiri Estate, 250 g', image: IMG.kaafi, kind: 'physical',
    amount: 720, placed: 'Today, 8:06 am', paidBy: 'agent', status: 'On the way', qty: 1, variant: 'Pour-over grind', name: 'Ananya Rao', phone: PROFILE.phone,
    email: PROFILE.email, address: PROFILE.addresses[0].line, tracking: 'Delhivery 2214 8890 4410 · arrives Thu',
  },
  {
    id: 'SF-2474', productId: 'intro-call', shop: 'priya.crochet', title: 'Free 15-min intro call', image: IMAGES.avatar, kind: 'call',
    amount: 0, placed: 'Mon, 9:40 pm', paidBy: 'you', status: 'Upcoming', qty: 1, slot: 'Tue 10 Jun, 6:00 pm', topic: 'Which yarn and hook for a first blanket?',
    meet: 'meet.google.com/xpr-hqkd-tmn', name: 'Ananya Rao', email: PROFILE.email,
  },
  {
    id: 'SF-2466', productId: 'sunflower-pattern', shop: 'priya.crochet', title: 'Sunflower granny square pattern', image: IMAGES.pattern, kind: 'digital',
    amount: 249, placed: 'Mon, 10:30 am', paidBy: 'agent', status: 'Ready', qty: 1, name: 'Ananya Rao', email: PROFILE.email, file: 'sunflower-granny-square.pdf · 4.2 MB',
  },
  {
    id: 'IS-0988', productId: 'inkpot-csmt', shop: 'inkpot.studio', title: 'CSMT print, A4', image: IMG.inkpot, kind: 'physical',
    amount: 750, placed: 'Tue, 6:40 pm', paidBy: 'you', status: 'Delivered', qty: 1, variant: 'Unframed', name: 'Ananya Rao', phone: PROFILE.phone,
    email: PROFILE.email, address: PROFILE.addresses[1].line, tracking: 'Delivered Fri, 2:14 pm · signed by reception',
  },
]

/* ───────────────────────── Browsing history ───────────────────────── */

export type Visit = {
  id: string
  handle: string
  when: string
  day: 'Today' | 'Yesterday' | 'This week'
  via: 'Instagram story' | 'Instagram reel' | 'Bio link' | 'Typed @handle' | 'Agent'
  viewed: string[]
  inBag?: string
}

export const VISITS: Visit[] = [
  { id: 'v1', handle: 'priya.crochet', when: '2 min ago', day: 'Today', via: 'Instagram reel', viewed: ['beginner-kit', 'amigurumi-workshop'] },
  { id: 'v2', handle: 'mitti.ceramics', when: '11:20 am', day: 'Today', via: 'Instagram story', viewed: ['mitti-mug', 'mitti-bowl'], inBag: '2 × Speckled chai mug' },
  { id: 'v3', handle: 'kaafi.roasters', when: '8:05 am', day: 'Today', via: 'Agent', viewed: ['kaafi-ratnagiri'] },
  { id: 'v4', handle: 'bandra.thrift', when: '9:42 pm', day: 'Yesterday', via: 'Bio link', viewed: ['bandra-denim', 'bandra-shirt'] },
  { id: 'v5', handle: 'inkpot.studio', when: 'Tue', day: 'This week', via: 'Typed @handle', viewed: ['inkpot-csmt', 'inkpot-sketchbook'] },
  { id: 'v6', handle: 'priya.crochet', when: 'Mon', day: 'This week', via: 'Instagram story', viewed: ['sunflower-pattern'] },
]

/* ───────────────────────── Wallet activity ───────────────────────── */

export type Txn = { id: string; title: string; sub: string; amount: number; by: 'you' | 'agent' | 'topup' | 'refund'; when: string }

export const TXNS: Txn[] = [
  { id: 't1', title: 'Added from UPI', sub: 'ananya.rao@okicici', amount: 3000, by: 'topup', when: 'Today, 9:14 am' },
  { id: 't2', title: '@kaafi.roasters', sub: 'Ratnagiri Estate · reorder', amount: -720, by: 'agent', when: 'Today, 8:06 am' },
  { id: 't3', title: '@inkpot.studio', sub: 'CSMT print, A4', amount: -750, by: 'you', when: 'Tue, 6:40 pm' },
  { id: 't4', title: 'Refund · @bandra.thrift', sub: 'Shirt didn’t fit · returned', amount: 1100, by: 'refund', when: 'Mon, 1:02 pm' },
  { id: 't5', title: '@priya.crochet', sub: 'Sunflower granny square pattern', amount: -249, by: 'agent', when: 'Mon, 10:30 am' },
]

export function statusTone(s: OrderStatus): string {
  return s === 'On the way' || s === 'Upcoming' || s === 'Ready' ? 'bg-brand-soft text-brand-ink' : s === 'Delivered' || s === 'Completed' ? 'bg-line/60 text-muted' : 'bg-ok-soft text-ok'
}
