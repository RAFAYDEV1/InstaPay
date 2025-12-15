import * as FileSystem from "expo-file-system/legacy";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Circle, Path, Svg } from "react-native-svg";
import ApiService from "../../services/api.service";
import SessionService from "../../services/session.service";


interface TransferData {
  recipient: string;
  amount: string;
  note: string;
}

interface PaymentSuccessScreenProps {
  recipient: string;
  amount: string;
}

// Success Screen Component
function PaymentSuccessScreen({
  recipient,
  amount,
}: PaymentSuccessScreenProps) {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleDownloadReceipt = async () => {
    const timestamp = new Date();
    const receiptId = `TXN-${timestamp.getTime()}`;
    const receiptDir = `${FileSystem.documentDirectory}receipts/`;
    const receiptContent = [
      "Transaction Receipt",
      `Receipt ID: ${receiptId}`,
      `Date: ${timestamp.toLocaleString()}`,
      `Recipient: ${recipient}`,
      `Amount: Rs ${amount}`,
      "Status: Completed",
    ].join("\n");

    try {
      // Ensure receipts directory exists
      await FileSystem.makeDirectoryAsync(receiptDir, { intermediates: true });

      const fileUri = `${receiptDir}${receiptId}.txt`;
      await FileSystem.writeAsStringAsync(fileUri, receiptContent, {
        encoding: 'utf8',
      });

      await Share.share({
        title: "Transaction Receipt",
        message: `Your receipt has been saved.\n\n${receiptContent}`,
        url: fileUri,
      });
    } catch (error) {
      console.error("Failed to generate receipt", error);
      Alert.alert(
        "Receipt Error",
        "We could not generate the receipt. Please try again."
      );
    }
  };

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={successStyles.container}>
      {/* Success Icon with Animation */}
      <Animated.View
        style={[
          successStyles.iconContainer,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Svg width={140} height={140} viewBox="0 0 140 140">
          {/* Outer glow circles */}
          <Circle cx="70" cy="70" r="65" fill="rgba(34, 197, 94, 0.08)" />
          <Circle cx="70" cy="70" r="52" fill="rgba(34, 197, 94, 0.15)" />
          <Circle cx="70" cy="70" r="40" fill="rgba(34, 197, 94, 0.25)" />
          <Circle cx="70" cy="70" r="32" fill="#22C55E" />

          {/* Checkmark */}
          <Path
            d="M52 70 L62 80 L88 54"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </Svg>
      </Animated.View>

      {/* Success Message */}
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={successStyles.title}>Payment Successful!</Text>
        <Text style={successStyles.subtitle}>
          Your transfer has been completed
        </Text>
      </Animated.View>

      {/* Success Details Card */}
      <Animated.View
        style={[
          successStyles.detailsContainer,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={successStyles.amountSection}>
          <Text style={successStyles.amountLabel}>Amount Sent</Text>
          <Text style={successStyles.amountText}>Rs {amount}</Text>
        </View>

        <View style={successStyles.divider} />

        <View style={successStyles.recipientSection}>
          <Text style={successStyles.recipientLabel}>Recipient</Text>
          <Text style={successStyles.recipientText}>{recipient}</Text>
        </View>

        <View style={successStyles.statusBadge}>
          <View style={successStyles.statusDot} />
          <Text style={successStyles.statusText}>Completed</Text>
        </View>
      </Animated.View>

      {/* Action Buttons */}
      <View style={successStyles.buttonContainer}>
        <TouchableOpacity
          style={successStyles.primaryButton}
          onPress={() => router.push("/home")}
          activeOpacity={0.8}
        >
          <Text style={successStyles.primaryButtonText}>Back to Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={successStyles.secondaryButton}
          onPress={handleDownloadReceipt}
          activeOpacity={0.7}
        >
          <Text style={successStyles.secondaryButtonText}>
            📄 Download Receipt
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Main Transfer Screen Component
export default function TransferScreen() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [transferData, setTransferData] = useState<TransferData>({
    recipient: "",
    amount: "",
    note: "",
  });
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [showLowBalanceBanner, setShowLowBalanceBanner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch wallet balance on component mount
  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const token = await SessionService.getAccessToken();
        if (token) {
          const response = await ApiService.getWalletBalance(token);
          if (response.success && response.data?.wallet) {
            setWalletBalance(Number(response.data.wallet.balance) || 0);
          }
        }
      } catch (error) {
        console.error('Failed to fetch wallet balance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletBalance();
  }, []);

  const handleTransfer = async () => {
    if (!recipient || !amount) {
      Alert.alert("Error", "Please enter recipient phone and amount.");
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert("Error", "Please enter a valid amount.");
      return;
    }

    // Convert local 03XXXXXXXXX to E.164 +92 for the API
    const apiRecipient =
      recipient.startsWith("0") && recipient.length === 11
        ? `+92${recipient.slice(1)}`
        : recipient;

    setSubmitting(true);
    try {
      const token = await SessionService.getAccessToken();
      if (!token) {
        Alert.alert("Error", "You must be logged in to send money.");
        return;
      }

      const response = await ApiService.sendMoney(token, {
        receiverPhone: apiRecipient,
        amount: numAmount,
        description: note,
      });

      if (!response.success) {
        Alert.alert("Transfer Failed", response.error || "Could not process transfer.");
        return;
      }

      const senderNewBalance = response.data?.senderNewBalance;
      if (senderNewBalance !== undefined) {
        setWalletBalance(Number(senderNewBalance) || 0);
      }

      setTransferData({ recipient, amount, note });
      setShowSuccess(true);
    } catch (error: any) {
      const message = error?.message || "Could not process transfer.";
      if (message.toLowerCase().includes("insufficient")) {
        setShowLowBalanceBanner(true);
        setTimeout(() => setShowLowBalanceBanner(false), 5000);
      }
      Alert.alert("Transfer Failed", message);
    } finally {
      setSubmitting(false);
    }
  };

  // Show success screen if transfer was successful
  if (showSuccess) {
    return (
      <PaymentSuccessScreen
        recipient={transferData.recipient}
        amount={transferData.amount}
      />
    );
  }

  // Show transfer form
  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.heading}>Send Money</Text>
          <Text style={styles.subheading}>
            Transfer funds instantly and securely
          </Text>
        </View>

        {/* Low Balance Banner */}
        {showLowBalanceBanner && (
          <View style={styles.lowBalanceBanner}>
            <Text style={styles.bannerIcon}>⚠️</Text>
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>Low on Balance</Text>
              <Text style={styles.bannerText}>
                Insufficient funds. Please top up your account to continue.
              </Text>
            </View>
          </View>
        )}

        {/* Form Card */}
        <View style={styles.formCard}>
          {/* Recipient Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Text style={styles.labelIcon}>👤 </Text>
              Recipient Phone Number
            </Text>
            <View
              style={[
                styles.inputContainer,
                focusedInput === "recipient" && styles.inputContainerFocused,
              ]}
            >
              <TextInput
                style={styles.input}
                placeholder="e.g. 03001234567"
                placeholderTextColor="#999"
                value={recipient}
                onChangeText={(text) => {
                  const digitsOnly = text.replace(/[^0-9]/g, "");
                  let formatted = digitsOnly;

                  if (formatted.startsWith("92") && formatted.length > 2) {
                    formatted = `0${formatted.slice(2)}`;
                  } else if (formatted && formatted[0] !== "0") {
                    formatted = `0${formatted}`;
                  }

                  setRecipient(formatted.slice(0, 11));
                }}
                autoCapitalize="none"
                keyboardType="phone-pad"
                maxLength={11}
                onFocus={() => setFocusedInput("recipient")}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
          </View>

          {/* Amount Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Text style={styles.labelIcon}>💰 </Text>
              Amount
            </Text>
            <View
              style={[
                styles.inputContainer,
                focusedInput === "amount" && styles.inputContainerFocused,
              ]}
            >
              <Text style={styles.currencyPrefix}>Rs</Text>
              <TextInput
                style={[styles.input, styles.amountInput]}
                placeholder="0.00"
                placeholderTextColor="#999"
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                onFocus={() => setFocusedInput("amount")}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
          </View>

          {/* Quick Amount Buttons */}
          <View style={styles.quickAmountContainer}>
            {["500", "1000", "2000", "5000"].map((quickAmount) => (
              <TouchableOpacity
                key={quickAmount}
                style={styles.quickAmountButton}
                onPress={() => setAmount(quickAmount)}
                activeOpacity={0.7}
              >
                <Text style={styles.quickAmountText}>{quickAmount}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Note Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Text style={styles.labelIcon}>📝 </Text>
              Note (Optional)
            </Text>
            <View
              style={[
                styles.inputContainer,
                styles.noteInputContainer,
                focusedInput === "note" && styles.inputContainerFocused,
              ]}
            >
              <TextInput
                style={[styles.input, styles.noteInput]}
                placeholder="Add a note for this transfer"
                placeholderTextColor="#999"
                value={note}
                onChangeText={setNote}
                multiline
                numberOfLines={3}
                onFocus={() => setFocusedInput("note")}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
          </View>
        </View>

        {/* Transfer Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            Transfers are processed instantly. Please verify recipient details
            before confirming.
          </Text>
        </View>

        {/* Send Button */}
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleTransfer}
          activeOpacity={0.9}
          disabled={submitting}
        >
          <Text style={styles.sendButtonText}>
            {submitting ? "Processing..." : "Send Money"}
          </Text>
          <Text style={styles.sendButtonIcon}>→</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Enhanced styles
const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#F8F9FD",
  },
  container: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
  },
  heading: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 8,
  },
  subheading: {
    fontSize: 15,
    color: "#64748B",
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },
  labelIcon: {
    fontSize: 16,
  },
  inputContainer: {
    backgroundColor: "#F8F9FD",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    minHeight: 56,
  },
  inputContainerFocused: {
    borderColor: "#0A0A3E",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#0F172A",
    padding: 0,
  },
  amountInput: {
    fontSize: 20,
    fontWeight: "600",
  },
  currencyPrefix: {
    fontSize: 18,
    fontWeight: "600",
    color: "#64748B",
    marginRight: 8,
  },
  quickAmountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 8,
  },
  quickAmountButton: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  quickAmountText: {
    color: "#475569",
    fontSize: 13,
    fontWeight: "600",
  },
  noteInputContainer: {
    minHeight: 90,
    alignItems: "flex-start",
    paddingVertical: 12,
  },
  noteInput: {
    textAlignVertical: "top",
    minHeight: 70,
  },
  infoCard: {
    backgroundColor: "#EFF6FF",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  infoIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#1E40AF",
    lineHeight: 18,
  },
  sendButton: {
    backgroundColor: "#0A0A3E",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#0A0A3E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    marginRight: 8,
  },
  sendButtonIcon: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  lowBalanceBanner: {
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FCA5A5",
  },
  bannerIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#991B1B",
    marginBottom: 4,
  },
  bannerText: {
    fontSize: 13,
    color: "#B91C1C",
    lineHeight: 18,
  },
  topUpLink: {
    backgroundColor: "#DC2626",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  topUpLinkText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
});

// Enhanced success screen styles
const successStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FD",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  iconContainer: {
    marginBottom: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#64748B",
    marginBottom: 40,
    textAlign: "center",
  },
  detailsContainer: {
    backgroundColor: "#fff",
    paddingVertical: 28,
    paddingHorizontal: 24,
    borderRadius: 20,
    width: "100%",
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  amountSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  amountLabel: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 8,
    textTransform: "uppercase",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  amountText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#0F172A",
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 20,
  },
  recipientSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  recipientLabel: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 6,
    fontWeight: "500",
  },
  recipientText: {
    fontSize: 17,
    color: "#334155",
    fontWeight: "600",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ECFDF5",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22C55E",
    marginRight: 8,
  },
  statusText: {
    fontSize: 13,
    color: "#059669",
    fontWeight: "600",
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#0A0A3E",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    width: "100%",
    shadowColor: "#0A0A3E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: "#fff",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E2E8F0",
    width: "100%",
  },
  secondaryButtonText: {
    color: "#475569",
    fontSize: 16,
    fontWeight: "600",
  },
});