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
import ApiService from '../../services/api.service';
import SessionService from '../../services/session.service';

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

// Enhanced bill type configuration with gradients
const billTypeConfig: {
  [key: string]: {
    color: string;
    icon: string;
    emoji: string;
    gradient: string[];
    lightBg: string;
  }
} = {
  Electricity: {
    color: '#F59E0B',
    icon: '⚡',
    emoji: '💡',
    gradient: ['#FCD34D', '#F59E0B'],
    lightBg: '#FEF3C7',
  },
  Gas: {
    color: '#EF4444',
    icon: '🔥',
    emoji: '🔥',
    gradient: ['#FCA5A5', '#EF4444'],
    lightBg: '#FEE2E2',
  },
  Water: {
    color: '#3B82F6',
    icon: '💧',
    emoji: '💧',
    gradient: ['#93C5FD', '#3B82F6'],
    lightBg: '#DBEAFE',
  },
  Internet: {
    color: '#8B5CF6',
    icon: '📡',
    emoji: '🌐',
    gradient: ['#C4B5FD', '#8B5CF6'],
    lightBg: '#EDE9FE',
  },
  PTCL: {
    color: '#10B981',
    icon: '📞',
    emoji: '☎️',
    gradient: ['#6EE7B7', '#10B981'],
    lightBg: '#D1FAE5',
  },
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
  const pulseAnim = useRef(new Animated.Value(1)).current;

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

    // Pulse animation for success icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
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
  }, []);

  const billConfig = billTypeConfig[billType] || billTypeConfig.Electricity;

  return (
    <ScrollView style={successStyles.scrollView}>
      <View style={successStyles.container}>
        {/* Success Icon with Enhanced Animation */}
        <Animated.View
          style={[
            successStyles.iconContainer,
            {
              transform: [{ scale: Animated.multiply(scaleAnim, pulseAnim) }],
            },
          ]}
        >
          <Svg width={160} height={160} viewBox="0 0 160 160">
            <Circle cx="80" cy="80" r="75" fill="rgba(34, 197, 94, 0.05)" />
            <Circle cx="80" cy="80" r="62" fill="rgba(34, 197, 94, 0.1)" />
            <Circle cx="80" cy="80" r="50" fill="rgba(34, 197, 94, 0.2)" />
            <Circle cx="80" cy="80" r="38" fill="#22C55E" />
            <Path
              d="M60 80 L72 92 L100 64"
              stroke="white"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </Svg>
        </Animated.View>

        {/* Success Message */}
        <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
          <Text style={successStyles.title}>Payment Successful! 🎉</Text>
          <Text style={successStyles.subtitle}>
            Your {billType} bill has been paid successfully
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
            <View style={successStyles.amountUnderline} />
          </View>

          <View style={successStyles.divider} />

          <View style={successStyles.detailsGrid}>
            <View style={successStyles.detailRow}>
              <Text style={successStyles.detailLabel}>Bill Type</Text>
              <View style={[successStyles.billTypeBadge, { backgroundColor: billConfig.lightBg }]}>
                <View style={[successStyles.billTypeIconSmall, { backgroundColor: billConfig.color }]}>
                  <Text style={successStyles.billTypeEmojiSmall}>{billConfig.emoji}</Text>
                </View>
                <Text style={[successStyles.detailValue, { color: billConfig.color }]}>
                  {billType}
                </Text>
              </View>
            </View>

            <View style={successStyles.detailRow}>
              <Text style={successStyles.detailLabel}>Consumer Number</Text>
              <Text style={successStyles.consumerNumber}>{consumerNumber}</Text>
            </View>

            <View style={successStyles.detailRow}>
              <Text style={successStyles.detailLabel}>Transaction Date</Text>
              <Text style={successStyles.detailValue}>
                {new Date().toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </Text>
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
            <TouchableOpacity style={successStyles.secondaryButton} activeOpacity={0.7}>
              <Text style={successStyles.secondaryButtonIcon}>📄</Text>
              <Text style={successStyles.secondaryButtonText}>Receipt</Text>
            </TouchableOpacity>

            <TouchableOpacity style={successStyles.secondaryButton} activeOpacity={0.7}>
              <Text style={successStyles.secondaryButtonIcon}>💾</Text>
              <Text style={successStyles.secondaryButtonText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity style={successStyles.secondaryButton} activeOpacity={0.7}>
              <Text style={successStyles.secondaryButtonIcon}>↗️</Text>
              <Text style={successStyles.secondaryButtonText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

// Main Utility Bills Screen Component
export default function UtilityBillsScreen() {
  const router = useRouter();
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
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [showLowBalanceBanner, setShowLowBalanceBanner] = useState(false);
  const [loading, setLoading] = useState(true);

  const slideUpAnim = useRef(new Animated.Value(30)).current;
  const fadeInAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(fadeInAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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

    // Check wallet balance
    if (numAmount > walletBalance) {
      setShowLowBalanceBanner(true);
      setTimeout(() => setShowLowBalanceBanner(false), 5000);
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
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <Animated.View
        style={[
          styles.container,
          {
            opacity: fadeInAnim,
            transform: [{ translateY: slideUpAnim }]
          }
        ]}
      >
        {/* Enhanced Header Section */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Text style={styles.headerIconText}>💳</Text>
          </View>
          <Text style={styles.heading}>Pay Utility Bills</Text>
          <Text style={styles.subheading}>
            Quick and secure bill payments
          </Text>

          {/* Wallet Balance Card */}
          {!loading && (
            <View style={styles.walletCard}>
              <View style={styles.walletIconContainer}>
                <Text style={styles.walletIcon}>👛</Text>
              </View>
              <View style={styles.walletInfo}>
                <Text style={styles.walletLabel}>Available Balance</Text>
                <Text style={styles.walletAmount}>Rs {walletBalance.toFixed(2)}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Low Balance Banner */}
        {showLowBalanceBanner && (
          <Animated.View style={styles.lowBalanceBanner}>
            <View style={styles.bannerIconContainer}>
              <Text style={styles.bannerIcon}>⚠️</Text>
            </View>
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>Insufficient Balance</Text>
              <Text style={styles.bannerText}>
                Please top up your wallet to continue with this payment.
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Bill Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Bill Type</Text>
          <View style={styles.billTypeGrid}>
            {Object.keys(billTypeConfig).map((type) => {
              const config = billTypeConfig[type];
              const isSelected = billType === type;
              return (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.billTypeCard,
                    isSelected && [styles.billTypeCardActive, { borderColor: config.color }],
                  ]}
                  onPress={() => setBillType(type)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.billTypeIconContainer,
                      isSelected && { backgroundColor: config.color },
                    ]}
                  >
                    <Text style={styles.billTypeIcon}>{config.icon}</Text>
                  </View>
                  <Text
                    style={[
                      styles.billTypeCardText,
                      isSelected && { color: config.color, fontWeight: '700' },
                    ]}
                  >
                    {type}
                  </Text>
                  {isSelected && (
                    <View style={[styles.selectedIndicator, { backgroundColor: config.color }]} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Form Fields - Animated appearance */}
        {billType !== '' && (
          <Animated.View style={styles.formSection}>
            {/* Consumer Number Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                <Text style={styles.labelIcon}>🔢 </Text>
                Consumer / Account Number
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  focusedInput === 'consumer' && [
                    styles.inputWrapperFocused,
                    billConfig && { borderColor: billConfig.color }
                  ],
                ]}
              >
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your account number"
                  placeholderTextColor="#94A3B8"
                  value={consumerNumber}
                  onChangeText={(text) => {
                    const cleaned = text.replace(/[^a-zA-Z0-9]/g, '');
                    setConsumerNumber(cleaned.toUpperCase());
                  }}
                  autoCapitalize="characters"
                  maxLength={13}
                  onFocus={() => setFocusedInput('consumer')}
                  onBlur={() => setFocusedInput(null)}
                />
                {consumerNumber && (
                  <View style={styles.inputCheckmark}>
                    <Text style={styles.checkmarkIcon}>✓</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Amount Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                <Text style={styles.labelIcon}>💰 </Text>
                Bill Amount
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  styles.amountInputWrapper,
                  focusedInput === 'amount' && [
                    styles.inputWrapperFocused,
                    billConfig && { borderColor: billConfig.color }
                  ],
                ]}
              >
                <View style={styles.currencyBadge}>
                  <Text style={styles.currencyText}>Rs</Text>
                </View>
                <TextInput
                  style={[styles.textInput, styles.amountTextInput]}
                  placeholder="0.00"
                  placeholderTextColor="#94A3B8"
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="decimal-pad"
                  onFocus={() => setFocusedInput('amount')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            {/* Enhanced Bill Summary Card */}
            {consumerNumber && amount && billConfig && (
              <View style={[styles.summaryCard, { backgroundColor: billConfig.lightBg }]}>
                <View style={styles.summaryHeader}>
                  <View style={[styles.summaryIconContainer, { backgroundColor: billConfig.color }]}>
                    <Text style={styles.summaryIcon}>{billConfig.emoji}</Text>
                  </View>
                  <Text style={styles.summaryTitle}>Payment Summary</Text>
                </View>

                <View style={styles.summaryContent}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Bill Type</Text>
                    <Text style={[styles.summaryValue, { color: billConfig.color }]}>
                      {billType}
                    </Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Consumer No.</Text>
                    <Text style={styles.summaryValue}>{consumerNumber}</Text>
                  </View>
                  <View style={styles.summaryDivider} />
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryTotalLabel}>Total Amount</Text>
                    <Text style={[styles.summaryTotalValue, { color: billConfig.color }]}>
                      Rs {amount}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Info Banner */}
            <View style={styles.infoBanner}>
              <Text style={styles.infoIcon}>ℹ️</Text>
              <Text style={styles.infoText}>
                Bills are processed instantly. Please verify all details before payment.
              </Text>
            </View>

            {/* Enhanced Pay Button */}
            <TouchableOpacity
              style={[
                styles.payButton,
                (!consumerNumber || !amount) && styles.payButtonDisabled,
                billConfig && consumerNumber && amount && {
                  backgroundColor: billConfig.color,
                  shadowColor: billConfig.color,
                },
              ]}
              onPress={handlePayment}
              activeOpacity={0.85}
              disabled={!consumerNumber || !amount}
            >
              <View style={styles.payButtonContent}>
                <Text style={styles.payButtonText}>
                  {consumerNumber && amount ? 'Proceed to Pay' : 'Enter Details'}
                </Text>
                <View style={styles.payButtonIcon}>
                  <Text style={styles.payButtonIconText}>→</Text>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Empty State */}
        {!billType && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>💡</Text>
            <Text style={styles.emptyStateTitle}>Select a bill type to get started</Text>
            <Text style={styles.emptyStateText}>
              Choose from electricity, gas, water, internet, or PTCL bills
            </Text>
          </View>
        )}
      </Animated.View>
    </ScrollView>
  );
}

// Enhanced Modern Styles
const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 28,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  headerIconText: {
    fontSize: 28,
  },
  heading: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subheading: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 20,
  },
  walletCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  walletIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  walletIcon: {
    fontSize: 24,
  },
  walletInfo: {
    flex: 1,
  },
  walletLabel: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 2,
    fontWeight: '500',
  },
  walletAmount: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
  },
  lowBalanceBanner: {
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  bannerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  bannerIcon: {
    fontSize: 20,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#991B1B',
    marginBottom: 4,
  },
  bannerText: {
    fontSize: 13,
    color: '#B91C1C',
    lineHeight: 18,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
    paddingLeft: 4,
  },
  billTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  billTypeCard: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#fff',
    paddingVertical: 18,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  billTypeCardActive: {
    backgroundColor: '#fff',
    borderWidth: 2.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    transform: [{ scale: 1.02 }],
  },
  billTypeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  billTypeIcon: {
    fontSize: 24,
  },
  billTypeCardText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formSection: {
    gap: 20,
  },
  inputGroup: {
    marginBottom: 4,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 10,
    paddingLeft: 4,
  },
  labelIcon: {
    fontSize: 16,
  },
  inputWrapper: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    minHeight: 58,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  inputWrapperFocused: {
    borderWidth: 2.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '500',
    padding: 0,
  },
  inputCheckmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkIcon: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  amountInputWrapper: {
    paddingLeft: 8,
  },
  currencyBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginRight: 12,
  },
  currencyText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#475569',
  },
  amountTextInput: {
    fontSize: 20,
    fontWeight: '700',
  },
  summaryCard: {
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  summaryIcon: {
    fontSize: 18,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryContent: {
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '700',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.08)',
    marginVertical: 4,
  },
  summaryTotalLabel: {
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '700',
  },
  summaryTotalValue: {
    fontSize: 22,
    fontWeight: '800',
  },
  infoBanner: {
    backgroundColor: '#FEF3C7',
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
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
    marginTop: 12,
    shadowColor: '#0A0A3E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  payButtonDisabled: {
    backgroundColor: '#CBD5E1',
    shadowOpacity: 0,
    elevation: 0,
  },
  payButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    marginRight: 8,
  },
  payButtonIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonIconText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    opacity: 0.6,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

const successStyles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#F8F9FD',
  },
  container: {
    padding: 24,
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  iconContainer: {
    marginBottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 40,
    textAlign: 'center',
  },
  detailsContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  amountSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  amountLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  amountText: {
    fontSize: 36,
    fontWeight: '800',
    color: '#0F172A',
  },
  amountUnderline: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#22C55E',
    marginTop: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 24,
  },
  detailsGrid: {
    gap: 16,
    marginBottom: 24,
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
    fontWeight: '700',
  },
  billTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 8,
  },
  billTypeIconSmall: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  billTypeEmojiSmall: {
    fontSize: 12,
  },
  consumerNumber: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECFDF5',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: 'stretch',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '700',
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
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  secondaryButtonIcon: {
    fontSize: 18,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
});