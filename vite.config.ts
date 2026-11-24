import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const root = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        "about-seller": resolve(root, 'pages/about-seller/index.html'),
        "add-item": resolve(root, 'pages/add-item/index.html'),
        "admin-console": resolve(root, 'pages/admin-console/index.html'),
        "admin-overview": resolve(root, 'pages/admin-overview/index.html'),
        "agent": resolve(root, 'pages/agent/index.html'),
        "analytics": resolve(root, 'pages/analytics/index.html'),
        "bag": resolve(root, 'pages/bag/index.html'),
        "browser": resolve(root, 'pages/browser/index.html'),
        "buyer-agent": resolve(root, 'pages/buyer-agent/index.html'),
        "buyer-storefront": resolve(root, 'pages/buyer-storefront/index.html'),
        "buyers-orders": resolve(root, 'pages/buyers-orders/index.html'),
        "checkout": resolve(root, 'pages/checkout/index.html'),
        "customers": resolve(root, 'pages/customers/index.html'),
        "dashboard": resolve(root, 'pages/dashboard/index.html'),
        "digital-products": resolve(root, 'pages/digital-products/index.html'),
        "events": resolve(root, 'pages/events/index.html'),
        "history": resolve(root, 'pages/history/index.html'),
        "landing": resolve(root, 'pages/landing/index.html'),
        "legal-contact": resolve(root, 'pages/legal-contact/index.html'),
        "meetings": resolve(root, 'pages/meetings/index.html'),
        "my-orders": resolve(root, 'pages/my-orders/index.html'),
        "order-confirmed": resolve(root, 'pages/order-confirmed/index.html'),
        "orders": resolve(root, 'pages/orders/index.html'),
        "orders-2": resolve(root, 'pages/orders-2/index.html'),
        "payments": resolve(root, 'pages/payments/index.html'),
        "physical-products": resolve(root, 'pages/physical-products/index.html'),
        "product-detail": resolve(root, 'pages/product-detail/index.html'),
        "promote": resolve(root, 'pages/promote/index.html'),
        "refer-earn": resolve(root, 'pages/refer-earn/index.html'),
        "risk-moderation": resolve(root, 'pages/risk-moderation/index.html'),
        "seller-agent": resolve(root, 'pages/seller-agent/index.html'),
        "seller-dashboard": resolve(root, 'pages/seller-dashboard/index.html'),
        "seller-profile": resolve(root, 'pages/seller-profile/index.html'),
        "sellers": resolve(root, 'pages/sellers/index.html'),
        "settings": resolve(root, 'pages/settings/index.html'),
        "shop": resolve(root, 'pages/shop/index.html'),
        "sign-up": resolve(root, 'pages/sign-up/index.html'),
        "store-live": resolve(root, 'pages/store-live/index.html'),
        "store-page": resolve(root, 'pages/store-page/index.html'),
        "subscriptions": resolve(root, 'pages/subscriptions/index.html'),
        "support": resolve(root, 'pages/support/index.html'),
        "transactions": resolve(root, 'pages/transactions/index.html'),
        "wallet": resolve(root, 'pages/wallet/index.html'),
      },
    },
  },
})
