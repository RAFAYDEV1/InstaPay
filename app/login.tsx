// app/login.tsx
import { AntDesign } from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
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
      Alert.alert(
        "Biometric Auth Not Available", 
        "Your device does not support biometric authentication."
      );
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
      Alert.alert("Authentication Failed", "Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Background gradient effect */}
      <View style={styles.backgroundCircle1} />
      <View style={styles.backgroundCircle2} />
      
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Image 
              source={require("../assets/images/logo.png")} 
              style={styles.logo} 
            />
          </View>
          <Text style={styles.welcomeText}>Welcome Back</Text>
          <Text style={styles.subtitleText}>Secure authentication at your fingertips</Text>
        </View>

        {/* Auth Button Section */}
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
    </View>
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
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 60,
    paddingHorizontal: 30,
  },
  logoSection: {
    alignItems: "center",
    marginTop: 40,
  },
  logoContainer: {
    marginBottom: 30,
  },
  logo: {
    height: 280,
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
  footer: {
    width: "100%",
    alignItems: "center",
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