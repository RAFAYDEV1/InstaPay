import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import ApiService from '../../services/api.service';
import SessionService from '../../services/session.service';

export default function AmountInputScreen() {
    const router = useRouter();
    const { qrData } = useLocalSearchParams<{ qrData: string }>();
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [focusedInput, setFocusedInput] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Parse QR data to extract recipient info
    // Assuming QR data format: phone number or JSON with recipient details
    const parseQRData = (data: string) => {
        try {
            // Try to parse as JSON first
            const parsed = JSON.parse(data);
            return {
                phone: parsed.phone || parsed.phoneNumber || data,
                name: parsed.name || 'Merchant',
            };
        } catch {
            // If not JSON, treat as phone number
            return {
                phone: data,
                name: 'Merchant',
            };
        }
    };

    const recipientInfo = parseQRData(qrData || '');

    const handlePayment = async () => {
        if (!amount) {
            Alert.alert('Error', 'Please enter an amount.');
            return;
        }

        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            Alert.alert('Error', 'Please enter a valid amount.');
            return;
        }

        // Convert local 03XXXXXXXXX to E.164 +92 for the API
        const apiRecipient =
            recipientInfo.phone.startsWith('0') && recipientInfo.phone.length === 11
                ? `+92${recipientInfo.phone.slice(1)}`
                : recipientInfo.phone;

        setSubmitting(true);
        try {
            const token = await SessionService.getAccessToken();
            if (!token) {
                Alert.alert('Error', 'You must be logged in to make a payment.');
                setSubmitting(false);
                return;
            }

            const response = await ApiService.sendMoney(token, {
                receiverPhone: apiRecipient,
                amount: numAmount,
                description: note || 'QR Payment',
            });

            if (!response.success) {
                Alert.alert('Payment Failed', response.error || 'Could not process payment.');
                setSubmitting(false);
                return;
            }

            // Navigate to success screen with transaction details
            router.replace({
                pathname: '/scan-qr/success',
                params: {
                    amount: amount,
                    recipient: recipientInfo.phone,
                    recipientName: recipientInfo.name,
                    transactionId: response.data?.transactionId || 'N/A',
                },
            });
        } catch (error: any) {
            const message = error?.message || 'Could not process payment.';
            Alert.alert('Payment Failed', message);
            setSubmitting(false);
        }
    };

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#0A0A3E" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Enter Amount</Text>
                    <View style={styles.placeholder} />
                </View>

                {/* Recipient Info Card */}
                <View style={styles.recipientCard}>
                    <View style={styles.recipientIcon}>
                        <Ionicons name="person" size={32} color="#4A90E2" />
                    </View>
                    <Text style={styles.recipientLabel}>Paying to</Text>
                    <Text style={styles.recipientName}>{recipientInfo.name}</Text>
                    <Text style={styles.recipientPhone}>{recipientInfo.phone}</Text>
                </View>

                {/* Amount Input Card */}
                <View style={styles.formCard}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            <Text style={styles.labelIcon}>💰 </Text>
                            Amount
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
                                autoFocus
                            />
                        </View>
                    </View>

                    {/* Quick Amount Buttons */}
                    <View style={styles.quickAmountContainer}>
                        {['500', '1000', '2000', '5000'].map((quickAmount) => (
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
                                focusedInput === 'note' && styles.inputContainerFocused,
                            ]}
                        >
                            <TextInput
                                style={[styles.input, styles.noteInput]}
                                placeholder="Add a note for this payment"
                                placeholderTextColor="#999"
                                value={note}
                                onChangeText={setNote}
                                multiline
                                numberOfLines={3}
                                onFocus={() => setFocusedInput('note')}
                                onBlur={() => setFocusedInput(null)}
                            />
                        </View>
                    </View>
                </View>

                {/* Info Card */}
                <View style={styles.infoCard}>
                    <Text style={styles.infoIcon}>ℹ️</Text>
                    <Text style={styles.infoText}>
                        Payment will be processed instantly. Please verify the amount before
                        confirming.
                    </Text>
                </View>

                {/* Pay Button */}
                <TouchableOpacity
                    style={[styles.payButton, submitting && styles.payButtonDisabled]}
                    onPress={handlePayment}
                    activeOpacity={0.9}
                    disabled={submitting}
                >
                    <Text style={styles.payButtonText}>
                        {submitting ? 'Processing...' : 'Pay Now'}
                    </Text>
                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F8F9FA',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0A0A3E',
        flex: 1,
        textAlign: 'center',
        marginRight: 40,
    },
    placeholder: {
        width: 40,
    },
    recipientCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        marginBottom: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    recipientIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#EEF5FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    recipientLabel: {
        fontSize: 13,
        color: '#64748B',
        marginBottom: 8,
    },
    recipientName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0A0A3E',
        marginBottom: 4,
    },
    recipientPhone: {
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
    amountInput: {
        fontSize: 24,
        fontWeight: '600',
    },
    currencyPrefix: {
        fontSize: 20,
        fontWeight: '600',
        color: '#64748B',
        marginRight: 8,
    },
    quickAmountContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        gap: 8,
    },
    quickAmountButton: {
        flex: 1,
        backgroundColor: '#F1F5F9',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    quickAmountText: {
        color: '#475569',
        fontSize: 13,
        fontWeight: '600',
    },
    noteInputContainer: {
        minHeight: 90,
        alignItems: 'flex-start',
        paddingVertical: 12,
    },
    noteInput: {
        textAlignVertical: 'top',
        minHeight: 70,
    },
    infoCard: {
        backgroundColor: '#EFF6FF',
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#DBEAFE',
    },
    infoIcon: {
        fontSize: 18,
        marginRight: 10,
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        color: '#1E40AF',
        lineHeight: 18,
    },
    payButton: {
        backgroundColor: '#0A0A3E',
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        shadowColor: '#0A0A3E',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    payButtonDisabled: {
        opacity: 0.6,
    },
    payButtonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '700',
    },
});
