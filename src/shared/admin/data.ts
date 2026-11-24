/** Riftori internal admin data. Every number is illustrative but internally consistent. */

export type Plan = 'Trial' | 'Starter' | 'Pro' | 'Business'
export type SellerStatus = 'Active' | 'Trial' | 'Past due' | 'Suspended' | 'Churned'
export type Module = 'Events' | 'Meetings' | 'Digital' | 'Physical'

export const KPIS = {
  gmv30: 28412600,
  gmvPrev30: 22871400,
  mrr: 486300,
  mrrPrev: 441900,
  activeSellers: 2148,
  trialing: 612,
  newSellers30: 731,
  buyers: 41920,
  newBuyers30: 9312,
  orders30: 18406,
  paymentSuccess: 97.2,
  refundRate: 1.4,
  disputeRate: 0.08,
  trialConversion: 38,
  churn: 3.1,
  aov: 1544,
  openTickets: 14,
  slaBreaches: 2,
  riskFlags: 3,
}

/** Last 30 days of platform GMV in ₹, oldest first */
export const GMV_DAILY = [
  712000, 684000, 801000, 765000, 902000, 1188000, 1240000, 744000, 812000, 858000, 921000, 980000, 1302000, 1356000, 862000,
  905000, 948000, 1012000, 1066000, 1394000, 1462000, 931000, 978000, 1024000, 1089000, 1142000, 1518000, 1604000, 1012000, 1102000,
]

/** Last 30 days of new seller sign-ups */
export const SIGNUPS_DAILY = [18, 21, 19, 24, 22, 31, 28, 20, 23, 25, 22, 27, 34, 30, 24, 26, 25, 29, 28, 36, 33, 27, 26, 30, 31, 29, 38, 35, 28, 26]

export const MODULE_MIX: { module: Module; gmv: number; orders: number; sellers: number }[] = [
  { module: 'Events', gmv: 11240000, orders: 4920, sellers: 812 },
  { module: 'Physical', gmv: 8930000, orders: 5410, sellers: 964 },
  { module: 'Digital', gmv: 5180000, orders: 6380, sellers: 1102 },
  { module: 'Meetings', gmv: 3062600, orders: 1696, sellers: 701 },
]

/** Matches the "What do you do?" choice at sign-up */
export const CATEGORY_MIX = [
  { category: 'Creator', sellers: 548, gmv: 6140000 },
  { category: 'Solopreneur', sellers: 486, gmv: 5210000 },
  { category: 'Small business', sellers: 402, gmv: 4382600 },
  { category: 'Coach', sellers: 371, gmv: 5440000 },
  { category: 'Event company', sellers: 158, gmv: 6830000 },
  { category: 'Student', sellers: 183, gmv: 410000 },
]

/** "How did you hear about us?" — new sellers, last 30 days */
export const HEARD_MIX = [
  { source: 'Instagram', sellers: 248, paid: 41 },
  { source: 'A friend or another seller', sellers: 156, paid: 58 },
  { source: 'Saw “Powered by Riftori” on a store', sellers: 121, paid: 29 },
  { source: 'YouTube', sellers: 74, paid: 14 },
  { source: 'LinkedIn', sellers: 52, paid: 12 },
  { source: 'WhatsApp group', sellers: 41, paid: 8 },
  { source: 'Google search', sellers: 28, paid: 5 },
  { source: 'Other', sellers: 11, paid: 1 },
]

export const REFERRAL_STATS = {
  signups30: 156,
  paid30: 58,
  conversion: 37,
  monthsCredited30: 232,
  costMonthly: 58 * 2 * 2 * 320,
}

export const TOP_REFERRERS = [
  { store: 'Fit with Rhea', code: 'RHEA2M', signups: 31, paid: 14, months: 28 },
  { store: 'Notion Wala', code: 'NOTION2M', signups: 24, paid: 9, months: 18 },
  { store: 'Priya Crochet', code: 'PRIYA2M', signups: 5, paid: 2, months: 4 },
  { store: 'Career with Dev', code: 'DEV2M', signups: 12, paid: 6, months: 12 },
]

export const FUNNEL = [
  { step: 'Signed up', count: 731 },
  { step: 'Profile done', count: 642 },
  { step: 'Razorpay connected', count: 418 },
  { step: 'First item published', count: 377 },
  { step: 'First sale', count: 241 },
  { step: 'Paid plan', count: 168 },
]

export type Seller = {
  id: string
  store: string
  handle: string
  owner: string
  email: string
  phone: string
  city: string
  category: string
  plan: Plan
  status: SellerStatus
  joined: string
  lastActive: string
  gmv30: number
  gmvPrev30: number
  orders30: number
  buyers: number
  items: number
  modules: Module[]
  razorpay: 'Connected' | 'KYC pending' | 'Not connected'
  conversion: number
  refundRate: number
  health: number
  followers: string
  heardVia: string
  /** Store that referred them, if any */
  referredBy: string
  avatar?: string
}

export const SELLERS: Seller[] = [
  { id: 'sl_priya', store: 'Priya Crochet', handle: 'priya.crochet', owner: 'Priya Nair', email: 'priya@priyacrochet.in', phone: '+91 98201 44312', city: 'Mumbai', category: 'Solopreneur', plan: 'Pro', status: 'Active', joined: '12 Jan 2025', lastActive: '4 min ago', gmv30: 124020, gmvPrev30: 93800, orders30: 86, buyers: 412, items: 15, modules: ['Events', 'Meetings', 'Digital', 'Physical'], razorpay: 'Connected', conversion: 1.8, refundRate: 0.9, heardVia: 'Instagram', referredBy: '', health: 94, followers: '48.2k', avatar: 'https://cdn.magicpatterns.com/patterns/generated-images/f78a912a-ed6c-4239-99d6-6de5a463a89a.jpg' },
  { id: 'sl_fitwithrhea', store: 'Fit with Rhea', handle: 'fitwithrhea', owner: 'Rhea Kapoor', email: 'rhea@fitwithrhea.in', phone: '+91 99876 12093', city: 'Delhi', category: 'Coach', plan: 'Business', status: 'Active', joined: '3 Nov 2024', lastActive: '12 min ago', gmv30: 1842000, gmvPrev30: 1520000, orders30: 1210, buyers: 3920, items: 22, modules: ['Events', 'Meetings', 'Digital'], razorpay: 'Connected', conversion: 3.4, refundRate: 1.1, heardVia: 'YouTube', referredBy: '', health: 97, followers: '412k' },
  { id: 'sl_mumbaibeats', store: 'Mumbai Beats Live', handle: 'mumbaibeats', owner: 'Karan Mehta', email: 'karan@mumbaibeats.in', phone: '+91 98190 33871', city: 'Mumbai', category: 'Event company', plan: 'Business', status: 'Active', joined: '20 Sep 2024', lastActive: '1 h ago', gmv30: 2214000, gmvPrev30: 2680000, orders30: 1488, buyers: 5102, items: 9, modules: ['Events'], razorpay: 'Connected', conversion: 4.1, refundRate: 3.8, heardVia: 'Google search', referredBy: '', health: 71, followers: '186k' },
  { id: 'sl_thriftkaro', store: 'Thrift Karo', handle: 'thriftkaro', owner: 'Sana Qureshi', email: 'sana@thriftkaro.com', phone: '+91 90044 76120', city: 'Pune', category: 'Small business', plan: 'Starter', status: 'Active', joined: '8 Feb 2025', lastActive: '2 h ago', gmv30: 286400, gmvPrev30: 241000, orders30: 312, buyers: 1104, items: 148, modules: ['Physical'], razorpay: 'Connected', conversion: 2.2, refundRate: 2.4, heardVia: 'A friend or another seller', referredBy: 'Priya Crochet', health: 82, followers: '61k' },
  { id: 'sl_notionwala', store: 'Notion Wala', handle: 'notionwala', owner: 'Aditya Rao', email: 'aditya@notionwala.in', phone: '+91 97400 55218', city: 'Bengaluru', category: 'Creator', plan: 'Pro', status: 'Active', joined: '14 Dec 2024', lastActive: '30 min ago', gmv30: 642000, gmvPrev30: 598000, orders30: 1820, buyers: 6240, items: 31, modules: ['Digital', 'Meetings'], razorpay: 'Connected', conversion: 5.6, refundRate: 0.4, heardVia: 'LinkedIn', referredBy: '', health: 96, followers: '224k' },
  { id: 'sl_bakebyanu', store: 'Bake by Anu', handle: 'bakebyanu', owner: 'Anusha Reddy', email: 'anu@bakebyanu.in', phone: '+91 98490 22015', city: 'Hyderabad', category: 'Small business', plan: 'Starter', status: 'Past due', joined: '2 Mar 2025', lastActive: '3 days ago', gmv30: 48200, gmvPrev30: 61300, orders30: 74, buyers: 188, items: 12, modules: ['Physical', 'Events'], razorpay: 'Connected', conversion: 1.2, refundRate: 1.6, heardVia: 'Saw “Powered by Riftori” on a store', referredBy: '', health: 58, followers: '9.4k' },
  { id: 'sl_careerwithdev', store: 'Career with Dev', handle: 'careerwithdev', owner: 'Dev Sharma', email: 'dev@careerwithdev.com', phone: '+91 99100 84421', city: 'Gurugram', category: 'Coach', plan: 'Pro', status: 'Active', joined: '22 Jan 2025', lastActive: '5 h ago', gmv30: 398000, gmvPrev30: 312000, orders30: 284, buyers: 970, items: 6, modules: ['Meetings', 'Digital'], razorpay: 'Connected', conversion: 2.9, refundRate: 0.7, heardVia: 'LinkedIn', referredBy: '', health: 91, followers: '138k' },
  { id: 'sl_inkandclay', store: 'Ink & Clay Studio', handle: 'inkandclay', owner: 'Meera Iyer', email: 'meera@inkandclay.in', phone: '+91 94440 12876', city: 'Chennai', category: 'Student', plan: 'Trial', status: 'Trial', joined: '1 Jun 2025', lastActive: '1 h ago', gmv30: 12600, gmvPrev30: 0, orders30: 9, buyers: 9, items: 4, modules: ['Events', 'Physical'], razorpay: 'KYC pending', conversion: 0.9, refundRate: 0, heardVia: 'A friend or another seller', referredBy: 'Priya Crochet', health: 66, followers: '7.8k' },
  { id: 'sl_glowbyzara', store: 'Glow by Zara', handle: 'glowbyzara', owner: 'Zara Sheikh', email: 'zara@glowbyzara.in', phone: '+91 98670 44190', city: 'Mumbai', category: 'Small business', plan: 'Starter', status: 'Suspended', joined: '18 Feb 2025', lastActive: '6 days ago', gmv30: 92400, gmvPrev30: 34000, orders30: 211, buyers: 198, items: 26, modules: ['Physical'], razorpay: 'Connected', conversion: 6.8, refundRate: 11.2, heardVia: 'Instagram', referredBy: '', health: 22, followers: '3.1k' },
  { id: 'sl_yogawithmaya', store: 'Yoga with Maya', handle: 'yogawithmaya', owner: 'Maya Pillai', email: 'maya@yogawithmaya.in', phone: '+91 98950 30114', city: 'Kochi', category: 'Coach', plan: 'Trial', status: 'Trial', joined: '4 Jun 2025', lastActive: '20 min ago', gmv30: 0, gmvPrev30: 0, orders30: 0, buyers: 0, items: 2, modules: ['Events'], razorpay: 'Not connected', conversion: 0, refundRate: 0, heardVia: 'WhatsApp group', referredBy: '', health: 48, followers: '22k' },
  { id: 'sl_chaipeecharcha', store: 'Chai pe Charcha Events', handle: 'chaipecharcha', owner: 'Rohan Joshi', email: 'rohan@cpc.events', phone: '+91 98230 77612', city: 'Pune', category: 'Event company', plan: 'Pro', status: 'Active', joined: '9 Oct 2024', lastActive: '2 h ago', gmv30: 512000, gmvPrev30: 468000, orders30: 820, buyers: 2610, items: 7, modules: ['Events'], razorpay: 'Connected', conversion: 3.7, refundRate: 1.9, heardVia: 'Instagram', referredBy: '', health: 88, followers: '74k' },
  { id: 'sl_pixelpresets', store: 'Pixel Presets', handle: 'pixelpresets', owner: 'Kabir Malhotra', email: 'kabir@pixelpresets.co', phone: '+91 99300 51283', city: 'Delhi', category: 'Creator', plan: 'Starter', status: 'Churned', joined: '15 Nov 2024', lastActive: '24 days ago', gmv30: 0, gmvPrev30: 18400, orders30: 0, buyers: 640, items: 11, modules: ['Digital'], razorpay: 'Connected', conversion: 0, refundRate: 0, heardVia: 'YouTube', referredBy: '', health: 12, followers: '96k' },
]

export const PLAN_PRICE: Record<Plan, number> = { Trial: 0, Starter: 199, Pro: 499, Business: 1499 }

export const PLAN_MIX = [
  { plan: 'Starter' as Plan, sellers: 1312, mrr: 261088 },
  { plan: 'Pro' as Plan, sellers: 341, mrr: 170159 },
  { plan: 'Business' as Plan, sellers: 37, mrr: 55463 },
  { plan: 'Trial' as Plan, sellers: 612, mrr: 0 },
]

export const MRR_MOVEMENT = [
  { label: 'New', value: 38410 },
  { label: 'Upgrades', value: 14970 },
  { label: 'Downgrades', value: -3900 },
  { label: 'Churned', value: -5080 },
]

/** Last 6 months of MRR in ₹ */
export const MRR_MONTHLY = [
  { month: 'Jan', mrr: 168400 },
  { month: 'Feb', mrr: 224900 },
  { month: 'Mar', mrr: 291300 },
  { month: 'Apr', mrr: 362800 },
  { month: 'May', mrr: 441900 },
  { month: 'Jun', mrr: 486300 },
]

export const INVOICES = [
  { id: 'INV-24061', seller: 'Bake by Anu', plan: 'Starter' as Plan, amount: 235, status: 'Failed', date: '6 Jun', note: 'UPI autopay mandate expired · retry 3 of 3 on 9 Jun' },
  { id: 'INV-24058', seller: 'Fit with Rhea', plan: 'Business' as Plan, amount: 1769, status: 'Paid', date: '5 Jun', note: 'Card ••4021' },
  { id: 'INV-24055', seller: 'Notion Wala', plan: 'Pro' as Plan, amount: 589, status: 'Paid', date: '5 Jun', note: 'UPI autopay' },
  { id: 'INV-24051', seller: 'Priya Crochet', plan: 'Pro' as Plan, amount: 589, status: 'Paid', date: '4 Jun', note: 'UPI autopay' },
  { id: 'INV-24047', seller: 'Career with Dev', plan: 'Pro' as Plan, amount: 589, status: 'Paid', date: '3 Jun', note: 'Card ••8890' },
  { id: 'INV-24042', seller: 'Thrift Karo', plan: 'Starter' as Plan, amount: 235, status: 'Refunded', date: '2 Jun', note: 'Double charge — refunded by Ops' },
]

export const TRIALS_ENDING = [
  { store: 'Ink & Clay Studio', owner: 'Meera Iyer', endsIn: '2 days', sales: 9, gmv: 12600, likely: 'High' },
  { store: 'Yoga with Maya', owner: 'Maya Pillai', endsIn: '5 days', sales: 0, gmv: 0, likely: 'Low' },
  { store: 'The Sourdough Club', owner: 'Ira Banerjee', endsIn: '6 days', sales: 22, gmv: 18900, likely: 'High' },
  { store: 'Doodle Diaries', owner: 'Tanvi Shah', endsIn: '8 days', sales: 3, gmv: 1497, likely: 'Medium' },
]

export type Buyer = {
  id: string
  name: string
  email: string
  phone: string
  city: string
  orders: number
  spent: number
  stores: string[]
  firstSeen: string
  lastOrder: string
  refunds: number
}

export const BUYERS: Buyer[] = [
  { id: 'by_ananya', name: 'Ananya Rao', email: 'ananya.rao@gmail.com', phone: '+91 99300 11872', city: 'Mumbai', orders: 7, spent: 9420, stores: ['Priya Crochet', 'Notion Wala'], firstSeen: '14 Feb 2025', lastOrder: '12 min ago', refunds: 0 },
  { id: 'by_kavya', name: 'Kavya Menon', email: 'kavya.m@gmail.com', phone: '+91 98450 22113', city: 'Bengaluru', orders: 3, spent: 4210, stores: ['Priya Crochet', 'Thrift Karo'], firstSeen: '2 Apr 2025', lastOrder: '4 min ago', refunds: 0 },
  { id: 'by_ishaan', name: 'Ishaan Verma', email: 'ishaan.v@outlook.com', phone: '+91 98110 64420', city: 'Delhi', orders: 12, spent: 21480, stores: ['Fit with Rhea', 'Career with Dev', 'Mumbai Beats Live'], firstSeen: '20 Nov 2024', lastOrder: 'Yesterday', refunds: 1 },
  { id: 'by_neha', name: 'Neha Kulkarni', email: 'neha.k@gmail.com', phone: '+91 99220 41875', city: 'Pune', orders: 4, spent: 3249, stores: ['Priya Crochet', 'Chai pe Charcha Events'], firstSeen: '9 Mar 2025', lastOrder: '2 days ago', refunds: 0 },
  { id: 'by_rahul', name: 'Rahul Gupta', email: 'rahulg.92@gmail.com', phone: '+91 97170 23651', city: 'Noida', orders: 2, spent: 5998, stores: ['Mumbai Beats Live'], firstSeen: '28 May 2025', lastOrder: '3 days ago', refunds: 1 },
  { id: 'by_fatima', name: 'Fatima Ansari', email: 'fatima.ansari@yahoo.in', phone: '+91 98201 90876', city: 'Mumbai', orders: 6, spent: 2894, stores: ['Notion Wala', 'Glow by Zara'], firstSeen: '11 Jan 2025', lastOrder: '5 days ago', refunds: 2 },
  { id: 'by_aditi', name: 'Aditi Shah', email: 'aditi.shah@gmail.com', phone: '+91 98190 70032', city: 'Ahmedabad', orders: 2, spent: 20350, stores: ['Priya Crochet'], firstSeen: '30 Apr 2025', lastOrder: '3 days ago', refunds: 0 },
  { id: 'by_sameer', name: 'Sameer Khan', email: 'sameer.k@gmail.com', phone: '+91 90040 12398', city: 'Hyderabad', orders: 9, spent: 7810, stores: ['Fit with Rhea', 'Bake by Anu'], firstSeen: '6 Dec 2024', lastOrder: '1 week ago', refunds: 0 },
]

export type OrderStatus = 'Paid' | 'Fulfilled' | 'Packed' | 'Dispatched' | 'Delivered' | 'Refunded' | 'Disputed' | 'Failed'

export type PlatformOrder = {
  id: string
  buyerId: string
  buyer: string
  seller: string
  item: string
  module: Module
  amount: number
  status: OrderStatus
  paymentId: string
  method: 'UPI' | 'Card' | 'Netbanking'
  time: string
}

export const ORDERS: PlatformOrder[] = [
  { id: 'SF-2487', buyerId: 'by_kavya', buyer: 'Kavya Menon', seller: 'Priya Crochet', item: 'Striped market tote', module: 'Physical', amount: 1850, status: 'Paid', paymentId: 'pay_PQ8k21LmZt4x', method: 'UPI', time: '4 min ago' },
  { id: 'MB-88120', buyerId: 'by_rahul', buyer: 'Rahul Gupta', seller: 'Mumbai Beats Live', item: 'Sunburn Arena — GA × 2', module: 'Events', amount: 5998, status: 'Disputed', paymentId: 'pay_PQ7h90AkWe2b', method: 'Card', time: '3 days ago' },
  { id: 'SF-2485', buyerId: 'by_ananya', buyer: 'Ananya Rao', seller: 'Priya Crochet', item: 'Saturday Amigurumi Workshop × 2', module: 'Events', amount: 3600, status: 'Paid', paymentId: 'pay_PQ8j77NbXr1c', method: 'UPI', time: '12 min ago' },
  { id: 'NW-11042', buyerId: 'by_fatima', buyer: 'Fatima Ansari', seller: 'Notion Wala', item: 'Second Brain template', module: 'Digital', amount: 499, status: 'Fulfilled', paymentId: 'pay_PQ6e10QqTu8m', method: 'UPI', time: '5 days ago' },
  { id: 'FR-30981', buyerId: 'by_ishaan', buyer: 'Ishaan Verma', seller: 'Fit with Rhea', item: '12-week shred program', module: 'Digital', amount: 2999, status: 'Fulfilled', paymentId: 'pay_PQ7x41ZpLs6d', method: 'Card', time: 'Yesterday' },
  { id: 'GZ-0418', buyerId: 'by_fatima', buyer: 'Fatima Ansari', seller: 'Glow by Zara', item: 'Korean glass-skin kit', module: 'Physical', amount: 1299, status: 'Refunded', paymentId: 'pay_PQ5r82KoVb3n', method: 'UPI', time: '6 days ago' },
  { id: 'SF-2482', buyerId: 'by_neha', buyer: 'Neha Kulkarni', seller: 'Priya Crochet', item: 'Chai coaster set × 2', module: 'Physical', amount: 1300, status: 'Dispatched', paymentId: 'pay_PQ6q55HyMi9a', method: 'UPI', time: '2 days ago' },
  { id: 'CD-5521', buyerId: 'by_ishaan', buyer: 'Ishaan Verma', seller: 'Career with Dev', item: 'Resume review · 45 min', module: 'Meetings', amount: 1499, status: 'Fulfilled', paymentId: 'pay_PQ6w30JdCe5k', method: 'UPI', time: '4 days ago' },
  { id: 'SF-2478', buyerId: 'by_aditi', buyer: 'Aditi Shah', seller: 'Priya Crochet', item: 'Coorg crochet retreat · Shared', module: 'Events', amount: 18500, status: 'Paid', paymentId: 'pay_PQ6a12RfGh7p', method: 'Netbanking', time: '3 days ago' },
  { id: 'BA-0912', buyerId: 'by_sameer', buyer: 'Sameer Khan', seller: 'Bake by Anu', item: 'Biscoff cheesecake (1 kg)', module: 'Physical', amount: 1450, status: 'Failed', paymentId: 'pay_PQ4m71UiOp0s', method: 'UPI', time: '1 week ago' },
]

export type Txn = {
  id: string
  orderId: string
  seller: string
  buyer: string
  amount: number
  gatewayFee: number
  method: 'UPI' | 'Card' | 'Netbanking'
  status: 'Captured' | 'Failed' | 'Refunded' | 'Disputed' | 'Pending'
  settlement: string
  time: string
  reason?: string
  vpa?: string
}

export const TRANSACTIONS: Txn[] = [
  { id: 'pay_PQ8k21LmZt4x', orderId: 'SF-2487', seller: 'Priya Crochet', buyer: 'Kavya Menon', amount: 1850, gatewayFee: 37, method: 'UPI', status: 'Captured', settlement: 'T+2 · 11 Jun', time: '10 Jun, 6:41 pm', vpa: 'kavya.m@okaxis' },
  { id: 'pay_PQ8j77NbXr1c', orderId: 'SF-2485', seller: 'Priya Crochet', buyer: 'Ananya Rao', amount: 3600, gatewayFee: 72, method: 'UPI', status: 'Captured', settlement: 'T+2 · 11 Jun', time: '10 Jun, 6:33 pm', vpa: 'ananya.rao@okicici' },
  { id: 'pay_PQ8f12AbCd9e', orderId: 'FR-31002', seller: 'Fit with Rhea', buyer: 'Pooja Desai', amount: 2999, gatewayFee: 60, method: 'UPI', status: 'Failed', settlement: '—', time: '10 Jun, 6:20 pm', reason: 'Bank server down (U30) — buyer retried and succeeded', vpa: 'pooja.d@ybl' },
  { id: 'pay_PQ7x41ZpLs6d', orderId: 'FR-30981', seller: 'Fit with Rhea', buyer: 'Ishaan Verma', amount: 2999, gatewayFee: 71, method: 'Card', status: 'Captured', settlement: 'Settled · 9 Jun', time: '9 Jun, 11:02 am' },
  { id: 'pay_PQ7h90AkWe2b', orderId: 'MB-88120', seller: 'Mumbai Beats Live', buyer: 'Rahul Gupta', amount: 5998, gatewayFee: 142, method: 'Card', status: 'Disputed', settlement: 'On hold', time: '7 Jun, 9:14 pm', reason: 'Chargeback: “Event postponed, no refund received”. Respond by 14 Jun.' },
  { id: 'pay_PQ6q55HyMi9a', orderId: 'SF-2482', seller: 'Priya Crochet', buyer: 'Neha Kulkarni', amount: 1300, gatewayFee: 26, method: 'UPI', status: 'Captured', settlement: 'Settled · 10 Jun', time: '8 Jun, 4:47 pm', vpa: 'nehak@okhdfcbank' },
  { id: 'pay_PQ6e10QqTu8m', orderId: 'NW-11042', seller: 'Notion Wala', buyer: 'Fatima Ansari', amount: 499, gatewayFee: 10, method: 'UPI', status: 'Captured', settlement: 'Settled · 7 Jun', time: '5 Jun, 10:15 am', vpa: 'fatima.a@paytm' },
  { id: 'pay_PQ5r82KoVb3n', orderId: 'GZ-0418', seller: 'Glow by Zara', buyer: 'Fatima Ansari', amount: 1299, gatewayFee: 26, method: 'UPI', status: 'Refunded', settlement: 'Refund rfnd_PQ6c · 6 Jun', time: '4 Jun, 2:30 pm', reason: 'Item not as described — refunded after Ops review' },
  { id: 'pay_PQ6a12RfGh7p', orderId: 'SF-2478', seller: 'Priya Crochet', buyer: 'Aditi Shah', amount: 18500, gatewayFee: 370, method: 'Netbanking', status: 'Captured', settlement: 'Settled · 9 Jun', time: '7 Jun, 1:08 pm' },
  { id: 'pay_PQ4m71UiOp0s', orderId: 'BA-0912', seller: 'Bake by Anu', buyer: 'Sameer Khan', amount: 1450, gatewayFee: 29, method: 'UPI', status: 'Failed', settlement: '—', time: '3 Jun, 7:55 pm', reason: 'Collect request expired (U69) — buyer did not approve in UPI app', vpa: 'sameer.k@ibl' },
  { id: 'pay_PQ9a03TtYy4q', orderId: 'CP-7712', seller: 'Chai pe Charcha Events', buyer: 'Rohit Iyer', amount: 799, gatewayFee: 16, method: 'UPI', status: 'Pending', settlement: '—', time: '10 Jun, 6:44 pm', reason: 'Awaiting bank confirmation (2 min)' },
]

export type Ticket = {
  id: string
  from: 'Seller' | 'Buyer'
  name: string
  email: string
  subject: string
  category: 'Payments' | 'Payouts' | 'Order issue' | 'Refund' | 'Account' | 'Billing' | 'Report'
  priority: 'Urgent' | 'High' | 'Normal' | 'Low'
  status: 'Open' | 'Waiting on user' | 'Resolved'
  age: string
  sla: 'Breached' | 'Due soon' | 'OK'
  assignee: string
  linked?: string
  thread: { who: string; when: string; text: string }[]
}

export const TICKETS: Ticket[] = [
  {
    id: 'RF-20418', from: 'Buyer', name: 'Rahul Gupta', email: 'rahulg.92@gmail.com', subject: 'Event postponed, seller not refunding', category: 'Refund', priority: 'Urgent', status: 'Open', age: '26 h', sla: 'Breached', assignee: 'Unassigned', linked: 'MB-88120',
    thread: [
      { who: 'Rahul Gupta', when: '9 Jun, 4:10 pm', text: 'Sunburn Arena show on 8 Jun was postponed. I asked Mumbai Beats for a refund on Instagram twice, no reply. I paid ₹5,998 for 2 tickets. Order MB-88120.' },
      { who: 'Riftori bot', when: '9 Jun, 4:10 pm', text: 'Linked order MB-88120 · payment pay_PQ7h90AkWe2b · card chargeback opened 7 Jun.' },
    ],
  },
  {
    id: 'RF-20415', from: 'Seller', name: 'Anusha Reddy', email: 'anu@bakebyanu.in', subject: 'Subscription payment failing, store will go offline?', category: 'Billing', priority: 'High', status: 'Open', age: '9 h', sla: 'Due soon', assignee: 'Neha (Billing)', linked: 'INV-24061',
    thread: [{ who: 'Anusha Reddy', when: '10 Jun, 9:30 am', text: 'My UPI autopay failed. Please don’t switch off my store, I have 6 cake orders for the weekend.' }],
  },
  {
    id: 'RF-20412', from: 'Seller', name: 'Meera Iyer', email: 'meera@inkandclay.in', subject: 'Razorpay KYC stuck for 4 days', category: 'Payments', priority: 'High', status: 'Waiting on user', age: '2 d', sla: 'OK', assignee: 'Arjun (Ops)', linked: 'sl_inkandclay',
    thread: [{ who: 'Meera Iyer', when: '8 Jun, 11:00 am', text: 'Razorpay says KYC under review. Buyers can’t pay. What do I do?' }, { who: 'Arjun (Ops)', when: '8 Jun, 2:15 pm', text: 'Razorpay needs a clearer PAN photo. I’ve sent you the re-upload link — reply here once done and I’ll escalate.' }],
  },
  {
    id: 'RF-20409', from: 'Buyer', name: 'Neha Kulkarni', email: 'neha.k@gmail.com', subject: 'Where is my parcel?', category: 'Order issue', priority: 'Normal', status: 'Open', age: '5 h', sla: 'OK', assignee: 'Sara (Support)', linked: 'SF-2482',
    thread: [{ who: 'Neha Kulkarni', when: '10 Jun, 1:40 pm', text: 'Order SF-2482 shows dispatched but tracking isn’t updating.' }],
  },
  {
    id: 'RF-20401', from: 'Buyer', name: 'Fatima Ansari', email: 'fatima.ansari@yahoo.in', subject: 'Received a fake product — Glow by Zara', category: 'Report', priority: 'High', status: 'Resolved', age: '6 d', sla: 'OK', assignee: 'Arjun (Ops)', linked: 'GZ-0418',
    thread: [{ who: 'Fatima Ansari', when: '4 Jun, 3:00 pm', text: 'The serum is clearly counterfeit.' }, { who: 'Arjun (Ops)', when: '6 Jun, 10:20 am', text: 'Refund issued (rfnd_PQ6c). Store suspended pending review. Thank you for reporting.' }],
  },
  {
    id: 'RF-20398', from: 'Seller', name: 'Dev Sharma', email: 'dev@careerwithdev.com', subject: 'Can I connect a custom domain?', category: 'Account', priority: 'Low', status: 'Open', age: '1 d', sla: 'OK', assignee: 'Sara (Support)',
    thread: [{ who: 'Dev Sharma', when: '9 Jun, 6:00 pm', text: 'I’m on Pro. How do I point careerwithdev.com at my store?' }],
  },
]

export const RISK_FLAGS = [
  { id: 'rk_1', store: 'Glow by Zara', sellerId: 'sl_glowbyzara', reason: 'Counterfeit reports (4) · refund rate 11.2%', severity: 'Critical', action: 'Suspended', since: '6 Jun', exposure: 92400 },
  { id: 'rk_2', store: 'Mumbai Beats Live', sellerId: 'sl_mumbaibeats', reason: 'Event postponed · 38 refund requests · 1 chargeback', severity: 'High', action: 'Settlements on hold', since: '8 Jun', exposure: 227924 },
  { id: 'rk_3', store: 'Quick Cash Course', sellerId: 'sl_qcc', reason: 'Prohibited: “guaranteed income” claims flagged by keyword scan', severity: 'Medium', action: 'Under review', since: '10 Jun', exposure: 8970 },
]

export const KYC_QUEUE = [
  { store: 'Ink & Clay Studio', owner: 'Meera Iyer', submitted: '6 Jun', issue: 'PAN photo unclear', waiting: '4 d' },
  { store: 'The Sourdough Club', owner: 'Ira Banerjee', submitted: '9 Jun', issue: 'Bank name mismatch', waiting: '1 d' },
  { store: 'Doodle Diaries', owner: 'Tanvi Shah', submitted: '10 Jun', issue: 'In review with Razorpay', waiting: '6 h' },
]

export const REPORTS = [
  { id: 'rp_1', store: 'Glow by Zara', by: 'Fatima Ansari', reason: 'Counterfeit product', when: '4 Jun', status: 'Actioned' },
  { id: 'rp_2', store: 'Quick Cash Course', by: 'Anonymous', reason: 'Misleading income claims', when: '10 Jun', status: 'New' },
  { id: 'rp_3', store: 'Mumbai Beats Live', by: 'Rahul Gupta', reason: 'Event cancelled, no refund', when: '9 Jun', status: 'In review' },
  { id: 'rp_4', store: 'Thrift Karo', by: 'Anonymous', reason: 'Item condition not as shown', when: '7 Jun', status: 'Dismissed' },
]

export const SYSTEM_HEALTH = [
  { name: 'Checkout API', value: '99.98%', ok: true },
  { name: 'Razorpay webhooks', value: '142 ms', ok: true },
  { name: 'UPI success (1 h)', value: '96.4%', ok: true },
  { name: 'Email delivery', value: '98.9%', ok: true },
  { name: 'File downloads', value: 'Degraded', ok: false },
]

export const AUDIT_LOG = [
  { who: 'Arjun (Ops)', what: 'Suspended Glow by Zara', when: '6 Jun, 10:18 am' },
  { who: 'Arjun (Ops)', what: 'Refunded ₹1,299 on GZ-0418', when: '6 Jun, 10:20 am' },
  { who: 'Neha (Billing)', what: 'Refunded INV-24042 (double charge)', when: '2 Jun, 4:02 pm' },
  { who: 'System', what: 'Put Mumbai Beats Live settlements on hold', when: '8 Jun, 9:00 am' },
]

/** Seller detail extras, keyed by seller id */
export const SELLER_GMV_DAILY: Record<string, number[]> = {
  sl_priya: [2100, 3200, 1800, 4100, 2600, 5800, 6400, 1900, 3800, 4200, 3100, 7200, 6100, 2400, 3300, 4100, 2900, 5600, 4800, 6900, 7600, 2200, 3100, 4400, 3700, 5100, 8800, 6900, 1850, 3600],
}

export function inr(n: number): string {
  return '₹' + Math.round(n).toLocaleString('en-IN')
}

/** ₹2.84 Cr / ₹4.86 L style, for headline numbers */
export function inrShort(n: number): string {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(2)} L`
  return inr(n)
}

export function pctChange(now: number, prev: number): number {
  if (!prev) return 0
  return Math.round(((now - prev) / prev) * 1000) / 10
}
