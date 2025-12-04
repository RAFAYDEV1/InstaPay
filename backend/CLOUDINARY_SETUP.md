# Cloudinary Setup Guide for InstaPay

Cloudinary is a free cloud-based image and video management service. We're using it instead of Firebase Storage to store profile images.

## Why Cloudinary?

- ✅ **Free Tier**: 25 GB storage, 25 GB bandwidth/month
- ✅ **Easy Integration**: Simple API
- ✅ **Automatic Optimization**: Image transformation and optimization
- ✅ **CDN**: Fast global delivery
- ✅ **No Credit Card Required**: Free tier doesn't require payment info

## Setup Steps

### 1. Create Cloudinary Account

1. Go to [https://cloudinary.com/](https://cloudinary.com/)
2. Click "Sign Up for Free"
3. Fill in your details or sign up with Google/GitHub
4. Verify your email

### 2. Get Your Credentials

After logging in, you'll see your dashboard:

1. Look for the **"Account Details"** section (usually at the top)
2. You'll see:
   - **Cloud Name**: `your-cloud-name`
   - **API Key**: `123456789012345`
   - **API Secret**: `abcdefghijklmnopqrstuvwxyz123456`

### 3. Configure Backend

Open your `backend/.env` file and add:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_FOLDER=instapay/profile-images
```

**Example:**
```env
CLOUDINARY_CLOUD_NAME=instapay-demo
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
CLOUDINARY_FOLDER=instapay/profile-images
```

### 4. Install Cloudinary Package

```bash
cd backend
npm install
```

The `cloudinary` package is already in `package.json`, so `npm install` will install it.

### 5. Test the Integration

Start your backend server:

```bash
npm run dev
```

You should see:
```
✅ Cloudinary configured successfully
```

## How It Works

### Profile Image Upload

When a user uploads a profile image:

1. **Mobile app** sends image as base64 or file
2. **Backend** receives the image buffer
3. **Cloudinary** stores the image and returns a URL
4. **Database** saves the Cloudinary URL
5. **Mobile app** displays the image from Cloudinary CDN

### Image Transformations

Images are automatically:
- Resized to 500x500 pixels
- Cropped to focus on faces
- Optimized for web delivery
- Served via CDN for fast loading

### Example Cloudinary URL

```
https://res.cloudinary.com/instapay-demo/image/upload/v1234567890/instapay/profile-images/user_abc123_1234567890.jpg
```

## API Usage

### Upload Profile Image

```javascript
// In your mobile app
const formData = new FormData();
formData.append('image', {
  uri: imageUri,
  type: 'image/jpeg',
  name: 'profile.jpg',
});

const response = await fetch('http://your-backend/api/user/upload-profile-image', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
  body: formData,
});
```

### Delete Profile Image

```javascript
const response = await fetch('http://your-backend/api/user/delete-profile-image', {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});
```

## Cloudinary Dashboard

### View Uploaded Images

1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Click "Media Library" in the left sidebar
3. Navigate to `instapay/profile-images` folder
4. You'll see all uploaded profile images

### Monitor Usage

1. Go to "Dashboard" → "Usage"
2. Check:
   - Storage used
   - Bandwidth used
   - Transformations used
   - API requests

## Free Tier Limits

| Resource | Free Tier Limit |
|----------|----------------|
| Storage | 25 GB |
| Bandwidth | 25 GB/month |
| Transformations | 25,000/month |
| API Requests | Unlimited |

For InstaPay, this should be more than enough for development and early production.

## Upgrade (If Needed)

If you exceed free tier limits:

1. **Paid Plans** start at $89/month
2. **Pay-as-you-go** option available
3. **Education Plan**: Free for students (requires verification)

## Security Best Practices

### 1. Keep Credentials Secret

- ✅ Never commit `.env` file to git
- ✅ Use environment variables
- ✅ Rotate API keys if exposed

### 2. Signed Uploads (Optional)

For extra security, you can require signed uploads:

```javascript
// backend/src/services/firebase.service.js
const signature = cloudinary.utils.api_sign_request({
  timestamp: timestamp,
  folder: 'instapay/profile-images',
}, process.env.CLOUDINARY_API_SECRET);
```

### 3. Upload Presets

Create upload presets in Cloudinary dashboard for consistent transformations.

## Troubleshooting

### Error: "Invalid cloud_name"

- Check that `CLOUDINARY_CLOUD_NAME` is correct
- No spaces or special characters
- Case-sensitive

### Error: "Invalid API key"

- Verify `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET`
- Make sure there are no extra spaces
- Check if keys are active in Cloudinary dashboard

### Images Not Uploading

1. Check backend logs for errors
2. Verify Cloudinary credentials
3. Check internet connection
4. Ensure folder path is correct

### Images Not Displaying

1. Check if URL is valid
2. Verify image was uploaded successfully
3. Check CORS settings in Cloudinary
4. Try accessing URL directly in browser

## Alternative: Supabase Storage

If you prefer, you can also use **Supabase Storage** (free tier: 1 GB):

1. Go to Supabase Dashboard
2. Click "Storage"
3. Create a bucket called `profile-images`
4. Update backend code to use Supabase Storage instead

## Comparison

| Feature | Cloudinary | Firebase Storage | Supabase Storage |
|---------|-----------|------------------|------------------|
| Free Storage | 25 GB | 5 GB | 1 GB |
| Free Bandwidth | 25 GB/month | 1 GB/day | 2 GB/month |
| Transformations | ✅ Built-in | ❌ Manual | ❌ Manual |
| CDN | ✅ Global | ✅ Global | ✅ Global |
| Credit Card | ❌ Not required | ✅ Required | ❌ Not required |

## Next Steps

1. ✅ Create Cloudinary account
2. ✅ Get credentials
3. ✅ Update `.env` file
4. ✅ Run `npm install`
5. ✅ Test image upload from mobile app

Your profile images are now stored in Cloudinary! 🎉
