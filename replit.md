# TwoDbet - Myanmar Lottery Betting App

## Overview
Full-stack Myanmar 2D/3D lottery betting application with React frontend and Node.js/Express backend.

## Tech Stack
### Frontend
- **Framework:** React 19
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS 4
- **Routing:** React Router 7
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js (CommonJS)
- **Framework:** Express.js
- **Database:** PostgreSQL (Replit built-in)
- **Auth:** JWT (jsonwebtoken)
- **Password:** bcryptjs
- **File Upload:** multer

## Project Structure
```
/
├── src/                    # Frontend source
│   ├── admin/              # Admin panel (Dashboard, Users, Agents, etc.)
│   ├── components/         # Shared UI components
│   ├── pages/              # User-facing pages
│   │   ├── auth/           # Login, Register
│   │   └── ...             # Home, Wallet, Profile, etc.
│   └── utils/
│       └── api.js          # API client utility
├── backend/                # Backend source
│   ├── src/
│   │   ├── app.js          # Express app entry point (port 8000)
│   │   ├── controllers/    # Business logic
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth (JWT), File upload (multer)
│   │   └── db/             # PostgreSQL pool
│   ├── uploads/            # Uploaded receipt images
│   └── seed.js             # Admin user seeder
├── public/                 # Static assets (images)
├── router.jsx              # Frontend routes
└── vite.config.js          # Vite config (port 5000)
```

## API Endpoints
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Current user
- `GET /api/wallet/balance` - User balance
- `POST /api/wallet/deposit` - Submit deposit (with image)
- `POST /api/wallet/withdraw` - Submit withdrawal
- `GET /api/wallet/transactions` - Transaction history
- `GET /api/lottery/results/2d` - 2D results
- `POST /api/lottery/bet/2d` - Place 2D bet
- `GET /api/lottery/history/2d` - Bet history
- `GET /api/notifications` - Notifications
- `GET /api/admin/dashboard` - Admin stats (admin only)
- `GET /api/admin/users` - Users list (admin only)
- `GET /api/admin/deposits` - Deposits (admin only)
- `PATCH /api/admin/deposits/:id/status` - Approve/Reject deposit
- `PATCH /api/admin/withdrawals/:id/status` - Approve/Reject withdrawal
- `POST /api/admin/results/2d` - Publish 2D result

## Database Tables
- `users` - User accounts (user/agent/admin roles)
- `deposits` - Deposit requests with status
- `withdrawals` - Withdrawal requests with status
- `lottery_bets_2d` - 2D lottery bets
- `lottery_bets_3d` - 3D lottery bets
- `lottery_results_2d` - Published 2D results
- `lottery_results_3d` - Published 3D results
- `notifications` - User notifications

## Workflows
- **Start application** - Vite dev server on port 5000 (frontend)
- **Start Backend** - Express server on port 8000 (backend)

## Admin Credentials (Default)
- **Phone:** 09000000000
- **Password:** Admin@2024!

## Lottery Rules
- 2D: 85x multiplier, morning (11:00 AM) / evening (3:00 PM) sessions
- 3D: 600x multiplier, monthly
