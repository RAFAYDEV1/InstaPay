import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Circle, Path, Svg } from "react-native-svg";
import ApiService from "../../services/api.service";
import SessionService from "../../services/session.service";

interface TopUpData {
  operator: string;
  mobileNumber: string;
  amount: string;
}

interface TopUpSuccessScreenProps {
  operator: string;
  mobileNumber: string;
  amount: string;
}

// Operator logos/icons (using colored backgrounds)
const operatorColors: { [key: string]: string } = {
  Jazz: "#E91E63",
  Zong: "#9C27B0",
  Telenor: "#2196F3",
  Ufone: "#FF5722",
};

// Success Screen Component
function TopUpSuccessScreen({
  operator,
  mobileNumber,
  amount,
}: TopUpSuccessScreenProps) {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

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
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
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
        <Text style={successStyles.title}>Top-Up Successful!</Text>
        <Text style={successStyles.subtitle}>
          Your recharge has been completed
        </Text>
      </Animated.View>

      {/* Success Details Card */}
      <Animated.View
        style={[
          successStyles.detailsContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={successStyles.amountSection}>
          <Text style={successStyles.amountLabel}>AMOUNT RECHARGED</Text>
          <Text style={successStyles.amountText}>Rs {amount}</Text>
        </View>

        <View style={successStyles.divider} />

        <View style={successStyles.detailsGrid}>
          <View style={successStyles.detailRow}>
            <Text style={successStyles.detailLabel}>Mobile Number</Text>
            <Text style={successStyles.detailValue}>{mobileNumber}</Text>
          </View>

          <View style={successStyles.detailRow}>
            <Text style={successStyles.detailLabel}>Operator</Text>
            <View style={successStyles.operatorBadge}>
              <View
                style={[
                  successStyles.operatorDot,
                  { backgroundColor: operatorColors[operator] || "#8B5CF6" },
                ]}
              />
              <Text style={successStyles.detailValue}>{operator}</Text>
            </View>
          </View>
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

// Main Top-Up Screen Component
export default function TopUpScreen() {
  const router = useRouter();
  const [operator, setOperator] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [topUpData, setTopUpData] = useState<TopUpData>({
    operator: "",
    mobileNumber: "",
    amount: "",
  });
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [showLowBalanceBanner, setShowLowBalanceBanner] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const handleTopUp = () => {
    if (!operator || !mobileNumber || !amount) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    // Validate mobile number format (basic validation)
    if (mobileNumber.length !== 11 || !mobileNumber.startsWith("03")) {
      Alert.alert("Error", "Please enter a valid mobile number (03XX-XXXXXXX)");
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert("Error", "Please enter a valid amount.");
      return;
    }

    // Check wallet balance
    if (numAmount > walletBalance) {
      setShowLowBalanceBanner(true);
      setTimeout(() => setShowLowBalanceBanner(false), 5000);
      return;
    }

    // Store top-up data and show success screen
    setTopUpData({ operator, mobileNumber, amount });
    setShowSuccess(true);
  };

  // Show success screen if top-up was successful
  if (showSuccess) {
    return (
      <TopUpSuccessScreen
        operator={topUpData.operator}
        mobileNumber={topUpData.mobileNumber}
        amount={topUpData.amount}
      />
    );
  }

  // Show top-up form
  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.heading}>Mobile Top-Up</Text>
          <Text style={styles.subheading}>
            Recharge your mobile instantly
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
          {/* Operator Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Text style={styles.labelIcon}>📱 </Text>
              Select Operator
            </Text>
            <View style={[styles.pickerWrapper, operator && styles.pickerSelected]}>
              <Picker
                selectedValue={operator}
                onValueChange={(value) => setOperator(value)}
                style={styles.picker}
              >
                <Picker.Item label="Choose operator..." value="" color="#999" />
                <Picker.Item label="Jazz" value="Jazz" />
                <Picker.Item label="Zong" value="Zong" />
                <Picker.Item label="Telenor" value="Telenor" />
                <Picker.Item label="Ufone" value="Ufone" />
              </Picker>
              {operator && (
                <View
                  style={[
                    styles.operatorIndicator,
                    { backgroundColor: operatorColors[operator] },
                  ]}
                />
              )}
            </View>
          </View>

          {/* Operator Quick Select */}
          <View style={styles.operatorQuickSelect}>
            {["Jazz", "Zong", "Telenor", "Ufone"].map((op) => (
              <TouchableOpacity
                key={op}
                style={[
                  styles.operatorCard,
                  operator === op && styles.operatorCardActive,
                  { borderColor: operatorColors[op] },
                ]}
                onPress={() => setOperator(op)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.operatorColorDot,
                    { backgroundColor: operatorColors[op] },
                  ]}
                />
                <Text
                  style={[
                    styles.operatorCardText,
                    operator === op && styles.operatorCardTextActive,
                  ]}
                >
                  {op}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Mobile Number Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Text style={styles.labelIcon}>📞 </Text>
              Mobile Number
            </Text>
            <View
              style={[
                styles.inputContainer,
                focusedInput === "mobile" && styles.inputContainerFocused,
              ]}
            >
              <Text style={styles.mobilePrefix}>+92</Text>
              <TextInput
                style={styles.input}
                placeholder="3XX-XXXXXXX"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                value={mobileNumber}
                onChangeText={(text) => {
                  // Remove any non-numeric characters
                  const cleaned = text.replace(/[^0-9]/g, "");
                  setMobileNumber(cleaned);
                }}
                maxLength={11}
                onFocus={() => setFocusedInput("mobile")}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
            {mobileNumber && mobileNumber.length === 11 && (
              <Text style={styles.validationSuccess}>✓ Valid number</Text>
            )}
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
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                onFocus={() => setFocusedInput("amount")}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
          </View>

          {/* Quick Amount Selection */}
          <View style={styles.quickAmountContainer}>
            <Text style={styles.quickAmountLabel}>Quick amounts:</Text>
            <View style={styles.quickAmountGrid}>
              {["100", "200", "500", "1000"].map((quickAmount) => (
                <TouchableOpacity
                  key={quickAmount}
                  style={[
                    styles.quickAmountButton,
                    amount === quickAmount && styles.quickAmountButtonActive,
                  ]}
                  onPress={() => setAmount(quickAmount)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.quickAmountText,
                      amount === quickAmount && styles.quickAmountTextActive,
                    ]}
                  >
                    Rs {quickAmount}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>⚡</Text>
          <Text style={styles.infoText}>
            Instant recharge • Available 24/7 • No hidden charges
          </Text>
        </View>

        {/* Top-Up Button */}
        <TouchableOpacity
          style={[
            styles.topUpButton,
            (!operator || !mobileNumber || !amount) &&
            styles.topUpButtonDisabled,
          ]}
          onPress={handleTopUp}
          activeOpacity={0.9}
          disabled={!operator || !mobileNumber || !amount}
        >
          <Text style={styles.topUpButtonText}>Top Up Now</Text>
          <Text style={styles.topUpButtonIcon}>→</Text>
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
  pickerWrapper: {
    backgroundColor: "#F8F9FD",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    overflow: "hidden",
    position: "relative",
  },
  pickerSelected: {
    borderColor: "#0A0A3E",
    backgroundColor: "#fff",
  },
  picker: {
    color: "#0F172A",
    fontSize: 16,
  },
  operatorIndicator: {
    position: "absolute",
    right: 12,
    top: "50%",
    marginTop: -6,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  operatorQuickSelect: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  operatorCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#F8F9FD",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E2E8F0",
  },
  operatorCardActive: {
    backgroundColor: "#fff",
    borderWidth: 2,
  },
  operatorColorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  operatorCardText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
  },
  operatorCardTextActive: {
    color: "#0F172A",
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
  mobilePrefix: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748B",
    marginRight: 8,
  },
  currencyPrefix: {
    fontSize: 18,
    fontWeight: "600",
    color: "#64748B",
    marginRight: 8,
  },
  amountInput: {
    fontSize: 20,
    fontWeight: "600",
  },
  validationSuccess: {
    fontSize: 12,
    color: "#22C55E",
    marginTop: 6,
    fontWeight: "500",
  },
  quickAmountContainer: {
    marginTop: 4,
  },
  quickAmountLabel: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 10,
    fontWeight: "500",
  },
  quickAmountGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  quickAmountButton: {
    flex: 1,
    minWidth: "22%",
    backgroundColor: "#F1F5F9",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E2E8F0",
  },
  quickAmountButtonActive: {
    backgroundColor: "#EEF2FF",
    borderColor: "#0A0A3E",
  },
  quickAmountText: {
    color: "#475569",
    fontSize: 13,
    fontWeight: "600",
  },
  quickAmountTextActive: {
    color: "#0A0A3E",
  },
  infoCard: {
    backgroundColor: "#ECFDF5",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#D1FAE5",
  },
  infoIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#059669",
    lineHeight: 18,
    fontWeight: "500",
  },
  topUpButton: {
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
  topUpButtonDisabled: {
    backgroundColor: "#CBD5E1",
    shadowOpacity: 0,
  },
  topUpButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    marginRight: 8,
  },
  topUpButtonIcon: {
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
    fontSize: 11,
    color: "#64748B",
    marginBottom: 8,
    fontWeight: "700",
    letterSpacing: 1,
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
  detailsGrid: {
    gap: 16,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 15,
    color: "#0F172A",
    fontWeight: "600",
  },
  operatorBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FD",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  operatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
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