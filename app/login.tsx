// app/login.tsx
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// app/login.tsx
import * as LocalAuthentication from "expo-local-authentication";
import { useState } from "react";
import { Alert } from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleBiometricAuth = async () => {
    setLoading(true);
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware || !isEnrolled) {
      Alert.alert("Biometric Auth Not Available", "Your device does not support biometric authentication.");
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
      router.replace("/(tabs)/home"); // Navigate to home screen on success
    } else {
      Alert.alert("Authentication Failed", "Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Image source={require("../assets/images/logo.png")} style={styles.logo} />
      </View>

      <TouchableOpacity
        style={styles.arrowButton}
        onPress={handleBiometricAuth}
        disabled={loading}
      >
        <AntDesign name="arrowup" size={20} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.text}>Tap to Login</Text>

      <TouchableOpacity onPress={() => router.replace("/signup/signup")}>
        <View style={styles.footer}>
          <Text style={styles.footerText}>Sign Up</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 60,
    justifyContent: "space-between",
    alignItems: "center",
  },
  top: {
    alignItems: "center",
    marginTop: 80,
  },
  logo: {
    height: 300,
    resizeMode: "contain",
  },
  arrowButton: {
    backgroundColor: "#0A0A3E",
    padding: 18,
    borderRadius: 50,
    elevation: 5,
  },
  text: {
    fontSize: 16,
    color: "#0A0A3E",
  },
  footer: {
    width: "100%",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  footerText: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    color: "#0A0A3E",
  },
});
