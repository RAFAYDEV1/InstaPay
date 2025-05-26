import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface AccountData {
  accountTitle: string;
  accountNumber: string;
  iban: string;
  bankName: string;
  accountType: string;
  balance: string;
  currency: string;
  status: string;
  openingDate: string;
}

export default function AccountDetailsScreen() {
  const [showBalance, setShowBalance] = useState(false);

  const accountData: AccountData = {
    accountTitle: "Abdur Rafay Ali",
    accountNumber: "1234567890123456",
    iban: "PK36INSTA1234567890123456",
    bankName: "InstaPay Bank",
    accountType: "Current Account",
    balance: "13,250",
    currency: "PKR",
    status: "Active",
    openingDate: "May 15, 2025"
  };

  const copyToClipboard = async (text: string, label: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert('Copied!', `${label} copied to clipboard`);
  };

  const toggleBalance = () => {
    setShowBalance(!showBalance);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <FontAwesome5 name="university" size={24} color="#1E1E50" />
        <Text style={styles.headerTitle}>Account Details</Text>
      </View>

      {/* Account Card */}
      <View style={styles.accountCard}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.accountTitle}>{accountData.accountTitle}</Text>
            <Text style={styles.bankName}>{accountData.bankName}</Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{accountData.status}</Text>
          </View>
        </View>

        <View style={styles.balanceSection}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceAmount}>
              {showBalance ? `${accountData.currency} ${accountData.balance}` : '••••••••'}
            </Text>
            <TouchableOpacity onPress={toggleBalance} style={styles.eyeButton}>
              <Ionicons 
                name={showBalance ? "eye-off" : "eye"} 
                size={20} 
                color="#666" 
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Account Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        
        <View style={styles.infoItem}>
          <View style={styles.infoLeft}>
            <MaterialIcons name="account-balance" size={20} color="#666" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Account Number</Text>
              <Text style={styles.infoValue}>{accountData.accountNumber}</Text>
            </View>
          </View>
          <TouchableOpacity 
            onPress={() => copyToClipboard(accountData.accountNumber, 'Account Number')}
            style={styles.copyButton}
          >
            <MaterialIcons name="content-copy" size={18} color="#1E1E50" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoItem}>
          <View style={styles.infoLeft}>
            <MaterialIcons name="account-balance-wallet" size={20} color="#666" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>IBAN</Text>
              <Text style={styles.infoValue}>{accountData.iban}</Text>
            </View>
          </View>
          <TouchableOpacity 
            onPress={() => copyToClipboard(accountData.iban, 'IBAN')}
            style={styles.copyButton}
          >
            <MaterialIcons name="content-copy" size={18} color="#1E1E50" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoItem}>
          <View style={styles.infoLeft}>
            <MaterialIcons name="category" size={20} color="#666" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Account Type</Text>
              <Text style={styles.infoValue}>{accountData.accountType}</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoItem}>
          <View style={styles.infoLeft}>
            <MaterialIcons name="date-range" size={20} color="#666" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Opening Date</Text>
              <Text style={styles.infoValue}>{accountData.openingDate}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="account-balance" size={24} color="#1E1E50" />
            <Text style={styles.actionText}>Statements</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="receipt-long" size={24} color="#1E1E50" />
            <Text style={styles.actionText}>Certificates</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="support-agent" size={24} color="#1E1E50" />
            <Text style={styles.actionText}>Support</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="share" size={24} color="#1E1E50" />
            <Text style={styles.actionText}>Share Details</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Security Notice */}
      <View style={styles.securityNotice}>
        <MaterialIcons name="security" size={20} color="#FF6B35" />
        <Text style={styles.securityText}>
          Keep your account details secure. Never share your account information with unknown parties.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E1E50',
    marginLeft: 12,
  },
  accountCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  accountTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E1E50',
    marginBottom: 4,
  },
  bankName: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    backgroundColor: '#d4edda',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#155724',
    fontWeight: '600',
  },
  balanceSection: {
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingTop: 16,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E1E50',
  },
  eyeButton: {
    padding: 8,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E1E50',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#1E1E50',
    fontWeight: '500',
  },
  copyButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#f8f9fa',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionText: {
    fontSize: 12,
    color: '#1E1E50',
    marginTop: 8,
    fontWeight: '500',
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
  },
  securityText: {
    fontSize: 14,
    color: '#856404',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
});