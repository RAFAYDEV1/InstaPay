// app/login.tsx
import { AntDesign } from "@expo/vector-icons";
import * as Crypto from "expo-crypto";
import * as LocalAuthentication from "expo-local-authentication";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
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
} from "react-native";
import ApiService from "../services/api.service";
import SessionService from "../services/session.service";

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState<'biometric' | 'credentials'>('biometric');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous pulse animation for button
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleBiometricAuth = async () => {
    setLoading(true);
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware || !isEnrolled) {
      setBanner({
        type: 'error',
        message: 'Biometric authentication not available on this device'
      });
      setLoading(false);
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate to Login",
      fallbackLabel: "Use Passcode",
      disableDeviceFallback: false,
    });

    setLoading(false);

    if (result.success) {
      router.replace("/(tabs)/home");
    } else {
      setBanner({ type: 'error', message: 'Authentication failed. Please try again.' });
    }
  };

  const handleCredentialLogin = async () => {
    try {
      setLoading(true);
      setBanner(null);

      // Validate inputs
      if (!username.trim() || !password.trim()) {
        setBanner({ type: 'error', message: 'Please enter both username and password' });
        setLoading(false);
        return;
      }

      // Hash password with SHA-256
      const hashedPassword = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        password
      );

      // Call login API
      const response = await ApiService.login(username.trim(), hashedPassword);
      const body = response.data as any;

      // Handle invalid credentials / backend-declared failure
      if (!response.success || !body || body.success === false) {
        const msg =
          body?.message ||
          response.error ||
          response.message ||
          'Invalid username or password';
        setBanner({ type: 'error', message: msg });
        setLoading(false);
        return;
      }

      const { user, tokens } = body;

      // Save session
      if (tokens?.accessToken) {
        await SessionService.saveSession(
          {
            accessToken: tokens.accessToken,
            firebaseToken: tokens.firebaseToken,
          },
          {
            id: user.id,
            phoneNumber: user.phoneNumber,
            fullName: user.fullName,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
          }
        );

        setBanner({ type: 'success', message: 'Login successful!' });
        setTimeout(() => {
          router.replace("/(tabs)/home");
        }, 500);
      } else {
        setBanner({ type: 'error', message: 'Missing access token from server' });
      }
    } catch (err: any) {
      setBanner({ type: 'error', message: err.message || 'Login failed' });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = username.trim().length > 0 && password.length >= 8;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Background gradient effect */}
      <View style={styles.backgroundCircle1} />
      <View style={styles.backgroundCircle2} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          {/* Banner */}
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

          {/* Logo Section */}
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <Image
                source={require("../assets/images/logo.png")}
                style={styles.logo}
              />
            </View>
            <Text style={styles.welcomeText}>Welcome Back</Text>
            <Text style={styles.subtitleText}>
              {loginMethod === 'biometric'
                ? 'Secure authentication at your fingertips'
                : 'Login with your credentials'}
            </Text>
          </View>

          {/* Login Method Toggle */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleButton, loginMethod === 'biometric' && styles.toggleButtonActive]}
              onPress={() => setLoginMethod('biometric')}
            >
              <AntDesign
                name="scan"
                size={20}
                color={loginMethod === 'biometric' ? '#fff' : '#6B7280'}
              />
              <Text style={[
                styles.toggleText,
                loginMethod === 'biometric' && styles.toggleTextActive
              ]}>
                Biometric
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, loginMethod === 'credentials' && styles.toggleButtonActive]}
              onPress={() => setLoginMethod('credentials')}
            >
              <AntDesign
                name="user"
                size={20}
                color={loginMethod === 'credentials' ? '#fff' : '#6B7280'}
              />
              <Text style={[
                styles.toggleText,
                loginMethod === 'credentials' && styles.toggleTextActive
              ]}>
                Credentials
              </Text>
            </TouchableOpacity>
          </View>

          {/* Biometric Auth Section */}
          {loginMethod === 'biometric' && (
            <View style={styles.authSection}>
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <TouchableOpacity
                  style={[styles.arrowButton, loading && styles.arrowButtonDisabled]}
                  onPress={handleBiometricAuth}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <View style={styles.buttonInner}>
                    <AntDesign
                      name="arrow-up"
                      size={28}
                      color="#fff"
                    />
                  </View>
                </TouchableOpacity>
              </Animated.View>

              <Text style={styles.instructionText}>
                {loading ? "Authenticating..." : "Tap to Login"}
              </Text>

              <View style={styles.securityBadge}>
                <AntDesign name="lock" size={14} color="#0A0A3E" />
                <Text style={styles.securityText}>Secured with biometrics</Text>
              </View>
            </View>
          )}

          {/* Credentials Auth Section */}
          {loginMethod === 'credentials' && (
            <View style={styles.credentialsSection}>
              {/* Username Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Username</Text>
                <View style={styles.inputWrapper}>
                  <AntDesign name="user" size={20} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your username"
                    placeholderTextColor="#9CA3AF"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputWrapper}>
                  <AntDesign name="lock" size={20} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <AntDesign
                      name={showPassword ? "eye" : "eye-invisible"}
                      size={20}
                      color="#9CA3AF"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Login Button */}
              <TouchableOpacity
                style={[styles.loginButton, (!isFormValid || loading) && styles.buttonDisabled]}
                onPress={handleCredentialLogin}
                disabled={!isFormValid || loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.loginButtonText}>Login</Text>
                    <AntDesign name="arrow-right" size={20} color="#fff" />
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* Footer Section */}
          <View style={styles.footer}>
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              onPress={() => router.replace("/signup/signup")}
              style={styles.signupButton}
              activeOpacity={0.7}
            >
              <Text style={styles.signupText}>Create New Account</Text>
              <AntDesign name="arrow-right" size={16} color="#0A0A3E" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFBFF",
  },
  backgroundCircle1: {
    position: "absolute",
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width * 0.75,
    backgroundColor: "rgba(10, 10, 62, 0.03)",
    top: -width * 0.5,
    left: -width * 0.3,
  },
  backgroundCircle2: {
    position: "absolute",
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    backgroundColor: "rgba(10, 10, 62, 0.02)",
    bottom: -width * 0.4,
    right: -width * 0.4,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 60,
    paddingHorizontal: 30,
  },
  banner: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  bannerSuccess: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  bannerError: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  bannerInfo: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  bannerText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  bannerTextSuccess: {
    color: '#15803d',
  },
  bannerTextError: {
    color: '#b91c1c',
  },
  bannerTextInfo: {
    color: '#1e40af',
  },
  logoSection: {
    alignItems: "center",
    marginTop: 20,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    height: 200,
    width: width - 100,
    resizeMode: "contain",
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#0A0A3E",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitleText: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 4,
    marginVertical: 20,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  toggleButtonActive: {
    backgroundColor: '#0A0A3E',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  toggleTextActive: {
    color: '#fff',
  },
  authSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  arrowButton: {
    backgroundColor: "#0A0A3E",
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#0A0A3E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  arrowButtonDisabled: {
    opacity: 0.6,
  },
  buttonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  instructionText: {
    fontSize: 18,
    color: "#0A0A3E",
    marginTop: 24,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  securityBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(10, 10, 62, 0.06)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 16,
    gap: 6,
  },
  securityText: {
    fontSize: 13,
    color: "#0A0A3E",
    fontWeight: "500",
  },
  credentialsSection: {
    marginVertical: 20,
    gap: 16,
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
  loginButton: {
    flexDirection: 'row',
    backgroundColor: '#0A0A3E',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    elevation: 4,
    shadowColor: '#0A0A3E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonDisabled: {
    backgroundColor: '#D1D5DB',
    elevation: 0,
    shadowOpacity: 0,
  },
  loginButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
  footer: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  signupButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    width: "100%",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    gap: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  signupText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0A0A3E",
    letterSpacing: 0.2,
  },
});
