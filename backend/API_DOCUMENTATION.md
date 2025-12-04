# InstaPay Backend API Documentation

Base URL: `http://localhost:3000/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## Auth Endpoints

### Send OTP
Send OTP to phone number for authentication.

**Endpoint:** `POST /auth/send-otp`

**Rate Limit:** 2 requests per minute

**Request Body:**
```json
{
  "phoneNumber": "+923001234567"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "expiresAt": "2024-01-27T12:05:00.000Z"
}
```

---

### Verify OTP
Verify OTP and authenticate user.

**Endpoint:** `POST /auth/verify-otp`

**Rate Limit:** 5 requests per 15 minutes

**Request Body:**
```json
{
  "phoneNumber": "+923001234567",
  "otp": "123456",
  "deviceFingerprint": "unique-device-id",
  "fcmToken": "firebase-cloud-messaging-token"
}
```

**Response:**
```json
{
  "success": true,
  "isNewUser": false,
  "user": {
    "id": "uuid",
    "phoneNumber": "+923001234567",
    "fullName": "John Doe",
    "email": "john@example.com",
    "profileImageUrl": "https://..."
  },
  "tokens": {
    "accessToken": "jwt-token",
    "firebaseToken": "firebase-custom-token"
  }
}
```

---

### Refresh Token
Refresh authentication token.

**Endpoint:** `POST /auth/refresh-token`

**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "accessToken": "new-jwt-token"
}
```

---

### Logout
Logout user and invalidate FCM token.

**Endpoint:** `POST /auth/logout`

**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Update FCM Token
Update Firebase Cloud Messaging token for push notifications.

**Endpoint:** `POST /auth/update-fcm-token`

**Auth Required:** Yes

**Request Body:**
```json
{
  "fcmToken": "new-fcm-token"
}
```

---

## Wallet Endpoints

### Get Balance
Get user's wallet balance.

**Endpoint:** `GET /wallet/balance`

**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "wallet": {
    "id": "uuid",
    "user_id": "uuid",
    "balance": "1500.00",
    "currency": "PKR",
    "wallet_type": "personal",
    "status": "active",
    "phone_number": "+923001234567",
    "full_name": "John Doe"
  }
}
```

---

### Create Wallet
Create a new wallet.

**Endpoint:** `POST /wallet/create`

**Auth Required:** Yes

**Request Body:**
```json
{
  "currency": "PKR",
  "walletType": "personal"
}
```

---

### Get Transaction History
Get wallet transaction history.

**Endpoint:** `GET /wallet/history`

**Auth Required:** Yes

**Query Parameters:**
- `limit` (optional): Number of transactions (default: 50)
- `offset` (optional): Offset for pagination (default: 0)

**Response:**
```json
{
  "success": true,
  "transactions": [
    {
      "id": "uuid",
      "transaction_ref": "TXN20240127123456",
      "amount": "500.00",
      "currency": "PKR",
      "transaction_type": "transfer",
      "status": "completed",
      "sender_name": "John Doe",
      "receiver_name": "Jane Smith",
      "created_at": "2024-01-27T12:00:00.000Z"
    }
  ],
  "count": 10
}
```

---

### Top Up Wallet
Add money to wallet.

**Endpoint:** `POST /wallet/top-up`

**Auth Required:** Yes

**Request Body:**
```json
{
  "amount": 1000.00,
  "paymentMethod": "bank_account",
  "metadata": {
    "accountNumber": "1234567890"
  }
}
```

**Response:**
```json
{
  "success": true,
  "transaction": {
    "id": "uuid",
    "transaction_ref": "TXN20240127123456",
    "amount": "1000.00",
    "status": "completed"
  },
  "newBalance": "2500.00"
}
```

---

### Get Balance History
Get wallet balance change history.

**Endpoint:** `GET /wallet/balance-history`

**Auth Required:** Yes

**Query Parameters:**
- `limit` (optional): Number of records (default: 50)
- `offset` (optional): Offset for pagination (default: 0)

---

## Transaction Endpoints

### Transfer Money
Transfer money to another user.

**Endpoint:** `POST /transactions/transfer`

**Auth Required:** Yes

**Rate Limit:** 10 requests per minute

**Request Body:**
```json
{
  "receiverId": "receiver-user-uuid",
  "amount": 500.00,
  "description": "Payment for services"
}
```

**Response:**
```json
{
  "success": true,
  "transaction": {
    "id": "uuid",
    "transaction_ref": "TXN20240127123456",
    "amount": "500.00",
    "status": "completed",
    "created_at": "2024-01-27T12:00:00.000Z"
  },
  "senderNewBalance": "1000.00",
  "receiverNewBalance": "1500.00"
}
```

---

### Create Transaction
Create a new transaction.

**Endpoint:** `POST /transactions/create`

**Auth Required:** Yes

**Request Body:**
```json
{
  "receiverId": "uuid",
  "amount": 500.00,
  "transactionType": "payment",
  "paymentMethod": "wallet",
  "description": "Payment description",
  "metadata": {}
}
```

---

### Get Transaction by ID
Get transaction details.

**Endpoint:** `GET /transactions/:id`

**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "transaction": {
    "id": "uuid",
    "transaction_ref": "TXN20240127123456",
    "sender_id": "uuid",
    "receiver_id": "uuid",
    "amount": "500.00",
    "currency": "PKR",
    "transaction_type": "transfer",
    "status": "completed",
    "sender_name": "John Doe",
    "receiver_name": "Jane Smith",
    "created_at": "2024-01-27T12:00:00.000Z"
  }
}
```

---

### Get Transaction by Reference
Get transaction by reference number.

**Endpoint:** `GET /transactions/ref/:ref`

**Auth Required:** Yes

---

### Get User Transactions
Get user's transactions with filters.

**Endpoint:** `GET /transactions`

**Auth Required:** Yes

**Query Parameters:**
- `status` (optional): Filter by status (pending, completed, failed, cancelled)
- `type` (optional): Filter by type (transfer, top_up, payment, etc.)
- `startDate` (optional): Start date (ISO format)
- `endDate` (optional): End date (ISO format)
- `limit` (optional): Number of transactions (default: 50)
- `offset` (optional): Offset for pagination (default: 0)

---

### Cancel Transaction
Cancel a pending transaction.

**Endpoint:** `POST /transactions/:id/cancel`

**Auth Required:** Yes

**Request Body:**
```json
{
  "reason": "Cancelled by user"
}
```

---

### Reconcile Transactions
Reconcile multiple transactions (Admin).

**Endpoint:** `POST /transactions/reconcile`

**Auth Required:** Yes

**Request Body:**
```json
{
  "transactionIds": ["uuid1", "uuid2", "uuid3"]
}
```

---

### Get Unreconciled Transactions
Get list of unreconciled transactions (Admin).

**Endpoint:** `GET /transactions/unreconciled/list`

**Auth Required:** Yes

**Query Parameters:**
- `limit` (optional): Number of transactions (default: 100)

---

## Admin Endpoints

### Get All Users
Get paginated list of all users.

**Endpoint:** `GET /admin/users`

**Auth Required:** Yes (Admin)

**Query Parameters:**
- `limit` (optional): Number of users (default: 50)
- `offset` (optional): Offset for pagination (default: 0)
- `search` (optional): Search by phone, name, or email

---

### Get System Analytics
Get system-wide analytics.

**Endpoint:** `GET /admin/analytics`

**Auth Required:** Yes (Admin)

**Response:**
```json
{
  "success": true,
  "analytics": {
    "totalUsers": 1000,
    "activeUsers": 750,
    "totalTransactions": 5000,
    "transactionVolume": [
      { "currency": "PKR", "volume": "1000000.00" }
    ],
    "transactionsByStatus": [
      { "status": "completed", "count": 4500 },
      { "status": "pending", "count": 300 }
    ],
    "recentTransactions": []
  }
}
```

---

### Suspend User
Suspend a user account.

**Endpoint:** `POST /admin/user/:id/suspend`

**Auth Required:** Yes (Admin)

**Request Body:**
```json
{
  "reason": "Suspicious activity",
  "suspensionType": "temporary",
  "expiresAt": "2024-02-27T12:00:00.000Z"
}
```

---

### Activate User
Activate/unsuspend a user account.

**Endpoint:** `POST /admin/user/:id/activate`

**Auth Required:** Yes (Admin)

---

### Get All Transactions
Get all transactions with filters (Admin).

**Endpoint:** `GET /admin/transactions`

**Auth Required:** Yes (Admin)

**Query Parameters:**
- `limit` (optional): Number of transactions (default: 50)
- `offset` (optional): Offset for pagination (default: 0)
- `status` (optional): Filter by status
- `type` (optional): Filter by type

---

### Get User Details
Get detailed user information (Admin).

**Endpoint:** `GET /admin/user/:id`

**Auth Required:** Yes (Admin)

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "phone_number": "+923001234567",
    "full_name": "John Doe",
    "balance": "1500.00",
    "currency": "PKR",
    "is_active": true
  },
  "stats": {
    "total_transactions": 50,
    "total_volume": "25000.00",
    "completed_transactions": 45,
    "failed_transactions": 5
  }
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error message"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (access denied)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

---

## Rate Limiting

Different endpoints have different rate limits:

- **OTP Endpoints**: 2 requests per minute
- **Auth Endpoints**: 5 requests per 15 minutes
- **Transaction Endpoints**: 10 requests per minute
- **General API**: 100 requests per 15 minutes

When rate limit is exceeded, you'll receive a 429 status code.
