# Quick Fix Guide - Configuration Issues

## Current Issues

1. ❌ **Cloudinary configuration is incomplete** - Profile image upload will not work
2. ❌ **Firebase initialization error** - Missing "project_id" property

## Solution

You need to add the missing environment variables to your `.env` file.

---

## Step 1: Fix Cloudinary Configuration

### Get Cloudinary Credentials

1. **Sign up/Login to Cloudinary**:
   - Go to [https://cloudinary.com/](https://cloudinary.com/)
   - Sign up for free (no credit card required)
   - Or login if you already have an account

2. **Get your credentials** from the Dashboard:
   - **Cloud Name**: Found at the top of the dashboard
   - **API Key**: Found in "Account Details" section
   - **API Secret**: Click "Reveal" to see it

3. **Add to your `.env` file**:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name-here
CLOUDINARY_API_KEY=your-api-key-here
CLOUDINARY_API_SECRET=your-api-secret-here
CLOUDINARY_FOLDER=instapay/profile-images
```

**Example:**
```env
CLOUDINARY_CLOUD_NAME=instapay-demo
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
CLOUDINARY_FOLDER=instapay/profile-images
```

---

## Step 2: Fix Firebase Configuration

### Get Firebase Credentials

1. **Go to Firebase Console**:
   - Visit [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Select your project (or create one if you haven't)

2. **Generate Service Account Key**:
   - Click the ⚙️ (Settings) icon → **Project Settings**
   - Go to **Service Accounts** tab
   - Click **"Generate New Private Key"**
   - Download the JSON file

3. **Extract values from the JSON file**:

The downloaded file looks like this:
```json
{
  "type": "service_account",
  "project_id": "instapay-12345",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@instapay-12345.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

4. **Add to your `.env` file**:

```env
# Firebase Configuration
FIREBASE_PROJECT_ID=instapay-12345
FIREBASE_PRIVATE_KEY_ID=abc123...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_FULL_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@instapay-12345.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=123456789
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/...
```

> **IMPORTANT**: For `FIREBASE_PRIVATE_KEY`, keep the entire key including the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` parts. The `\n` characters should be literal backslash-n, not actual newlines.

---

## Step 3: Verify Your `.env` File

Your complete `.env` file should have **ALL** of these sections:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Firebase Configuration
FIREBASE_PROJECT_ID=your-actual-project-id
FIREBASE_PRIVATE_KEY_ID=your-actual-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-actual-client-email
FIREBASE_CLIENT_ID=your-actual-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_CERT_URL=your-actual-client-cert-url

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-actual-cloud-name
CLOUDINARY_API_KEY=your-actual-api-key
CLOUDINARY_API_SECRET=your-actual-api-secret
CLOUDINARY_FOLDER=instapay/profile-images

# Supabase Configuration
SUPABASE_URL=your-actual-supabase-url
SUPABASE_ANON_KEY=your-actual-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key

# PostgreSQL Configuration
DB_HOST=your-actual-db-host
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your-actual-db-password
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

---

## Step 4: Restart Your Server

After updating your `.env` file:

1. **Stop the current server** (Ctrl+C in the terminal)
2. **Restart it**:
   ```bash
   npm run dev
   ```

3. **Check for success messages**:
   - ✅ Cloudinary configured successfully
   - ✅ Firebase Admin SDK initialized successfully

---

## Troubleshooting

### Still seeing "Cloudinary configuration is incomplete"?

- Double-check that all 4 Cloudinary variables are set:
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`
  - `CLOUDINARY_FOLDER`
- Make sure there are no extra spaces
- Restart the server after changes

### Still seeing Firebase error?

- Most common issue: Missing `FIREBASE_PROJECT_ID`
- Check that the private key is properly formatted with `\n` (not actual newlines)
- Verify the JSON file was downloaded correctly
- Make sure you're using the service account key, not the web app config

### Need Help?

1. Check [CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md) for detailed Cloudinary setup
2. Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed Firebase setup
3. Compare your `.env` with [.env.example](./.env.example)

---

## Quick Checklist

- [ ] Created Cloudinary account
- [ ] Added all 4 Cloudinary variables to `.env`
- [ ] Downloaded Firebase service account JSON
- [ ] Added all Firebase variables to `.env` (especially `FIREBASE_PROJECT_ID`)
- [ ] Restarted the server
- [ ] Verified success messages in console

Once all checkboxes are complete, both errors should be resolved! ✅
