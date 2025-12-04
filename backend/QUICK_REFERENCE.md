# InstaPay Backend - Quick Reference

## 🚀 Quick Start

```bash
cd backend
npm install
cp .env.example .env
# Configure .env with your credentials
npm run migrate
npm run dev
```

Server runs on: `http://localhost:3000`

## 📋 Essential Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start development server (auto-reload) |
| `npm start` | Start production server |
| `npm run migrate` | Run database migrations |
| `npm run lint` | Run ESLint |

## 🔑 Environment Variables (Required)

```env
# Firebase
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
FIREBASE_STORAGE_BUCKET=

# Supabase
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
DB_HOST=
DB_PASSWORD=

# Security
JWT_SECRET=
```

## 🌐 API Endpoints

### Auth
```
POST   /api/auth/send-otp
POST   /api/auth/verify-otp
POST   /api/auth/refresh-token
POST   /api/auth/logout
```

### Wallet
```
GET    /api/wallet/balance
POST   /api/wallet/top-up
GET    /api/wallet/history
```

### Transactions
```
POST   /api/transactions/transfer
GET    /api/transactions/:id
GET    /api/transactions
POST   /api/transactions/:id/cancel
```

### Admin
```
GET    /api/admin/users
GET    /api/admin/analytics
POST   /api/admin/user/:id/suspend
```

## 🧪 Test Endpoints

```bash
# Health check
curl http://localhost:3000/health

# Send OTP
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+923001234567"}'

# Get balance (requires auth token)
curl http://localhost:3000/api/wallet/balance \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/         # Firebase, Supabase, DB config
│   ├── database/       # Migrations
│   ├── middleware/     # Auth, validation, errors
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── utils/          # Helpers
│   └── index.js        # Server entry
├── .env               # Environment variables
└── package.json
```

## 🗄️ Database Tables

- `users` - User profiles
- `wallets` - Wallet balances
- `transactions` - All transactions
- `wallet_balance_history` - Audit trail
- `linked_accounts` - Bank accounts
- `admin_users` - Admin panel users
- `otp_verifications` - OTP codes

## 🔐 Security Features

✅ JWT authentication  
✅ Rate limiting  
✅ Request validation  
✅ SQL injection prevention  
✅ Encryption (AES-256-GCM)  
✅ Security headers (Helmet)  
✅ CORS protection  

## 📚 Documentation Files

- `README.md` - Overview
- `SETUP_GUIDE.md` - Detailed setup
- `API_DOCUMENTATION.md` - Complete API reference
- `MOBILE_INTEGRATION.js` - Mobile app examples

## 🐛 Troubleshooting

**Port in use:**
```env
PORT=3001
```

**Database connection fails:**
- Check Supabase credentials
- Verify IP allowlist
- Ensure SSL is enabled

**Firebase errors:**
- Verify service account JSON
- Check private key formatting
- Ensure services are enabled

## 📞 Support

Check logs in:
- `logs/error.log`
- `logs/combined.log`
- Console output

## ⚡ Rate Limits

- OTP: 2 req/min
- Auth: 5 req/15min
- Transactions: 10 req/min
- General API: 100 req/15min

## 🎯 Next Steps

1. Configure Firebase project
2. Set up Supabase database
3. Fill in `.env` file
4. Run migrations
5. Test endpoints
6. Integrate with mobile app
7. Deploy to production
