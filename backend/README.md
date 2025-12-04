# InstaPay Backend API

Backend service for InstaPay mobile application handling authentication, wallet operations, and payment processing.

## Tech Stack

- **Node.js + Express** - REST API server
- **Firebase Admin SDK** - Authentication, OTP, Push Notifications, Storage
- **PostgreSQL (Supabase)** - Database for wallet, transactions, and user data
- **JWT** - Token-based authentication

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required credentials:
- Firebase service account credentials
- Supabase project URL and keys
- PostgreSQL connection details

### 3. Run Database Migrations

```bash
npm run migrate
```

### 4. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to phone number
- `POST /api/auth/verify-otp` - Verify OTP and get auth token
- `POST /api/auth/refresh-token` - Refresh authentication token
- `POST /api/auth/logout` - Logout user

### Wallet
- `GET /api/wallet/balance` - Get wallet balance
- `POST /api/wallet/create` - Create new wallet
- `GET /api/wallet/history` - Get transaction history
- `POST /api/wallet/top-up` - Top up wallet

### Transactions
- `POST /api/transactions/create` - Create transaction
- `GET /api/transactions/:id` - Get transaction details
- `POST /api/transactions/transfer` - Transfer money
- `POST /api/transactions/reconcile` - Reconcile transactions

### Admin
- `GET /api/admin/users` - List all users
- `GET /api/admin/analytics` - System analytics
- `POST /api/admin/user/:id/suspend` - Suspend user
- `GET /api/admin/transactions` - All transactions

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── database/        # Database migrations and queries
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Helper functions
│   └── index.js         # Entry point
├── .env                 # Environment variables (not in git)
├── .env.example         # Environment template
└── package.json
```

## Security Features

- JWT token authentication
- Rate limiting
- Request validation with Joi
- Helmet security headers
- CORS configuration
- Encrypted sensitive data

## Development

```bash
# Run in development mode with auto-reload
npm run dev

# Run linter
npm run lint

# Run tests
npm test
```
