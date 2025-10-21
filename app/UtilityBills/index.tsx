import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Circle, Path, Svg } from 'react-native-svg';

interface BillData {
  billType: string;
  consumerNumber: string;
  amount: string;
}

interface BillPaymentSuccessScreenProps {
  billType: string;
  consumerNumber: string;
  amount: string;
}

// Bill type colors and icons
const billTypeConfig: { [key: string]: { color: string; icon: string; emoji: string } } = {
  Electricity: { color: '#F59E0B', icon: '⚡', emoji: '💡' },
  Gas: { color: '#EF4444', icon: '🔥', emoji: '🔥' },
  Water: { color: '#3B82F6', icon: '💧', emoji: '💧' },
  Internet: { color: '#8B5CF6', icon: '📡', emoji: '🌐' },
  PTCL: { color: '#10B981', icon: '📞', emoji: '☎️' },
};

// Success Screen Component
function BillPaymentSuccessScreen({ 
  billType, 
  consumerNumber, 
  amount 
}: BillPaymentSuccessScreenProps) {
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

  const billConfig = billTypeConfig[billType] || billTypeConfig.Electricity;

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
          <Circle cx="70" cy="70" r="65" fill="rgba(34, 197, 94, 0.08)" />
          <Circle cx="70" cy="70" r="52" fill="rgba(34, 197, 94, 0.15)" />
          <Circle cx="70" cy="70" r="40" fill="rgba(34, 197, 94, 0.25)" />
          <Circle cx="70" cy="70" r="32" fill="#22C55E" />
          
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
          Your bill has been paid successfully
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
          <Text style={successStyles.amountLabel}>AMOUNT PAID</Text>
          <Text style={successStyles.amountText}>Rs {amount}</Text>
        </View>

        <View style={successStyles.divider} />

        <View style={successStyles.detailsGrid}>
          <View style={successStyles.detailRow}>
            <Text style={successStyles.detailLabel}>Bill Type</Text>
            <View style={successStyles.billTypeBadge}>
              <View
                style={[
                  successStyles.billTypeIcon,
                  { backgroundColor: billConfig.color },
                ]}
              >
                <Text style={successStyles.billTypeEmoji}>{billConfig.emoji}</Text>
              </View>
              <Text style={successStyles.detailValue}>{billType}</Text>
            </View>
          </View>

          <View style={successStyles.detailRow}>
            <Text style={successStyles.detailLabel}>Consumer No.</Text>
            <Text style={successStyles.consumerNumber}>{consumerNumber}</Text>
          </View>
        </View>

        <View style={successStyles.statusBadge}>
          <View style={successStyles.statusDot} />
          <Text style={successStyles.statusText}>Payment Confirmed</Text>
        </View>
      </Animated.View>

      {/* Action Buttons */}
      <View style={successStyles.buttonContainer}>
        <TouchableOpacity
          style={successStyles.primaryButton}
          onPress={() => router.push('/home')}
          activeOpacity={0.8}
        >
          <Text style={successStyles.primaryButtonText}>Back to Home</Text>
        </TouchableOpacity>

        <View style={successStyles.secondaryButtonsRow}>
          <TouchableOpacity
            style={successStyles.secondaryButton}
            activeOpacity={0.7}
          >
            <Text style={successStyles.secondaryButtonIcon}>📄</Text>
            <Text style={successStyles.secondaryButtonText}>Receipt</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={successStyles.secondaryButton}
            activeOpacity={0.7}
          >
            <Text style={successStyles.secondaryButtonIcon}>💾</Text>
            <Text style={successStyles.secondaryButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// Main Utility Bills Screen Component
export default function UtilityBillsScreen() {
  const [billType, setBillType] = useState('');
  const [consumerNumber, setConsumerNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [billData, setBillData] = useState<BillData>({
    billType: '',
    consumerNumber: '',
    amount: ''
  });

  const handlePayment = () => {
    if (!billType || !consumerNumber || !amount) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount.');
      return;
    }

    // Store bill payment data and show success screen
    setBillData({ billType, consumerNumber, amount });
    setShowSuccess(true);
  };

  // Show success screen if payment was successful
  if (showSuccess) {
    return (
      <BillPaymentSuccessScreen
        billType={billData.billType}
        consumerNumber={billData.consumerNumber}
        amount={billData.amount}
      />
    );
  }

  const billConfig = billType ? billTypeConfig[billType] : null;

  // Show utility bills form
  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.heading}>Pay Utility Bills</Text>
          <Text style={styles.subheading}>
            Pay your bills instantly and conveniently
          </Text>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          {/* Bill Type Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <Text style={styles.labelIcon}>📋 </Text>
              Select Bill Type
            </Text>
            <View style={[styles.pickerWrapper, billType && styles.pickerSelected]}>
              <Picker
                selectedValue={billType}
                onValueChange={(itemValue) => setBillType(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Choose bill type..." value="" color="#999" />
                <Picker.Item label="⚡ Electricity (KE, LESCO, IESCO)" value="Electricity" />
                <Picker.Item label="🔥 Gas (SSGC, SNGPL)" value="Gas" />
                <Picker.Item label="💧 Water (KWSB)" value="Water" />
                <Picker.Item label="🌐 Internet (StormFiber, Nayatel)" value="Internet" />
                <Picker.Item label="☎️ PTCL Landline" value="PTCL" />
              </Picker>
              {billConfig && (
                <View
                  style={[
                    styles.billTypeIndicator,
                    { backgroundColor: billConfig.color },
                  ]}
                />
              )}
            </View>
          </View>

          {/* Quick Bill Type Selection */}
          <View style={styles.billTypeGrid}>
            {Object.keys(billTypeConfig).map((type) => {
              const config = billTypeConfig[type];
              return (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.billTypeCard,
                    billType === type && styles.billTypeCardActive,
                    { borderColor: config.color },
                  ]}
                  onPress={() => setBillType(type)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.billTypeIconContainer,
                      billType === type && { backgroundColor: config.color },
                    ]}
                  >
                    <Text style={styles.billTypeIcon}>{config.icon}</Text>
                  </View>
                  <Text
                    style={[
                      styles.billTypeCardText,
                      billType === type && styles.billTypeCardTextActive,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Conditional Fields - Only show after bill type is selected */}
          {billType !== '' && (
            <>
              {/* Consumer Number Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  <Text style={styles.labelIcon}>🔢 </Text>
                  Consumer/Account Number
                </Text>
                <View
                  style={[
                    styles.inputContainer,
                    focusedInput === 'consumer' && styles.inputContainerFocused,
                  ]}
                >
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your account number"
                    placeholderTextColor="#999"
                    value={consumerNumber}
                    onChangeText={setConsumerNumber}
                    keyboardType="number-pad"
                    onFocus={() => setFocusedInput('consumer')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </View>
              </View>

              {/* Amount Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  <Text style={styles.labelIcon}>💰 </Text>
                  Bill Amount
                </Text>
                <View
                  style={[
                    styles.inputContainer,
                    focusedInput === 'amount' && styles.inputContainerFocused,
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
                    onFocus={() => setFocusedInput('amount')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </View>
              </View>

              {/* Bill Summary Card */}
              {consumerNumber && amount && billConfig && (
                <View style={[styles.summaryCard, { borderLeftColor: billConfig.color }]}>
                  <View style={styles.summaryHeader}>
                    <Text style={styles.summaryIcon}>{billConfig.emoji}</Text>
                    <Text style={styles.summaryTitle}>Payment Summary</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Bill Type:</Text>
                    <Text style={styles.summaryValue}>{billType}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Consumer No:</Text>
                    <Text style={styles.summaryValue}>{consumerNumber}</Text>
                  </View>
                  <View style={styles.summaryDivider} />
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryTotalLabel}>Total Amount:</Text>
                    <Text style={styles.summaryTotalValue}>Rs {amount}</Text>
                  </View>
                </View>
              )}
            </>
          )}
        </View>

        {/* Info Card - Only show when bill type is selected */}
        {billType && (
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>ℹ️</Text>
            <Text style={styles.infoText}>
              Bills are processed instantly. Please verify all details before confirming payment.
            </Text>
          </View>
        )}

        {/* Pay Button - Only show when bill type is selected */}
        {billType && (
          <TouchableOpacity
            style={[
              styles.payButton,
              (!consumerNumber || !amount) && styles.payButtonDisabled,
            ]}
            onPress={handlePayment}
            activeOpacity={0.9}
            disabled={!consumerNumber || !amount}
          >
            <Text style={styles.payButtonText}>Pay Bill</Text>
            <Text style={styles.payButtonIcon}>→</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

// Enhanced styles
const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#F8F9FD',
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
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8,
  },
  subheading: {
    fontSize: 15,
    color: '#64748B',
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  labelIcon: {
    fontSize: 16,
  },
  pickerWrapper: {
    backgroundColor: '#F8F9FD',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    position: 'relative',
  },
  pickerSelected: {
    borderColor: '#0A0A3E',
    backgroundColor: '#fff',
  },
  picker: {
    color: '#0F172A',
    fontSize: 16,
  },
  billTypeIndicator: {
    position: 'absolute',
    right: 12,
    top: '50%',
    marginTop: -6,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  billTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  billTypeCard: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#F8F9FD',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  billTypeCardActive: {
    backgroundColor: '#fff',
    borderWidth: 2,
  },
  billTypeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  billTypeIcon: {
    fontSize: 20,
  },
  billTypeCardText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
  },
  billTypeCardTextActive: {
    color: '#0F172A',
  },
  inputContainer: {
    backgroundColor: '#F8F9FD',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    minHeight: 56,
  },
  inputContainerFocused: {
    borderColor: '#0A0A3E',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#0F172A',
    padding: 0,
  },
  currencyPrefix: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748B',
    marginRight: 8,
  },
  amountInput: {
    fontSize: 20,
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    marginTop: 8,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  summaryValue: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },
  summaryTotalLabel: {
    fontSize: 15,
    color: '#334155',
    fontWeight: '700',
  },
  summaryTotalValue: {
    fontSize: 18,
    color: '#0A0A3E',
    fontWeight: '700',
  },
  infoCard: {
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  infoIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#92400E',
    lineHeight: 18,
    fontWeight: '500',
  },
  payButton: {
    backgroundColor: '#0A0A3E',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#0A0A3E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  payButtonDisabled: {
    backgroundColor: '#CBD5E1',
    shadowOpacity: 0,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    marginRight: 8,
  },
  payButtonIcon: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

// Enhanced success screen styles
const successStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FD',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  iconContainer: {
    marginBottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    marginBottom: 40,
    textAlign: 'center',
  },
  detailsContainer: {
    backgroundColor: '#fff',
    paddingVertical: 28,
    paddingHorizontal: 24,
    borderRadius: 20,
    width: '100%',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  amountSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  amountLabel: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 8,
    fontWeight: '700',
    letterSpacing: 1,
  },
  amountText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 20,
  },
  detailsGrid: {
    gap: 16,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '600',
  },
  billTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FD',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 8,
  },
  billTypeIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  billTypeEmoji: {
    fontSize: 14,
  },
  consumerNumber: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
    fontFamily: 'monospace',
    backgroundColor: '#F1F5F9',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECFDF5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
    marginRight: 8,
  },
  statusText: {
    fontSize: 13,
    color: '#059669',
    fontWeight: '600',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#0A0A3E',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#0A0A3E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  secondaryButtonIcon: {
    fontSize: 16,
  },
  secondaryButtonText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '600',
  },
});