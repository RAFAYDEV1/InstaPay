import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Circle, Path, Svg } from "react-native-svg";

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

// Success Screen Component
function TopUpSuccessScreen({
  operator,
  mobileNumber,
  amount,
}: TopUpSuccessScreenProps) {
  const router = useRouter();
  return (
    <View style={successStyles.container}>
      {/* Success Icon */}
      <View style={successStyles.iconContainer}>
        <Svg width={120} height={120} viewBox="0 0 120 120">
          {/* Outer glow circles */}
          <Circle cx="60" cy="60" r="55" fill="rgba(72, 187, 120, 0.1)" />
          <Circle cx="60" cy="60" r="45" fill="rgba(72, 187, 120, 0.2)" />
          <Circle cx="60" cy="60" r="35" fill="rgba(72, 187, 120, 0.4)" />
          <Circle cx="60" cy="60" r="28" fill="#48BB78" />

          {/* Checkmark */}
          <Path
            d="M45 60 L54 69 L75 48"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </Svg>
      </View>

      {/* Success Message */}
      <Text style={successStyles.title}>Congratulations</Text>

      {/* Success Details */}
      <View style={successStyles.detailsContainer}>
        <Text style={successStyles.successText}>Top-Up Successful</Text>
        <Text style={successStyles.amountText}>Rs {amount}</Text>
        <Text style={successStyles.detailText}>to {mobileNumber}</Text>
        <Text style={successStyles.operatorText}>via {operator}</Text>
      </View>

      {/* Action Buttons */}
      <View style={successStyles.buttonContainer}>
        <TouchableOpacity
          style={successStyles.primaryButton}
          onPress={() => router.push("/home")}
        >
          <Text style={successStyles.primaryButtonText}>Done</Text>
        </TouchableOpacity>

        <TouchableOpacity style={successStyles.secondaryButton}>
          <Text style={successStyles.secondaryButtonText}>View Receipt</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Main Top-Up Screen Component
export default function TopUpScreen() {
  const [operator, setOperator] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [topUpData, setTopUpData] = useState<TopUpData>({
    operator: "",
    mobileNumber: "",
    amount: "",
  });

  const handleTopUp = () => {
    if (!operator || !mobileNumber || !amount) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    // Store top-up data and show success screen
    setTopUpData({ operator, mobileNumber, amount });
    setShowSuccess(true);
  };

  const handleGoBack = () => {
    setShowSuccess(false);
    setOperator("");
    setMobileNumber("");
    setAmount("");
    setTopUpData({ operator: "", mobileNumber: "", amount: "" });
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
    <View style={styles.container}>
      <Text style={styles.heading}>Mobile Top-Up</Text>

      <Text style={styles.label}>Select Operator</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={operator}
          onValueChange={(value) => setOperator(value)}
          style={styles.picker}
        >
          <Picker.Item label="Choose operator..." value="" />
          <Picker.Item label="Jazz" value="Jazz" />
          <Picker.Item label="Zong" value="Zong" />
          <Picker.Item label="Telenor" value="Telenor" />
          <Picker.Item label="Ufone" value="Ufone" />
        </Picker>
      </View>

      <Text style={styles.label}>Mobile Number</Text>
      <TextInput
        style={styles.input}
        placeholder="03XX-XXXXXXX"
        placeholderTextColor="#aaa"
        keyboardType="phone-pad"
        value={mobileNumber}
        onChangeText={setMobileNumber}
        maxLength={11}
      />

      <Text style={styles.label}>Amount (Rs)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter amount"
        placeholderTextColor="#aaa"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <TouchableOpacity style={styles.payButton} onPress={handleTopUp}>
        <Text style={styles.payButtonText}>Top Up Now</Text>
      </TouchableOpacity>
    </View>
  );
}

// Original styles
const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#fff",
    flex: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0A0A3E",
    marginBottom: 30,
    textAlign: "center",
  },
  label: {
    color: "#555",
    fontSize: 14,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#F0F0F0",
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    color: "#000",
  },
  pickerWrapper: {
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    overflow: "hidden",
  },
  picker: {
    color: "#000",
  },
  payButton: {
    backgroundColor: "#0A0A3E",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 30,
    alignItems: "center",
  },
  payButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

// Success screen styles
const successStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  iconContainer: {
    marginBottom: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0A0A3E",
    marginBottom: 40,
    textAlign: "center",
  },
  detailsContainer: {
    backgroundColor: "#F8F9FF",
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 40,
    width: "100%",
  },
  successText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  amountText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0A0A3E",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 16,
    color: "#888",
    marginBottom: 4,
  },
  operatorText: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#0A0A3E",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    width: "100%",
  },
  secondaryButtonText: {
    color: "#0A0A3E",
    fontSize: 16,
    fontWeight: "500",
  },
});
