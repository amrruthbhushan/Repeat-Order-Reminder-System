# 🚀 Repeat Order Reminder System for Ganga Maxx Marketplace

A production-ready, modern full-stack B2B web application designed to automatically predict institutional customer replenishment cycles, automate reorders for cleaning and hygiene products, and streamline sales operations.

---

## 🌟 Key System Highlights

- **AI Predictive Reminder Engine**: Computes consumption cadence (e.g., 15-day hospital cycles, 30-day corporate cycles), predicts low-stock dates, and generates human-like reorder outreach summaries.
- **Role-Based Access Control (RBAC)**: Support for 6 distinct enterprise roles:
  - 👑 **Admin** (Full system access)
  - 💼 **Sales Admin** & 🧑‍💼 **Salesman** (Client management & dispatch)
  - 📦 **Warehouse Staff** (Stock balance & safety warnings)
  - 💳 **Accounts Manager** (Revenue & PO tracking)
  - ⚖️ **Compliance Admin** (Product chemical safety specs)
- **Multi-Channel Dispatch Simulator**: Instant WhatsApp and Email preview drawer with customizable dynamic parameters.
- **Modern SaaS Aesthetics**: Styled with Tailwind CSS, Framer Motion entry micro-animations, glassmorphism containers, dark mode toggling, and interactive Recharts data visualization.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS & Glassmorphism Design System
- **Icons**: Lucide Icons
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **Analytics Charts**: Recharts

### Backend
- **Runtime**: Node.js & Express.js
- **ORM**: Prisma ORM
- **Database**: SQLite (Local Dev / Neon PostgreSQL ready)
- **Authentication**: JSON Web Tokens (JWT) & Bcrypt password hashing

---

## 🚀 Quick Start Guide

### 1. Backend Setup
```bash
cd backend
npm install
npx prisma db push
node prisma/seed.js
npm run dev
```
The server will start at `http://localhost:5000`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The application will launch at `http://localhost:3000`.

---

## 🔐 Demo Accounts (Password: `password123`)

| Role | Email |
| :--- | :--- |
| **Admin** | `admin@gangamaxx.com` |
| **Salesman** | `rajesh@gangamaxx.com` |
| **Warehouse Staff** | `warehouse@gangamaxx.com` |
| **Accounts Manager** | `accounts@gangamaxx.com` |

*Note: You can also use the live Role Simulator pill in the top navbar to instantly preview the UI as any role!*

---

## ☁️ Production Deployment Configuration

- **Frontend (Vercel)**: Configured via Vite proxy and single-page application rewrites.
- **Backend (Render / Railway)**: Standard `npm start` command launching Express API.
- **Database (Neon PostgreSQL)**: Change `provider = "postgresql"` in `prisma/schema.prisma` and update `DATABASE_URL`.
