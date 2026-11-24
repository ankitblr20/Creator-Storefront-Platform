export type ItemType = 'event' | 'call' | 'digital' | 'physical' | 'activity' | 'experience'

export type Item = {
  id: string
  type: ItemType
  title: string
  description: string
  /** Longer copy on the product page */
  details: string
  /** What the buyer gets, as a short list */
  includes?: string[]
  /** Date, duration or delivery, as the card shows it */
  when: string
  location?: string
  price: number
  compareAt?: number
  seats?: number
  seatsLeft?: number
  earlyBirdUntil?: string
  stock?: number
  options?: string[]
  slots?: { day: string; times: { time: string; taken?: boolean }[] }[]
  /** Events: ticket types with their own price and capacity */
  tickets?: { name: string; price: number; left: number; note?: string }[]
  /** Physical */
  sku?: string
  dispatch?: string
  /** Digital: the protected file */
  file?: string
  image?: string
  /** Seller-side numbers */
  sold: number
  revenue: number
  views: number
  published: boolean
}

export const IMAGES = {
  cover: 'https://cdn.magicpatterns.com/patterns/generated-images/dfefcd36-0de9-49ba-986e-2ec546265360.jpg',
  avatar: 'https://cdn.magicpatterns.com/patterns/generated-images/f78a912a-ed6c-4239-99d6-6de5a463a89a.jpg',
  workshop: 'https://cdn.magicpatterns.com/patterns/generated-images/f9a1adff-fa40-4b10-a2a7-9ae72dca49e0.jpg',
  kit: 'https://cdn.magicpatterns.com/patterns/generated-images/727231b4-0e95-459a-b612-ec6e469c86b1.jpg',
  retreat: 'https://cdn.magicpatterns.com/patterns/generated-images/02daf64c-24dc-4c1a-80ec-fe3de866bf39.jpg',
  bunny: 'https://cdn.magicpatterns.com/patterns/generated-images/7fb525b2-b5f9-4c5e-9e7c-1417eec3155a.jpg',
  pattern: 'https://cdn.magicpatterns.com/patterns/generated-images/d8d3794c-48cd-4f7c-8874-cf2091b91f9e.jpg',
  tote: 'https://cdn.magicpatterns.com/patterns/generated-images/9e2c170e-d237-4564-a87e-fb5e062ddc7e.jpg',
  coasters: 'https://cdn.magicpatterns.com/patterns/generated-images/912d7b69-5176-405b-8365-3861be859759.jpg',
  course: 'https://cdn.magicpatterns.com/patterns/generated-images/b534e122-88e0-40b6-9d94-7026abc4a255.jpg',
}

export const STORE = {
  name: 'Priya Crochet',
  handle: 'priya.crochet',
  slug: 'priya-crochet',
  link: 'riftori.com/priya-crochet',
  city: 'Mumbai',
  category: 'Solopreneur',
  email: 'priya@priyacrochet.in',
  whatsapp: '+91 98201 44 312',
  brand: '#b4472f',
  bio: 'Handmade amigurumi, beginner kits and weekend workshops. I teach people who swear they "can\'t do crafts" — 600+ students so far.',
  cover: IMAGES.cover,
  avatar: IMAGES.avatar,
  upi: 'priyacrochet@okhdfcbank',
}

export const PLATFORM = { name: 'Riftori', domain: 'riftori.com' }

/** The seller's About page — written by the seller in Settings → Profile */
export const ABOUT = {
  headline: 'Hi, I’m Priya. I teach crochet to people who think they can’t.',
  story: [
    'I picked up a hook in 2019 to get through a long monsoon in Bandra. Two years later, friends were asking for coasters, then lessons, then workshops.',
    'Today I run small weekend workshops in Mumbai and Pune, a weekly online circle, and a little shop of kits and patterns I test on real beginners first.',
  ],
  highlights: [
    { value: '600+', label: 'students taught' },
    { value: '40+', label: 'workshops run' },
    { value: '6 yrs', label: 'crocheting' },
  ],
}

export type ContactChannel = 'instagram' | 'whatsapp' | 'email'

/** How buyers can reach the seller. The seller picks these; nothing else is shown. */
export const CONTACT_PRESETS: Record<string, ContactChannel[]> = {
  'instagram only': ['instagram'],
  'instagram + email': ['instagram', 'email'],
  'whatsapp + instagram': ['whatsapp', 'instagram'],
}

/** The four selling modules a buyer chooses between */
export type ModuleKey = 'events' | 'meetings' | 'digital' | 'physical'

export function moduleOf(t: ItemType): ModuleKey {
  return t === 'call' ? 'meetings' : t === 'digital' ? 'digital' : t === 'physical' ? 'physical' : 'events'
}

/** Buyer-facing modules, in the order the store shows them. A module with no published item is never shown. */
export const CATEGORIES: { key: 'all' | ModuleKey; label: string; shelf: string }[] = [
  { key: 'all', label: 'All', shelf: 'Everything' },
  { key: 'events', label: 'Events', shelf: 'Events & experiences' },
  { key: 'meetings', label: '1:1 Meetings', shelf: '1:1 meetings with Priya' },
  { key: 'digital', label: 'Digital', shelf: 'Patterns & courses' },
  { key: 'physical', label: 'Physical', shelf: 'Kits & handmade' },
]

const SLOTS = [
  { day: 'Tue 10', times: [{ time: '6:00 pm' }, { time: '6:30 pm', taken: true }, { time: '7:00 pm' }] },
  { day: 'Wed 11', times: [{ time: '11:00 am' }, { time: '11:30 am' }, { time: '7:00 pm', taken: true }] },
  { day: 'Fri 13', times: [{ time: '5:00 pm' }, { time: '5:30 pm' }, { time: '6:00 pm' }] },
]

export const ITEMS: Item[] = [
  {
    id: 'amigurumi-workshop',
    type: 'event',
    title: 'Saturday Amigurumi Workshop',
    description: 'Make your first crochet bunny in three hours. Yarn, hook and chai included.',
    details: 'A small, unhurried workshop for complete beginners. We start with holding the hook and end with a bunny you made yourself. Everything is provided — just bring yourself.',
    includes: ['All yarn, hooks and stuffing', 'Printed pattern to take home', 'Chai and snacks', 'Max 12 people'],
    when: 'Sat, 14 Jun · 4–7 pm',
    location: 'The Yarn Social, Bandra',
    price: 1800,
    compareAt: 2200,
    seats: 12,
    seatsLeft: 4,
    earlyBirdUntil: '8 Jun',
    tickets: [
      { name: 'Early bird', price: 1800, left: 4, note: 'Till 8 Jun' },
      { name: 'Regular', price: 2200, left: 0, note: 'Opens 9 Jun' },
      { name: 'Bring a friend (2 seats)', price: 3400, left: 2 },
    ],
    image: IMAGES.workshop,
    sold: 8,
    revenue: 14400,
    views: 1240,
    published: true,
  },
  {
    id: 'pune-meetup',
    type: 'event',
    title: 'Crochet & coffee meetup, Pune',
    description: 'Bring a project, meet other makers, get unstuck over coffee.',
    details: 'A relaxed Sunday meetup at Third Wave, Koregaon Park. Any skill level, any project. Priya will be there to help with stitches and patterns.',
    includes: ['One coffee on us', 'Help with any project', 'Pattern swap table'],
    when: 'Sun, 22 Jun · 10 am–1 pm',
    location: 'Koregaon Park, Pune',
    price: 600,
    seats: 30,
    seatsLeft: 18,
    tickets: [
      { name: 'General', price: 600, left: 18, note: 'Includes one coffee' },
      { name: 'Student', price: 400, left: 5, note: 'Show college ID at the door' },
    ],
    image: IMAGES.coasters,
    sold: 12,
    revenue: 7200,
    views: 610,
    published: true,
  },
  {
    id: 'beginner-kit',
    type: 'physical',
    title: 'Beginner crochet kit',
    description: 'Three cotton yarns, a wooden hook, markers and a printed coaster guide.',
    details: 'Everything you need to make your first set of coasters. Soft 100% cotton yarn, a 4 mm wooden hook and a step-by-step guide with photos. Packed by hand in Mumbai.',
    includes: ['3 × 50 g cotton yarn', '4 mm wooden hook', 'Stitch markers and needle', 'Printed coaster guide'],
    when: 'Ships in 3 days',
    price: 1450,
    stock: 9,
    options: ['Terracotta', 'Sage', 'Cream'],
    sku: 'PC-KIT-01',
    dispatch: 'Dispatched in 2–3 days',
    image: IMAGES.kit,
    sold: 37,
    revenue: 53650,
    views: 2210,
    published: true,
  },
  {
    id: 'market-tote',
    type: 'physical',
    title: 'Striped market tote',
    description: 'Handmade cotton tote with terracotta stripes. Holds a week of vegetables.',
    details: 'Each tote takes Priya about 14 hours. Sturdy double-stitched handles, a wooden button and a lining pocket. Made in small batches.',
    includes: ['Approx. 38 × 40 cm', 'Machine wash cold', 'Lined inner pocket'],
    when: 'Ships in 5 days · 3 left',
    price: 1850,
    stock: 3,
    options: ['Terracotta stripe', 'Sage stripe'],
    sku: 'PC-TOTE-02',
    dispatch: 'Dispatched in 5 days',
    image: IMAGES.tote,
    sold: 11,
    revenue: 20350,
    views: 980,
    published: true,
  },
  {
    id: 'coaster-set',
    type: 'physical',
    title: 'Chai coaster set of six',
    description: 'Round cotton coasters in terracotta, sage, mustard and cream.',
    details: 'Thick, absorbent and washable. A set of six in mixed colours, tied with jute twine — they make a lovely housewarming gift.',
    includes: ['6 coasters, 10 cm across', 'Gift-ready with twine'],
    when: 'Ships in 3 days',
    price: 650,
    stock: 14,
    sku: 'PC-COAST-06',
    dispatch: 'Dispatched in 2–3 days',
    image: IMAGES.coasters,
    sold: 46,
    revenue: 29900,
    views: 1530,
    published: true,
  },
  {
    id: 'bunny-plush',
    type: 'physical',
    title: 'Bunny plush, made to order',
    description: 'The workshop bunny, finished by Priya. Pick the scarf colour.',
    details: 'A 22 cm cream bunny with safety eyes, so it’s fine for little ones. Made to order — it takes about a week.',
    includes: ['22 cm tall', 'Safety eyes', 'Gift note on request'],
    when: 'Made to order · ships in 7 days',
    price: 1200,
    stock: 6,
    options: ['Terracotta scarf', 'Sage scarf', 'Mustard scarf'],
    sku: 'PC-BUN-22',
    dispatch: 'Made to order · 7 days',
    image: IMAGES.bunny,
    sold: 19,
    revenue: 22800,
    views: 1420,
    published: true,
  },
  {
    id: 'sunflower-pattern',
    type: 'digital',
    title: 'Sunflower granny square pattern',
    description: '14-page PDF with photo steps and a chart. Beginner friendly.',
    details: 'The pattern behind Priya’s most-asked-about blanket. Written in US terms with a UK conversion table, every round photographed.',
    includes: ['14-page PDF', 'Stitch chart', 'Blanket layout guide'],
    when: 'Instant PDF download',
    price: 249,
    file: 'sunflower-granny-square.pdf · 4.2 MB',
    image: IMAGES.pattern,
    sold: 143,
    revenue: 35607,
    views: 3820,
    published: true,
  },
  {
    id: 'bunny-pattern',
    type: 'digital',
    title: 'Bunny amigurumi pattern',
    description: 'Make the bunny from the workshop at home. Photo tutorial PDF.',
    details: 'Step-by-step photos for every round, plus tips on stuffing and sewing ears straight (the hard part).',
    includes: ['18-page PDF', 'Video link for the ears', 'Scarf add-on'],
    when: 'Instant PDF download',
    price: 299,
    file: 'bunny-amigurumi.pdf · 6.8 MB',
    image: IMAGES.bunny,
    sold: 88,
    revenue: 26312,
    views: 2150,
    published: true,
  },
  {
    id: 'zero-course',
    type: 'digital',
    title: 'Crochet from zero — video course',
    description: '12 short lessons from first chain to your first finished bag.',
    details: 'Watch at your own pace. Each lesson is under 15 minutes, with a practice piece at the end. Lifetime access.',
    includes: ['12 video lessons', '4 printable patterns', 'Lifetime access'],
    when: 'Instant access',
    price: 1499,
    compareAt: 1999,
    file: '12 lessons · 2.1 GB, streamed',
    image: IMAGES.course,
    sold: 52,
    revenue: 77948,
    views: 2960,
    published: true,
  },
  {
    id: 'intro-call',
    type: 'call',
    title: 'Free 15-min intro call',
    description: 'Tell me what you want to make and I’ll suggest where to start.',
    details: 'A quick video call to figure out the right first project, yarn and hook for you. No sales pitch.',
    when: '15 min · Google Meet',
    price: 0,
    slots: SLOTS,
    sold: 74,
    revenue: 0,
    views: 1880,
    published: true,
  },
  {
    id: 'troubleshoot-call',
    type: 'call',
    title: 'Stuck on a pattern? 1:1 call',
    description: 'Show me your project on video and we fix it together.',
    details: 'Bring your work-in-progress and the pattern. We go stitch by stitch until it makes sense.',
    when: '30 min · Google Meet',
    price: 600,
    slots: SLOTS,
    sold: 21,
    revenue: 12600,
    views: 720,
    published: true,
  },
  {
    id: 'project-call',
    type: 'call',
    title: 'Plan your first blanket',
    description: 'An hour to pick a pattern, yarn and a realistic timeline.',
    details: 'We pick a pattern you’ll finish, choose yarn within your budget, and make a week-by-week plan.',
    when: '60 min · Google Meet',
    price: 1200,
    slots: SLOTS,
    sold: 9,
    revenue: 10800,
    views: 340,
    published: true,
  },
  {
    id: 'crochet-circle',
    type: 'activity',
    title: 'Thursday crochet circle',
    description: 'Bring any project. Two hours of company and help, every week.',
    details: 'A weekly online session on Zoom. Work on anything, ask anything. Most people come for the company.',
    when: 'Thursdays · 7–9 pm',
    location: 'Online',
    price: 350,
    seats: 20,
    seatsLeft: 11,
    sold: 64,
    revenue: 22400,
    views: 890,
    published: true,
  },
  {
    id: 'kids-class',
    type: 'activity',
    title: 'Saturday kids’ class (8–12 yrs)',
    description: 'Finger crochet and simple chains. Kids leave with a bracelet.',
    details: 'A gentle introduction for kids, with chunky yarn and big hooks. Parents can wait in the café.',
    when: 'Saturdays · 11 am–12:30 pm',
    location: 'The Yarn Social, Bandra',
    price: 500,
    seats: 8,
    seatsLeft: 2,
    sold: 30,
    revenue: 15000,
    views: 650,
    published: true,
  },
  {
    id: 'coorg-retreat-2',
    type: 'experience',
    title: 'Coorg crochet retreat, Season 2',
    description: 'Three days on a coffee estate. Stay, meals and materials included.',
    details: 'Misty mornings on the veranda, long afternoons of making, plantation walks. Shared rooms at a family-run homestay.',
    includes: ['2 nights’ stay, all meals', 'All materials', 'Plantation walk', 'Pickup from Madikeri'],
    when: '17–19 Oct',
    location: 'Madikeri, Coorg',
    price: 18500,
    seats: 10,
    seatsLeft: 6,
    tickets: [
      { name: 'Shared room', price: 18500, left: 4 },
      { name: 'Private room', price: 24500, left: 2 },
    ],
    image: IMAGES.retreat,
    sold: 4,
    revenue: 74000,
    views: 1310,
    published: true,
  },
]

export const DRAFTS: Item[] = [
  {
    id: 'blanket-cal',
    type: 'digital',
    title: 'Granny blanket crochet-along',
    description: 'Six weeks, one square a week, with a private group.',
    details: '',
    when: 'Starts 1 Jul',
    price: 999,
    sold: 0,
    revenue: 0,
    views: 0,
    published: false,
  },
]

export const PAST = [
  {
    id: 'coorg-retreat',
    type: 'experience' as ItemType,
    title: 'Crochet retreat in Coorg',
    when: 'Feb 2025 · 3 days',
    outcome: '10 makers, 10 blankets started',
    image: IMAGES.retreat as string | undefined,
  },
  {
    id: 'diwali-coasters',
    type: 'event' as ItemType,
    title: 'Diwali coaster workshop',
    when: 'Nov 2024',
    outcome: 'Sold out · 24 people',
    image: IMAGES.coasters as string | undefined,
  },
  {
    id: 'kala-ghoda',
    type: 'event' as ItemType,
    title: 'Kala Ghoda festival stall',
    when: 'Feb 2024',
    outcome: '9 days · 300+ coasters',
    image: IMAGES.cover as string | undefined,
  },
]

/** Physical orders move New → Packed → Dispatched → Delivered */
export const FULFILMENT = ['New', 'Packed', 'Dispatched', 'Delivered'] as const

export type OrderStatus = 'New' | 'Packed' | 'Dispatched' | 'Delivered' | 'Upcoming' | 'Checked in' | 'Completed' | 'Refunded'

export const ORDERS: {
  id: string
  buyer: string
  email: string
  phone: string
  item: string
  type: ItemType
  amount: number
  when: string
  detail: string
  status: OrderStatus
  address?: string
  note?: string
  tracking?: string
}[] = [
  { id: 'SF-2486', buyer: 'Kavya Menon', email: 'kavya.m@gmail.com', phone: '+91 98450 22113', item: 'Striped market tote', type: 'physical', amount: 1850, when: '4 min ago', detail: 'Terracotta stripe · 1 × tote', status: 'New', address: '14, 6th Cross, HAL 2nd Stage, Indiranagar, Bengaluru 560038', note: 'It’s a birthday gift — please skip the invoice in the box.' },
  { id: 'SF-2485', buyer: 'Ananya Rao', email: 'ananya.rao@gmail.com', phone: '+91 99300 11872', item: 'Saturday Amigurumi Workshop', type: 'event', amount: 3600, when: '12 min ago', detail: '2 seats · Sat 14 Jun', status: 'Upcoming' },
  { id: 'SF-2484', buyer: 'Meher Khanna', email: 'meher.k@outlook.com', phone: '', item: 'Sunflower granny square pattern', type: 'digital', amount: 249, when: '1 h ago', detail: 'Downloaded twice', status: 'Delivered' },
  { id: 'SF-2483', buyer: 'Rohit Iyer', email: 'rohit.iyer@gmail.com', phone: '+91 97690 55420', item: 'Stuck on a pattern? 1:1 call', type: 'call', amount: 600, when: '3 h ago', detail: 'Wed 11 Jun, 11:00 am', status: 'Upcoming' },
  { id: 'SF-2482', buyer: 'Sneha Pillai', email: 'sneha.p@gmail.com', phone: '+91 90040 88761', item: 'Beginner crochet kit', type: 'physical', amount: 1450, when: 'Yesterday', detail: 'Sage · 1 × kit', status: 'Packed', address: 'C-1203, Lodha Amara, Kolshet Road, Thane West 400607' },
  { id: 'SF-2481', buyer: 'Farah Sheikh', email: 'farah.s@gmail.com', phone: '+91 98670 33214', item: 'Thursday crochet circle', type: 'activity', amount: 350, when: 'Yesterday', detail: '1 seat · Thu 12 Jun', status: 'Upcoming' },
  { id: 'SF-2480', buyer: 'Ishita Bose', email: 'ishita.bose@gmail.com', phone: '+91 98300 61107', item: 'Crochet from zero — video course', type: 'digital', amount: 1499, when: '2 days ago', detail: 'Lesson 3 of 12', status: 'Delivered' },
  { id: 'SF-2479', buyer: 'Neha Kulkarni', email: 'neha.k@gmail.com', phone: '+91 99220 41875', item: 'Chai coaster set of six', type: 'physical', amount: 1300, when: '2 days ago', detail: '2 sets', status: 'Dispatched', address: '7, Prabhat Road, Lane 4, Erandwane, Pune 411004', tracking: 'Delhivery 2214 8890 3312' },
  { id: 'SF-2478', buyer: 'Aditi Shah', email: 'aditi.shah@gmail.com', phone: '+91 98190 70032', item: 'Coorg crochet retreat, Season 2', type: 'experience', amount: 18500, when: '3 days ago', detail: '1 seat · 17–19 Oct', status: 'Upcoming' },
  { id: 'SF-2477', buyer: 'Tara D’Souza', email: 'tara.dsouza@gmail.com', phone: '', item: 'Free 15-min intro call', type: 'call', amount: 0, when: '4 days ago', detail: 'Mon 2 Jun, 6:00 pm', status: 'Completed' },
]

export const BOOKINGS = [
  { id: 'b1', day: 'Tue 10 Jun', time: '6:00 pm', title: 'Free 15-min intro call', who: 'Lakshmi Narayan', type: 'call' as ItemType, where: 'Google Meet', count: 1 },
  { id: 'b2', day: 'Wed 11 Jun', time: '11:00 am', title: 'Stuck on a pattern? 1:1 call', who: 'Rohit Iyer', type: 'call' as ItemType, where: 'Google Meet', count: 1 },
  { id: 'b3', day: 'Thu 12 Jun', time: '7:00 pm', title: 'Thursday crochet circle', who: '9 booked', type: 'activity' as ItemType, where: 'Zoom', count: 9 },
  { id: 'b4', day: 'Sat 14 Jun', time: '11:00 am', title: 'Saturday kids’ class', who: '6 of 8 booked', type: 'activity' as ItemType, where: 'The Yarn Social, Bandra', count: 6 },
  { id: 'b5', day: 'Sat 14 Jun', time: '4:00 pm', title: 'Saturday Amigurumi Workshop', who: '8 of 12 booked', type: 'event' as ItemType, where: 'The Yarn Social, Bandra', count: 8 },
  { id: 'b6', day: 'Sun 22 Jun', time: '10:00 am', title: 'Crochet & coffee meetup, Pune', who: '12 of 30 booked', type: 'event' as ItemType, where: 'Koregaon Park, Pune', count: 12 },
]

export const ATTENDEES = ['Ananya Rao (2)', 'Pooja Desai', 'Zoya Merchant', 'Ritu Agarwal', 'Shruti Nair', 'Megha Joshi', 'Ayesha Khan']

export const CUSTOMERS = [
  { name: 'Ananya Rao', email: 'ananya.rao@gmail.com', city: 'Mumbai', orders: 5, spent: 7450, last: '12 min ago', bought: 'Workshop, kit, 2 patterns' },
  { name: 'Ishita Bose', email: 'ishita.bose@gmail.com', city: 'Kolkata', orders: 3, spent: 2047, last: '2 days ago', bought: 'Course, 2 patterns' },
  { name: 'Aditi Shah', email: 'aditi.shah@gmail.com', city: 'Ahmedabad', orders: 2, spent: 19950, last: '3 days ago', bought: 'Retreat, tote' },
  { name: 'Farah Sheikh', email: 'farah.s@gmail.com', city: 'Mumbai', orders: 9, spent: 3150, last: 'Yesterday', bought: 'Crochet circle × 9' },
  { name: 'Neha Kulkarni', email: 'neha.k@gmail.com', city: 'Pune', orders: 2, spent: 1949, last: '2 days ago', bought: 'Coasters, pattern' },
  { name: 'Kavya Menon', email: 'kavya.m@gmail.com', city: 'Bengaluru', orders: 1, spent: 1850, last: '4 min ago', bought: 'Tote' },
  { name: 'Rohit Iyer', email: 'rohit.iyer@gmail.com', city: 'Chennai', orders: 2, spent: 600, last: '3 h ago', bought: 'Intro call, 1:1 call' },
  { name: 'Meher Khanna', email: 'meher.k@outlook.com', city: 'Delhi', orders: 1, spent: 249, last: '1 h ago', bought: 'Pattern' },
]

export const PAYOUTS = [
  { id: 'PO-014', amount: 42000, requested: '2 Jun', status: 'Recorded' },
  { id: 'PO-013', amount: 38500, requested: '19 May', status: 'Recorded' },
  { id: 'PO-012', amount: 51200, requested: '5 May', status: 'Recorded' },
]

/** Ticket holders for the Saturday workshop, for the Events check-in list */
export const EVENT_ATTENDEES = [
  { name: 'Ananya Rao', ticket: 'Bring a friend (2 seats)', order: 'SF-2485', phone: '+91 99300 11872', checkedIn: true },
  { name: 'Pooja Desai', ticket: 'Early bird', order: 'SF-2471', phone: '+91 98201 33445', checkedIn: true },
  { name: 'Zoya Merchant', ticket: 'Early bird', order: 'SF-2468', phone: '+91 99675 21098', checkedIn: false },
  { name: 'Ritu Agarwal', ticket: 'Early bird', order: 'SF-2463', phone: '+91 98923 77810', checkedIn: false },
  { name: 'Shruti Nair', ticket: 'Early bird', order: 'SF-2459', phone: '+91 97029 64512', checkedIn: false },
  { name: 'Megha Joshi', ticket: 'Early bird', order: 'SF-2455', phone: '+91 98330 12876', checkedIn: false },
  { name: 'Ayesha Khan', ticket: 'Early bird', order: 'SF-2450', phone: '+91 90820 45567', checkedIn: false },
]

/** Revenue by module, last 30 days */
export const MODULE_REVENUE = [
  { key: 'events', label: 'Events', revenue: 46200, orders: 31 },
  { key: 'physical', label: 'Physical', revenue: 38750, orders: 27 },
  { key: 'digital', label: 'Digital', revenue: 29470, orders: 64 },
  { key: 'meetings', label: '1:1 Meetings', revenue: 9600, orders: 22 },
]

/** Last 14 days of sales, oldest first, for the revenue chart */
export const DAILY_SALES = [3200, 4100, 2600, 5800, 3900, 7200, 6400, 2900, 4800, 6100, 5300, 8800, 6900, 9700]

export type BagLine = { id: string; qty: number; option?: string }

export function findItem(id: string): Item {
  return [...ITEMS, ...DRAFTS].find((i) => i.id === id) ?? ITEMS[0]
}

export function isBookable(t: ItemType): boolean {
  return t === 'event' || t === 'call' || t === 'activity' || t === 'experience'
}

export function bagTotals(lines: BagLine[]) {
  const subtotal = lines.reduce((s, l) => s + findItem(l.id).price * l.qty, 0)
  const hasPhysical = lines.some((l) => findItem(l.id).type === 'physical')
  const shipping = hasPhysical && subtotal < 1500 ? 80 : 0
  return { subtotal, shipping, total: subtotal + shipping, hasPhysical, count: lines.reduce((s, l) => s + l.qty, 0) }
}

export function formatINR(n: number): string {
  return '₹' + n.toLocaleString('en-IN')
}

export function typeLabel(t: ItemType): string {
  return {
    event: 'Workshop',
    call: '1:1 meeting',
    digital: 'Digital',
    physical: 'Handmade',
    activity: 'Class',
    experience: 'Retreat',
  }[t]
}

/** The seller's names for the six kinds of thing */
export function kindLabel(t: ItemType): string {
  return {
    event: 'Event',
    call: '1:1 meeting',
    digital: 'Digital product',
    physical: 'Physical product',
    activity: 'Activity',
    experience: 'Experience',
  }[t]
}

export function ctaLabel(t: ItemType): string {
  return {
    event: 'Book seat',
    call: 'Book call',
    digital: 'Add to bag',
    physical: 'Add to bag',
    activity: 'Book class',
    experience: 'Reserve',
  }[t]
}
