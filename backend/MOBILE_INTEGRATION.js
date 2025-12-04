// Mobile App Integration Example for InstaPay Backend
// This file shows how to integrate the backend API with your React Native app

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// API Configuration
const API_BASE_URL = process.env.API_URL || 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response.data,
    async (error) => {
        if (error.response?.status === 401) {
            // Token expired, try to refresh or logout
            await AsyncStorage.removeItem('accessToken');
            // Navigate to login screen
        }
        return Promise.reject(error.response?.data || error.message);
    }
);

// ============================================
// Authentication Services
// ============================================

export const authService = {
    /**
     * Send OTP to phone number
     */
    sendOTP: async (phoneNumber) => {
        try {
            const response = await api.post('/auth/send-otp', { phoneNumber });
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Verify OTP and login
     */
    verifyOTP: async (phoneNumber, otp, deviceFingerprint, fcmToken) => {
        try {
            const response = await api.post('/auth/verify-otp', {
                phoneNumber,
                otp,
                deviceFingerprint,
                fcmToken,
            });

            // Save tokens
            if (response.success && response.tokens) {
                await AsyncStorage.setItem('accessToken', response.tokens.accessToken);
                await AsyncStorage.setItem('firebaseToken', response.tokens.firebaseToken);
                await AsyncStorage.setItem('user', JSON.stringify(response.user));
            }

            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Refresh authentication token
     */
    refreshToken: async () => {
        try {
            const response = await api.post('/auth/refresh-token');

            if (response.success && response.accessToken) {
                await AsyncStorage.setItem('accessToken', response.accessToken);
            }

            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Logout user
     */
    logout: async () => {
        try {
            await api.post('/auth/logout');

            // Clear local storage
            await AsyncStorage.multiRemove(['accessToken', 'firebaseToken', 'user']);

            return { success: true };
        } catch (error) {
            // Clear storage even if API call fails
            await AsyncStorage.multiRemove(['accessToken', 'firebaseToken', 'user']);
            throw error;
        }
    },

    /**
     * Update FCM token
     */
    updateFCMToken: async (fcmToken) => {
        try {
            const response = await api.post('/auth/update-fcm-token', { fcmToken });
            return response;
        } catch (error) {
            throw error;
        }
    },
};

// ============================================
// Wallet Services
// ============================================

export const walletService = {
    /**
     * Get wallet balance
     */
    getBalance: async () => {
        try {
            const response = await api.get('/wallet/balance');
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get transaction history
     */
    getHistory: async (limit = 50, offset = 0) => {
        try {
            const response = await api.get('/wallet/history', {
                params: { limit, offset },
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Top up wallet
     */
    topUp: async (amount, paymentMethod, metadata = {}) => {
        try {
            const response = await api.post('/wallet/top-up', {
                amount,
                paymentMethod,
                metadata,
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get balance history
     */
    getBalanceHistory: async (limit = 50, offset = 0) => {
        try {
            const response = await api.get('/wallet/balance-history', {
                params: { limit, offset },
            });
            return response;
        } catch (error) {
            throw error;
        }
    },
};

// ============================================
// Transaction Services
// ============================================

export const transactionService = {
    /**
     * Transfer money to another user
     */
    transfer: async (receiverId, amount, description = '') => {
        try {
            const response = await api.post('/transactions/transfer', {
                receiverId,
                amount,
                description,
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get transaction by ID
     */
    getById: async (transactionId) => {
        try {
            const response = await api.get(`/transactions/${transactionId}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get transaction by reference
     */
    getByRef: async (transactionRef) => {
        try {
            const response = await api.get(`/transactions/ref/${transactionRef}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get user transactions with filters
     */
    getUserTransactions: async (filters = {}) => {
        try {
            const response = await api.get('/transactions', { params: filters });
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Cancel transaction
     */
    cancel: async (transactionId, reason = 'Cancelled by user') => {
        try {
            const response = await api.post(`/transactions/${transactionId}/cancel`, {
                reason,
            });
            return response;
        } catch (error) {
            throw error;
        }
    },
};

// ============================================
// Usage Examples in React Native Components
// ============================================

/*
// Example 1: Login Screen
import { authService } from './services/api';

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOTP = async () => {
    try {
      const result = await authService.sendOTP(phoneNumber);
      if (result.success) {
        setOtpSent(true);
        Alert.alert('Success', 'OTP sent to your phone');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const deviceId = await getDeviceId(); // Your device fingerprinting logic
      const fcmToken = await getFCMToken(); // Get FCM token
      
      const result = await authService.verifyOTP(
        phoneNumber,
        otp,
        deviceId,
        fcmToken
      );

      if (result.success) {
        // Navigate to home screen
        navigation.navigate('Home');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View>
      {!otpSent ? (
        <>
          <TextInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="+923001234567"
          />
          <Button title="Send OTP" onPress={handleSendOTP} />
        </>
      ) : (
        <>
          <TextInput
            value={otp}
            onChangeText={setOtp}
            placeholder="Enter OTP"
          />
          <Button title="Verify OTP" onPress={handleVerifyOTP} />
        </>
      )}
    </View>
  );
};

// Example 2: Wallet Screen
import { walletService } from './services/api';

const WalletScreen = () => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBalance();
  }, []);

  const loadBalance = async () => {
    try {
      const result = await walletService.getBalance();
      if (result.success) {
        setBalance(result.wallet);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Text>Balance: {balance?.currency} {balance?.balance}</Text>
      )}
    </View>
  );
};

// Example 3: Transfer Screen
import { transactionService } from './services/api';

const TransferScreen = () => {
  const [receiverId, setReceiverId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleTransfer = async () => {
    try {
      const result = await transactionService.transfer(
        receiverId,
        parseFloat(amount),
        description
      );

      if (result.success) {
        Alert.alert(
          'Success',
          `Transfer of ${result.transaction.amount} completed!`
        );
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Transfer failed');
    }
  };

  return (
    <View>
      <TextInput
        value={receiverId}
        onChangeText={setReceiverId}
        placeholder="Receiver ID"
      />
      <TextInput
        value={amount}
        onChangeText={setAmount}
        placeholder="Amount"
        keyboardType="numeric"
      />
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Description (optional)"
      />
      <Button title="Transfer" onPress={handleTransfer} />
    </View>
  );
};

// Example 4: Transaction History
import { walletService } from './services/api';

const TransactionHistoryScreen = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const result = await walletService.getHistory(50, 0);
      if (result.success) {
        setTransactions(result.transactions);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FlatList
      data={transactions}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View>
          <Text>{item.transaction_ref}</Text>
          <Text>{item.amount} {item.currency}</Text>
          <Text>{item.status}</Text>
        </View>
      )}
    />
  );
};
*/

export default api;
