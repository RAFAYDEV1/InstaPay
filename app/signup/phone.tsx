import { AntDesign } from '@expo/vector-icons';
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

import { router } from 'expo-router';
import ApiService from '../../services/api.service';

const { width } = Dimensions.get('window');

export default function PhoneSignUp() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const otpInputs = useRef<(TextInput | null)[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [step]);

  useEffect(() => {
    if (step === 'otp' && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step, timer]);

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

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (key: string, index: number) => {
    // Handle backspace
    if (key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

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

  const isFormValid = phoneNumber.length >= 10 && fullName.length > 0 && email.length > 0;
  const isOtpComplete = otp.every(digit => digit !== '');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Background */}
      <View style={styles.backgroundCircle1} />
      <View style={styles.backgroundCircle2} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => step === 'otp' ? setStep('form') : router.back()}
          >
            <AntDesign name="arrow-left" size={24} color="#0A0A3E" />
          </TouchableOpacity>

          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, step === 'otp' && styles.progressBarComplete]} />
          </View>

          <Text style={styles.title}>
            {step === 'form' ? 'Enter Your Details' : 'Verify Your Phone'}
          </Text>
          <Text style={styles.subtitle}>
            {step === 'form'
              ? 'We need some information to create your account'
              : `Enter the 6-digit code sent to ${phoneNumber}`}
          </Text>
        </Animated.View>

        {/* Form Step */}
        {step === 'form' && (
          <Animated.View
            style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            {/* Full Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <AntDesign name="user" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Muhammad Ahmed"
                  placeholderTextColor="#9CA3AF"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <AntDesign name="mail" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="ali@example.com"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Phone Number Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number</Text>
              <View style={styles.inputWrapper}>
                <View style={styles.countryCode}>
                  <Text style={styles.countryCodeText}>+92</Text>
                </View>
                <TextInput
                  style={[styles.input, styles.phoneInput]}
                  placeholder="3001234567"
                  placeholderTextColor="#9CA3AF"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>
              <Text style={styles.helperText}>We&apos;ll send a verification code to this number</Text>
            </View>

            {/* Terms & Conditions */}
            <View style={styles.termsContainer}>
              <AntDesign name="info-circle" size={16} color="#6B7280" />
              <Text style={styles.termsText}>
                By continuing, you agree to our{' '}
                <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </View>

            {/* Continue Button */}
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
          </Animated.View>
        )}

        {/* OTP Step */}
        {step === 'otp' && (
          <Animated.View
            style={[
              styles.otpContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            {/* OTP Icon */}
            <View style={styles.otpIconContainer}>
              <AntDesign name="message" size={40} color="#4F46E5" />
            </View>

            {/* OTP Input */}
            <View style={styles.otpInputContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => { otpInputs.current[index] = ref; }}
                  style={[
                    styles.otpInput,
                    digit && styles.otpInputFilled
                  ]}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={({ nativeEvent: { key } }) => handleOtpKeyPress(key, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                />
              ))}
            </View>

            {/* Timer */}
            <View style={styles.timerContainer}>
              {timer > 0 ? (
                <Text style={styles.timerText}>
                  Resend code in <Text style={styles.timerHighlight}>{timer}s</Text>
                </Text>
              ) : (
                <TouchableOpacity onPress={handleResendOTP}>
                  <Text style={styles.resendText}>Resend Code</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Verify Button */}
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
                  <AntDesign name="check-circle" size={20} color="#fff" />
                </>
              )}
            </TouchableOpacity>

            {/* Change Number */}
            <TouchableOpacity
              style={styles.changeNumberButton}
              onPress={() => setStep('form')}
            >
              <Text style={styles.changeNumberText}>Change Phone Number</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFF',
  },
  backgroundCircle1: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    backgroundColor: 'rgba(79, 70, 229, 0.03)',
    top: -width * 0.4,
    right: -width * 0.3,
  },
  backgroundCircle2: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: 'rgba(79, 70, 229, 0.02)',
    bottom: -width * 0.2,
    left: -width * 0.3,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 40,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 24,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4F46E5',
    width: '50%',
    borderRadius: 2,
  },
  progressBarComplete: {
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0A0A3E',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
  },
  formContainer: {
    gap: 20,
  },
  inputContainer: {
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#0A0A3E',
    fontWeight: '500',
  },
  phoneInput: {
    marginLeft: 12,
  },
  countryCode: {
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0A0A3E',
  },
  helperText: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 8,
    marginLeft: 4,
  },
  termsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(79, 70, 229, 0.05)',
    padding: 12,
    borderRadius: 12,
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 8,
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 18,
  },
  termsLink: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: '#4F46E5',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    elevation: 4,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonDisabled: {
    backgroundColor: '#D1D5DB',
    elevation: 0,
    shadowOpacity: 0,
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
  otpContainer: {
    alignItems: 'center',
    gap: 24,
  },
  otpIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  otpInputContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  otpInput: {
    width: 50,
    height: 60,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
    fontSize: 24,
    fontWeight: '700',
    color: '#0A0A3E',
    textAlign: 'center',
  },
  otpInputFilled: {
    borderColor: '#4F46E5',
    backgroundColor: 'rgba(79, 70, 229, 0.05)',
  },
  timerContainer: {
    marginBottom: 16,
  },
  timerText: {
    fontSize: 14,
    color: '#6B7280',
  },
  timerHighlight: {
    color: '#4F46E5',
    fontWeight: '700',
  },
  resendText: {
    fontSize: 15,
    color: '#4F46E5',
    fontWeight: '700',
  },
  changeNumberButton: {
    marginTop: 8,
  },
  changeNumberText: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '600',
  },
});