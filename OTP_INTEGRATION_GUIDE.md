# OTP Integration Fix - Complete Implementation Guide

## Problem
The frontend phone signup screen (`app/signup/phone.tsx`) has placeholder functions that don't actually call the backend API to send or verify OTP codes.

## Solution Overview
We've created an API service layer and need to integrate it into the phone signup screen.

---

## Files Created

### 1. `constants/Config.ts`
Contains API configuration and endpoint definitions.

### 2. `services/api.service.ts`
Complete API service with methods for:
- `sendOTP(phoneNumber)` - Send OTP to phone number
- `verifyOTP(phoneNumber, otp, deviceFingerprint, fcmToken)` - Verify OTP
- `updateProfile(token, data)` - Update user profile
- Other wallet and transaction methods

---

## Required Changes to `app/signup/phone.tsx`

### Step 1: Add Imports

**Find** (lines 1-15):
```typescript
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
```

**Replace with**:
```typescript
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import ApiService from '../../services/api.service';
```

### Step 2: Add State Variables

**Find** (lines 21-26):
```typescript
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
```

**Replace with**:
```typescript
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
```

### Step 3: Implement handleSendOTP

**Find** (lines 56-62):
```typescript
  const handleSendOTP = () => {
    // Logic will be added later
    fadeAnim.setValue(0);
    slideAnim.setValue(30);
    setStep('otp');
    setTimer(60);
  };
```

**Replace with**:
```typescript
  const handleSendOTP = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await ApiService.sendOTP(phoneNumber);

      if (response.success) {
        fadeAnim.setValue(0);
        slideAnim.setValue(30);
        setStep('otp');
        setTimer(60);
        Alert.alert('Success', 'OTP sent successfully! Check the backend console for the code.');
      } else {
        setError(response.error || 'Failed to send OTP');
        Alert.alert('Error', response.error || 'Failed to send OTP');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
      Alert.alert('Error', err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };
```

### Step 4: Implement handleVerifyOTP

**Find** (lines 64-67):
```typescript
  const handleVerifyOTP = () => {
    // Logic will be added later
    router.push('/(tabs)/home'); // Navigate to home after verification
  };
```

**Replace with**:
```typescript
  const handleVerifyOTP = async () => {
    try {
      setLoading(true);
      setError('');

      const otpString = otp.join('');
      const response = await ApiService.verifyOTP(phoneNumber, otpString);

      if (response.success && response.data) {
        const { user, tokens, isNewUser } = response.data;

        // If new user, update profile with name and email
        if (isNewUser && tokens.accessToken) {
          await ApiService.updateProfile(tokens.accessToken, {
            fullName,
            email,
          });
        }

        // Store tokens (you might want to use AsyncStorage here)
        // For now, just navigate
        Alert.alert('Success', `Welcome ${isNewUser ? '' : 'back'}!`);
        router.replace('/(tabs)/home');
      } else {
        setError(response.error || 'Invalid OTP');
        Alert.alert('Error', response.error || 'Invalid OTP');
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed');
      Alert.alert('Error', err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };
```

### Step 5: Implement handleResendOTP

**Find** (lines 87-91):
```typescript
  const handleResendOTP = () => {
    setTimer(60);
    setOtp(['', '', '', '', '', '']);
    // Logic to resend OTP will be added later
  };
```

**Replace with**:
```typescript
  const handleResendOTP = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await ApiService.sendOTP(phoneNumber);

      if (response.success) {
        setTimer(60);
        setOtp(['', '', '', '', '', '']);
        Alert.alert('Success', 'OTP resent successfully!');
      } else {
        Alert.alert('Error', response.error || 'Failed to resend OTP');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };
```

### Step 6: Update Send Button (around line 216)

**Find**:
```typescript
            <TouchableOpacity
              style={[styles.primaryButton, !isFormValid && styles.buttonDisabled]}
              onPress={handleSendOTP}
              disabled={!isFormValid}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Send Verification Code</Text>
              <AntDesign name="arrow-right" size={20} color="#fff" />
            </TouchableOpacity>
```

**Replace with**:
```typescript
            <TouchableOpacity
              style={[styles.primaryButton, (!isFormValid || loading) && styles.buttonDisabled]}
              onPress={handleSendOTP}
              disabled={!isFormValid || loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.primaryButtonText}>Send Verification Code</Text>
                  <AntDesign name="arrow-right" size={20} color="#fff" />
                </>
              )}
            </TouchableOpacity>
```

### Step 7: Update Verify Button (around line 278)

**Find**:
```typescript
            <TouchableOpacity
              style={[styles.primaryButton, !isOtpComplete && styles.buttonDisabled]}
              onPress={handleVerifyOTP}
              disabled={!isOtpComplete}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Verify & Continue</Text>
              <AntDesign name="check-circle" size={20} color="#fff"/>
            </TouchableOpacity>
```

**Replace with**:
```typescript
            <TouchableOpacity
              style={[styles.primaryButton, (!isOtpComplete || loading) && styles.buttonDisabled]}
              onPress={handleVerifyOTP}
              disabled={!isOtpComplete || loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.primaryButtonText}>Verify & Continue</Text>
                  <AntDesign name="check-circle" size={20} color="#fff"/>
                </>
              )}
            </TouchableOpacity>
```

---

## Testing the Integration

### 1. Start the Backend
```bash
cd backend
npm run dev
```

You should see:
```
✅ Cloudinary configured successfully
✅ Firebase Admin SDK initialized successfully
🚀 InstaPay Backend Server started on port 3000
```

### 2. Start the Frontend
```bash
npx expo start
```

### 3. Test OTP Flow

1. Open the app and go to signup
2. Enter:
   - Full Name: "Test User"
   - Email: "test@example.com"
   - Phone: "3001234567"
3. Click "Send Verification Code"
4. **Check the backend terminal** - you'll see:
   ```
   📱 OTP for +923001234567: 123456
   ```
5. Enter the OTP code shown in the terminal
6. Click "Verify & Continue"
7. You should be logged in!

---

## Important Notes

### API URL Configuration
The API service is configured to use `http://localhost:3000/api` by default.

**For testing on a physical device:**
1. Find your computer's IP address:
   - Windows: `ipconfig` (look for IPv4 Address)
   - Mac/Linux: `ifconfig` (look for inet)
2. Update `constants/Config.ts`:
   ```typescript
   BASE_URL: 'http://192.168.x.x:3000/api',  // Replace with your IP
   ```

### OTP in Development
Currently, OTPs are logged to the backend console (not sent via SMS). This is intentional for development. To implement actual SMS sending, you would integrate a service like Twilio in the backend.

### Error Handling
The implementation includes comprehensive error handling:
- Network errors
- Invalid OTP
- Server errors
- Timeout errors

All errors are shown to the user via Alert dialogs.

---

## Next Steps

After implementing these changes:

1. **Token Storage**: Add AsyncStorage to persist auth tokens
2. **SMS Integration**: Integrate Twilio or similar for actual SMS sending
3. **Better Error Messages**: Customize error messages based on error types
4. **Loading States**: Add skeleton loaders instead of just ActivityIndicator
5. **Retry Logic**: Add automatic retry for network failures

---

## Troubleshooting

### "Network request failed"
- Make sure backend is running
- Check API_URL in Config.ts
- If using physical device, use your computer's IP address

### "Invalid OTP"
- Check backend console for the actual OTP code
- Make sure you're entering all 6 digits
- OTP expires after 5 minutes

### Backend not receiving requests
- Check firewall settings
- Make sure port 3000 is not blocked
- Try accessing `http://localhost:3000/health` in browser

---

## Summary

The OTP integration is now complete! The flow is:

1. User enters details → `handleSendOTP()` → API call → OTP logged to console
2. User enters OTP → `handleVerifyOTP()` → API call → User authenticated
3. Profile updated with name/email → Navigate to home

The backend handles all the authentication logic, OTP generation, and user creation. The frontend just needs to make the API calls and handle the responses.
