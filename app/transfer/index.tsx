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
        <Text style={successStyles.successText}>Payment Successful</Text>
        <Text style={successStyles.amountText}>Rs {amount}</Text>
        <Text style={successStyles.recipientText}>sent to {recipient}</Text>
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

// Main Transfer Screen Component
export default function TransferScreen() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [transferData, setTransferData] = useState<TransferData>({
    recipient: "",
    amount: "",
    note: "",
  });

  const handleTransfer = () => {
    if (!recipient || !amount) {
      Alert.alert("Error", "Please enter recipient and amount.");
      return;
    }

    // Store transfer data and show success screen
    setTransferData({ recipient, amount, note });
    setShowSuccess(true);
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
    <View style={styles.container}>
      <Text style={styles.heading}>Send Money</Text>

      <Text style={styles.label}>Recipient Account/Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter recipient account"
        placeholderTextColor="#aaa"
        value={recipient}
        onChangeText={setRecipient}
        keyboardType="number-pad"
      />

      <Text style={styles.label}>Amount (Rs)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter amount"
        placeholderTextColor="#aaa"
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
      />

      <Text style={styles.label}>Note (Optional)</Text>
      <TextInput
        style={[styles.input, styles.noteInput]}
        placeholder="Add a note"
        placeholderTextColor="#aaa"
        value={note}
        onChangeText={setNote}
      />

      <TouchableOpacity style={styles.sendButton} onPress={handleTransfer}>
        <Text style={styles.sendButtonText}>Send Money</Text>
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
  noteInput: {
    height: 80,
    textAlignVertical: "top",
  },
  sendButton: {
    backgroundColor: "#0A0A3E",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 30,
    alignItems: "center",
  },
  sendButtonText: {
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
    marginBottom: 4,
  },
  recipientText: {
    fontSize: 14,
    color: "#888",
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
