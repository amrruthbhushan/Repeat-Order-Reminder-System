# 🚀 Repeat Order Reminder System for Ganga Maxx Marketplace

A production-ready, modern full-stack B2B web application designed to automatically predict institutional customer replenishment cycles, automate reorders for cleaning and hygiene products, and streamline sales operations.

---

## 🌟 Production Deployment Configurations Configured

The repository is pre-configured for instant production deployment:
1. **Prisma PostgreSQL Config**: Updated `[backend/prisma/schema.prisma](file:///c:/Users/amrru/OneDrive/Desktop/Repeat%20Order%20Reminder%20System/backend/prisma/schema.prisma)` to `postgresql` datasource provider.
2. **Dynamic Production API Base URL**: Updated `[frontend/src/services/api.js](file:///c:/Users/amrru/OneDrive/Desktop/Repeat%20Order%20Reminder%20System/frontend/src/services/api.js)` to dynamically pick up `VITE_API_BASE_URL`.
3. **Vercel SPA Rewrites**: Added `[frontend/vercel.json](file:///c:/Users/amrru/OneDrive/Desktop/Repeat%20Order%20Reminder%20System/frontend/vercel.json)` to prevent 404 client routing issues.

---

## ☁️ Deployment Guide

### 1. Database (Neon / Supabase)
- Create a free database on [Neon.tech](https://neon.tech).
- Copy your PostgreSQL connection string.

### 2. Backend (Render / Railway)
- Root Directory: `backend`
- Build Command: `npm install && npx prisma db push && node prisma/seed.js`
- Start Command: `npm start`
- Environment Variables:
  - `DATABASE_URL` = *(Your Neon PostgreSQL URL)*
  - `JWT_SECRET` = `ganga_maxx_prod_secret_2026`

### 3. Frontend (Vercel / Netlify)
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variables:
  - `VITE_API_BASE_URL` = *(Your live Render backend API URL)*

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
- **Database**: PostgreSQL (Neon Ready)
- **Authentication**: JWT & Bcrypt password hashing
