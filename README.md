# 🌐 TradeFlow

> A full-stack global trade platform connecting buyers and sellers worldwide with secure escrow payments, real-time chat, AI-powered insights, and integrated logistics.

## 📌 About

TradeFlow is a global marketplace web app that lets buyers and sellers manage international trade end-to-end — from listing products and placing orders to tracking shipments, chatting in real time, and resolving disputes. Built with React, TypeScript, and Supabase.

---

## ✨ Features

- 🛒 **Global Marketplace** — Browse, list, and purchase products by category with cart and checkout flow
- 📦 **Order Management** — Full order lifecycle: pending → confirmed → shipped → delivered, with buyer/seller role views
- 💬 **Real-time Chat** — Supabase-powered messaging between traders with live updates and unread counts
- 💰 **Wallet & Escrow** — Multi-currency wallet with transaction history and escrow payment support
- 🚚 **Shipping Tracker** — Track active shipments, view carrier details, and monitor country import rules
- 💱 **Currency Converter** — Live exchange rates for major global currencies
- 📄 **Document Management** — Generate and manage invoices, customs forms, and export certificates
- 🤖 **AI Trade Assistant** — Get market insights, pricing recommendations, and demand forecasts
- 📊 **Market Analytics** — Trending products, top trading countries, and growth metrics
- ⭐ **Reviews & Trust Score** — Buyer/seller ratings and detailed feedback system
- ⚖️ **Dispute Resolution** — File and track trade disputes with resolution status
- 🔐 **Security Center** — Activity log, 2FA status, KYC verification, and risk monitoring
- 🔔 **Notifications** — Real-time alerts for orders, payments, shipments, and messages
- ⚙️ **Settings** — Profile management, notification preferences, and language/region options
- 🌙 **Dark Mode** — Full light/dark theme support via CSS variables

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, shadcn/ui |
| Backend & DB | Supabase (PostgreSQL + Auth + Realtime) |
| State Management | TanStack Query (React Query) |
| Routing | React Router DOM v6 |
| Icons | Lucide React |
| Notifications | Sonner + shadcn Toast |

---

## 🗄️ Database Schema

TradeFlow uses Supabase with the following tables:

- `profiles` — User profile info (name, business, country, KYC status)
- `products` — Marketplace listings (title, price, category, stock, seller)
- `cart_items` — Shopping cart (user, product, quantity)
- `orders` — Trade orders (buyer, seller, status, shipping address)
- `order_items` — Line items per order (product, quantity, price)
- `messages` — Chat messages between traders (sender, receiver, read status)

---

## 🚀 Getting Started
### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/tradeflow.git

# 2. Navigate into the project
cd tradeflow

# 3. Install dependencies
npm install

# 4. Set up environment variables
cp .env.example .env
```


### Run Locally

```bash
npm run dev
```

App will be running at `http://localhost:8080`

---

## 📂 Project Structure

```
tradeflow/
├── src/
│   ├── components/         # Shared UI components
│   │   ├── AppSidebar.tsx  # Collapsible navigation sidebar
│   │   ├── DashboardLayout.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── StatCard.tsx
│   ├── contexts/
│   │   ├── AuthContext.tsx  # Supabase auth state
│   │   └── CartContext.tsx  # Global cart state
│   ├── hooks/              # Custom React hooks
│   ├── integrations/
│   │   └── supabase/       # Supabase client + TypeScript types
│   ├── pages/
│   │   ├── auth/           # SignIn, SignUp, Reset/NewPassword
│   │   ├── Dashboard.tsx
│   │   ├── Marketplace.tsx
│   │   ├── Orders.tsx
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   ├── Chat.tsx
│   │   ├── WalletPage.tsx
│   │   ├── Shipping.tsx
│   │   ├── Currency.tsx
│   │   ├── Documents.tsx
│   │   ├── AIAssistant.tsx
│   │   ├── Analytics.tsx
│   │   ├── Reviews.tsx
│   │   ├── Disputes.tsx
│   │   ├── Security.tsx
│   │   ├── Notifications.tsx
│   │   └── SettingsPage.tsx
│   └── lib/
│       └── utils.ts        # Tailwind class merge utility
├── index.html
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🌐 Live Demo

👉 **(http://localhost:8080/landing)**

*(Replace with your deployed URL — see deployment section below)*



## 📜 Available Scripts

```bash
npm run dev        # Start development server (port 8080)
npm run build      # Build for production
npm run preview    # Preview production build locally
npm run lint       # Run ESLint
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push
5. Open a Pull Request

---

## 👤 Author

**Developer - Sagar Pokhrel** 
**LinkedIn: (https://www.linkedin.com/in/sagar-pokhrel-436608377/)**

**Developer - Sulochana Pokhrel**
**LinkdIn: (https://www.linkedin.com/in/sulochana-pokhrel-72701b347/)**


⭐ If you found this project useful, please give it a star on GitHub!

*© 2026 TradeFlow. All rights reserved.*
