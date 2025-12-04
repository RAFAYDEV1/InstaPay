# InstaPay Backend Setup Guide

This guide will help you set up the InstaPay backend with Firebase and Supabase.

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database (via Supabase)
- Firebase project
- npm or yarn

## Step 1: Install Dependencies

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

## Step 2: Firebase Setup

### 2.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable the following services:
   - **Authentication** → Enable Phone authentication
   - **Cloud Messaging** → For push notifications
   - **Storage** → For profile images

### 2.2 Generate Service Account Key

1. Go to Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Download the JSON file
4. **DO NOT commit this file to git**

### 2.3 Extract Firebase Credentials

From the downloaded JSON file, extract these values for your `.env` file:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "your-private-key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com",
  "client_id": "your-client-id",
  ...
}
```

## Step 3: Supabase Setup

### 3.1 Create Supabase Project

1. Go to [Supabase](https://supabase.com/)
2. Create a new project
3. Wait for the project to be ready

### 3.2 Get Database Credentials

1. Go to Project Settings → Database
2. Copy the following:
   - **Host**: `db.xxxxx.supabase.co`
   - **Database name**: `postgres`
   - **Port**: `5432`
   - **User**: `postgres`
   - **Password**: Your database password

3. Go to Project Settings → API
4. Copy:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: For client-side (if needed)
   - **service_role key**: For server-side (backend)

## Step 4: Configure Environment Variables

1. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

2. Fill in your credentials in `.env`:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project-id.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_CERT_URL=your-client-cert-url
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com

# Supabase Configuration
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# PostgreSQL Configuration
DB_HOST=db.xxxxx.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your-database-password
DB_SSL=true

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# OTP Configuration
OTP_EXPIRY_MINUTES=5
OTP_LENGTH=6

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# App Configuration
APP_NAME=InstaPay
DEFAULT_CURRENCY=PKR
```

## Step 5: Run Database Migrations

Run the migrations to create all necessary tables:

```bash
npm run migrate
```

You should see output like:
```
🚀 Starting database migrations...
Found 6 migration files
Running migration: 001_create_users_table.sql
✅ 001_create_users_table.sql completed successfully
...
✅ All migrations completed successfully!
```

## Step 6: Start the Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:3000`

## Step 7: Test the API

### Health Check

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "success": true,
  "message": "InstaPay Backend API is running",
  "timestamp": "2024-01-27T12:00:00.000Z",
  "environment": "development"
}
```

### Send OTP

```bash
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+923001234567"}'
```

## Mobile App Integration

### Update Mobile App .env

Create a `.env` file in your mobile app root directory:

```env
# Backend API
API_URL=http://localhost:3000/api
# or for production
# API_URL=https://your-backend-domain.com/api

# Firebase (for mobile app)
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id

# Supabase (optional, for direct access)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

## Troubleshooting

### Firebase Connection Issues

- Verify your service account JSON is correct
- Check that private key has `\n` properly escaped
- Ensure Firebase services are enabled in console

### Database Connection Issues

- Verify Supabase credentials
- Check that your IP is allowed in Supabase settings
- Ensure SSL is enabled (`DB_SSL=true`)

### OTP Not Sending

- Currently, OTPs are logged to console (development mode)
- For production, integrate with SMS provider (Twilio, etc.)

### Port Already in Use

Change the PORT in `.env`:
```env
PORT=3001
```

## Next Steps

1. **Implement SMS Provider**: Integrate Twilio or similar for actual OTP sending
2. **Set up Payment Gateway**: If needed for top-ups
3. **Deploy Backend**: Deploy to cloud provider (AWS, GCP, Heroku, etc.)
4. **Configure Domain**: Set up custom domain and SSL
5. **Enable Monitoring**: Set up error tracking (Sentry) and monitoring

## Security Checklist

- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Never commit `.env` file to git
- [ ] Keep Firebase service account key secure
- [ ] Use environment-specific configurations
- [ ] Enable HTTPS in production
- [ ] Set up proper CORS origins
- [ ] Implement rate limiting (already done)
- [ ] Regular security audits
