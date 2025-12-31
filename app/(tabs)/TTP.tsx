import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Animated,
    Dimensions,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// Note: In a real environment, you would use 'react-native-nfc-manager'
// import NfcManager, { NfcEvents } from 'react-native-nfc-manager';

const { width } = Dimensions.get("window");

export default function TTPScreen() {
    const router = useRouter();
    const [status, setStatus] = useState<"idle" | "scanning" | "processing" | "success" | "error">("idle");
    const [pulseAnim] = useState(new Animated.Value(1));

    useEffect(() => {
        if (status === "scanning") {
            startPulse();
            // Simulate NFC detection after 3 seconds
            const timer = setTimeout(() => {
                handleNFCDetected();
            }, 3000);
            return () => clearTimeout(timer);
        } else {
            pulseAnim.stopAnimation();
        }
    }, [status]);

    const startPulse = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.2,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    const handleStartScanning = async () => {
        try {
            if (Platform.OS !== 'web') {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
            setStatus("scanning");

            // Real NFC Implementation would go here:
            // await NfcManager.start();
            // await NfcManager.requestTechnology(NfcTech.MifareIOS);
        } catch (ex) {
            console.warn('NFC not supported or permission denied', ex);
            setStatus("error");
        }
    };

    const handleNFCDetected = async () => {
        setStatus("processing");
        if (Platform.OS !== 'web') {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }

        // Simulate API call for transaction
        setTimeout(() => {
            setStatus("success");
        }, 2000);
    };

    const resetScanner = () => {
        setStatus("idle");
        pulseAnim.setValue(1);
    };

    const renderContent = () => {
        switch (status) {
            case "idle":
                return (
                    <View style={styles.content}>
                        <View style={styles.iconContainer}>
                            <MaterialCommunityIcons name="nfc" size={80} color="#4A90E2" />
                        </View>
                        <Text style={styles.title}>Tap to Pay</Text>
                        <Text style={styles.description}>
                            Hold your phone near the contactless terminal or NFC tag to make a payment.
                        </Text>
                        <TouchableOpacity style={styles.primaryButton} onPress={handleStartScanning}>
                            <Text style={styles.buttonText}>Start Scanning</Text>
                        </TouchableOpacity>
                    </View>
                );
            case "scanning":
                return (
                    <View style={styles.content}>
                        <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }] }]}>
                            <MaterialCommunityIcons name="nfc-search-variant" size={60} color="#fff" />
                        </Animated.View>
                        <Text style={styles.title}>Scanning...</Text>
                        <Text style={styles.description}>
                            Bring your device closer to the NFC reader.
                        </Text>
                        <TouchableOpacity style={styles.secondaryButton} onPress={resetScanner}>
                            <Text style={styles.secondaryButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                );
            case "processing":
                return (
                    <View style={styles.content}>
                        <View style={styles.iconContainer}>
                            <Animated.View style={{ transform: [{ rotate: pulseAnim.interpolate({ inputRange: [1, 1.2], outputRange: ['0deg', '360deg'] }) }] }}>
                                <Ionicons name="sync" size={80} color="#E67E22" />
                            </Animated.View>
                        </View>
                        <Text style={styles.title}>Processing</Text>
                        <Text style={styles.description}>
                            Verifying transaction details...
                        </Text>
                    </View>
                );
            case "success":
                return (
                    <View style={styles.content}>
                        <View style={[styles.iconContainer, { backgroundColor: '#50C87820' }]}>
                            <Ionicons name="checkmark-circle" size={80} color="#50C878" />
                        </View>
                        <Text style={[styles.title, { color: '#50C878' }]}>Payment Successful!</Text>
                        <Text style={styles.description}>
                            Your transaction has been completed successfully via NFC.
                        </Text>
                        <TouchableOpacity style={styles.primaryButton} onPress={() => router.replace("/home" as any)}>
                            <Text style={styles.buttonText}>Go to Home</Text>
                        </TouchableOpacity>
                    </View>
                );
            case "error":
                return (
                    <View style={styles.content}>
                        <View style={[styles.iconContainer, { backgroundColor: '#E74C3C20' }]}>
                            <MaterialCommunityIcons name="nfc-variant-off" size={80} color="#E74C3C" />
                        </View>
                        <Text style={[styles.title, { color: '#E74C3C' }]}>Scanning Failed</Text>
                        <Text style={styles.description}>
                            Could not detect NFC tag. Please make sure NFC is enabled on your device.
                        </Text>
                        <TouchableOpacity style={styles.primaryButton} onPress={resetScanner}>
                            <Text style={styles.buttonText}>Try Again</Text>
                        </TouchableOpacity>
                    </View>
                );
        }
    };

    return (
        <LinearGradient colors={["#F8F9FA", "#E9ECEF"]} style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#0A0A3E" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Contactless Pay</Text>
                <View style={{ width: 24 }} />
            </View>

            {renderContent()}

            <View style={styles.footer}>
                <MaterialCommunityIcons name="security" size={18} color="#888" />
                <Text style={styles.footerText}>Secure End-to-End NFC Encryption</Text>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        marginBottom: 40,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#0A0A3E",
    },
    content: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 40,
    },
    iconContainer: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    pulseCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "#4A90E2",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#0A0A3E",
        marginBottom: 16,
        textAlign: "center",
    },
    description: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        lineHeight: 24,
        marginBottom: 40,
    },
    primaryButton: {
        backgroundColor: "#0A0A3E",
        paddingVertical: 16,
        paddingHorizontal: 40,
        borderRadius: 12,
        width: '100%',
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    secondaryButton: {
        paddingVertical: 12,
        marginTop: 10,
    },
    secondaryButtonText: {
        color: "#888",
        fontSize: 16,
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 40,
        gap: 8,
    },
    footerText: {
        color: "#888",
        fontSize: 12,
    },
});
