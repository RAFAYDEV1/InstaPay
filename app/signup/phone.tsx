import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
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
import SessionService from '../../services/session.service';

const { width } = Dimensions.get('window');

export default function PhoneSignUp() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [banner, setBanner] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
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

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setBanner({ type: 'error', message: 'Permission is required to access the gallery.' });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const formatPhone = () => {
    if (phoneNumber.startsWith('+')) return phoneNumber;
    return `+92${phoneNumber}`;
  };

  const handleSendOTP = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await ApiService.sendOTP(formatPhone());

      if (response.success) {
        setBanner({ type: 'success', message: 'OTP sent successfully! Check your phone.' });
        fadeAnim.setValue(0);
        slideAnim.setValue(30);
        setStep('otp');
        setTimer(60);
      } else {
        const msg = response.error || 'Failed to send OTP';
        setError(msg);
        setBanner({ type: 'error', message: msg });
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
      setBanner({ type: 'error', message: err.message || 'Network error' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setLoading(true);
      setError('');

      const otpString = otp.join('');
      const response = await ApiService.verifyOTP(
        formatPhone(),
        otpString
      );

      if (!response.success || !response.data) {
        const msg = response.error || response.message || 'Invalid OTP';
        setError(msg);
        setBanner({ type: 'error', message: msg });
        return;
      }

      const { user, tokens, isNewUser } = response.data;

      if (tokens?.accessToken) {
        await SessionService.saveSession(
          {
            accessToken: tokens.accessToken,
            firebaseToken: tokens.firebaseToken,
          },
          {
            id: user.id,
            phoneNumber: user.phoneNumber,
            fullName,
            email,
            profileImageUrl: user.profileImageUrl,
          }
        );
      } else {
        setBanner({ type: 'error', message: 'Missing access token from server' });
        return;
      }

      if (isNewUser && tokens.accessToken) {
        await ApiService.updateProfile(tokens.accessToken, {
          fullName,
          email,
        });

        if (imageUri) {
          try {
            await ApiService.uploadProfileImage(tokens.accessToken, imageUri);

            // Refresh profile to get the uploaded image URL
            const profileRes = await ApiService.getProfile(tokens.accessToken);
            if (profileRes.success && profileRes.data) {
              await SessionService.saveSession(
                {
                  accessToken: tokens.accessToken,
                  firebaseToken: tokens.firebaseToken,
                },
                profileRes.data
              );
            }
          } catch (uploadErr) {
            console.warn('Failed to upload profile image:', uploadErr);
            // Non-blocking error, user can still proceed
          }
        }
      } else if (!isNewUser) {
        // User already exists, show banner and redirect to login if needed, or just stop
        setBanner({ type: 'error', message: 'User with this phone/email already exists. Please login.' });
        // Optional: clear session or handle logout if the API automatically logged them in
        if (tokens?.accessToken) {
          await ApiService.logout(tokens.accessToken);
        }
        return;
      }

      setBanner({ type: 'success', message: `Welcome ${isNewUser ? '' : 'back'}!` });
      router.replace('/(tabs)/home');
    } catch (err: any) {
      setError(err.message || 'Verification failed');
      setBanner({ type: 'error', message: err.message || 'Verification failed' });
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

      const response = await ApiService.sendOTP(formatPhone());

      if (response.success) {
        setTimer(60);
        setOtp(['', '', '', '', '', '']);
        setBanner({ type: 'success', message: 'OTP resent successfully!' });
      } else {
        setBanner({ type: 'error', message: response.error || 'Failed to resend OTP' });
      }
    } catch (err: any) {
      setBanner({ type: 'error', message: err.message || 'Network error' });
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
        {banner && (
          <View
            style={[
              styles.banner,
              banner.type === 'success' && styles.bannerSuccess,
              banner.type === 'error' && styles.bannerError,
              banner.type === 'info' && styles.bannerInfo,
            ]}
          >
            <Text
              style={[
                styles.bannerText,
                banner.type === 'success' && styles.bannerTextSuccess,
                banner.type === 'error' && styles.bannerTextError,
                banner.type === 'info' && styles.bannerTextInfo,
              ]}
            >
              {banner.message}
            </Text>
          </View>
        )}
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
            {/* Profile Picture Selection */}
            <View style={styles.avatarContainer}>
              <TouchableOpacity onPress={pickImage} style={styles.avatarButton}>
                {imageUri ? (
                  <Image source={{ uri: imageUri }} style={styles.avatarImage} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <AntDesign name="camera" size={32} color="#4F46E5" />
                    <Text style={styles.avatarText}>Add Photo</Text>
                  </View>
                )}
                <View style={styles.editIconContainer}>
                  <AntDesign name="plus" size={16} color="#fff" />
                </View>
              </TouchableOpacity>
            </View>

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
  banner: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  bannerText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  bannerSuccess: {
    backgroundColor: '#ECFDF3',
    borderColor: '#A7F3D0',
  },
  bannerError: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  bannerInfo: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  bannerTextSuccess: {
    color: '#166534',
  },
  bannerTextError: {
    color: '#991B1B',
  },
  bannerTextInfo: {
    color: '#1D4ED8',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarButton: {
    position: 'relative',
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#C7D2FE',
    borderStyle: 'dashed',
  },
  avatarText: {
    fontSize: 12,
    color: '#4F46E5',
    fontWeight: '600',
    marginTop: 4,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4F46E5',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
});