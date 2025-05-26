import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    Clipboard,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function InviteFriendsScreen() {
  const [referralCode] = useState('INSTA2025XYZ'); // Mock referral code
  const [totalInvites] = useState(12);
  const [successfulInvites] = useState(8);
  const [pendingInvites] = useState(4);
  const [totalEarnings] = useState('2,400');

  const copyReferralCode = () => {
    Clipboard.setString(referralCode);
    Alert.alert('Copied!', 'Referral code copied to clipboard');
  };

  const shareReferralCode = async () => {
    try {
      const message = `Hey! Join me on InstaPay - Pakistan's fastest digital wallet! 💰\n\nUse my referral code: ${referralCode}\n\nYou'll get Rs 200 bonus on signup and I'll get Rs 300! 🎉\n\nDownload: https://instapay.pk/download`;
      
      await Share.share({
        message: message,
        title: 'Join InstaPay with my referral code!'
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to share at the moment');
    }
  };

  const shareViaWhatsApp = () => {
    // Mock WhatsApp sharing functionality
    Alert.alert('WhatsApp', 'Opening WhatsApp to share your referral code...');
  };

  const shareViaSMS = () => {
    // Mock SMS sharing functionality
    Alert.alert('SMS', 'Opening SMS to share your referral code...');
  };

  const shareViaEmail = () => {
    // Mock Email sharing functionality
    Alert.alert('Email', 'Opening Email to share your referral code...');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <FontAwesome5 name="user-friends" size={24} color="#1E1E50" />
        <Text style={styles.headerTitle}>Invite Friends</Text>
      </View>

      {/* Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.heroIcon}>
          <FontAwesome5 name="gift" size={32} color="#FF6B35" />
        </View>
        <Text style={styles.heroTitle}>Earn Rs 300 for every friend!</Text>
        <Text style={styles.heroSubtitle}>
          Your friends get Rs 200 bonus when they sign up with your code
        </Text>
      </View>

      {/* Referral Code Card */}
      <View style={styles.referralCard}>
        <Text style={styles.cardTitle}>Your Referral Code</Text>
        <View style={styles.codeContainer}>
          <Text style={styles.referralCodeText}>{referralCode}</Text>
          <TouchableOpacity onPress={copyReferralCode} style={styles.copyButton}>
            <MaterialIcons name="content-copy" size={20} color="#1E1E50" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={shareReferralCode} style={styles.shareButton}>
          <FontAwesome5 name="share-alt" size={16} color="#fff" />
          <Text style={styles.shareButtonText}>Share Code</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Card */}
      <View style={styles.statsCard}>
        <Text style={styles.cardTitle}>Your Referral Stats</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalInvites}</Text>
            <Text style={styles.statLabel}>Total Invites</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{successfulInvites}</Text>
            <Text style={styles.statLabel}>Successful</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{pendingInvites}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>
        <View style={styles.earningsSection}>
          <Text style={styles.earningsLabel}>Total Earnings</Text>
          <Text style={styles.earningsAmount}>Rs {totalEarnings}</Text>
        </View>
      </View>

      {/* How it Works */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How it Works</Text>
        
        <View style={styles.stepItem}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>1</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Share your code</Text>
            <Text style={styles.stepDescription}>
              Send your referral code to friends via WhatsApp, SMS, or social media
            </Text>
          </View>
        </View>

        <View style={styles.stepItem}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>2</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Friend signs up</Text>
            <Text style={styles.stepDescription}>
              Your friend downloads InstaPay and enters your referral code during signup
            </Text>
          </View>
        </View>

        <View style={styles.stepItem}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>3</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Both earn rewards</Text>
            <Text style={styles.stepDescription}>
              You get Rs 300 and your friend gets Rs 200 bonus instantly!
            </Text>
          </View>
        </View>
      </View>

      {/* Sharing Options */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Share via</Text>
        
        <View style={styles.sharingGrid}>
          <TouchableOpacity style={styles.sharingOption} onPress={shareViaWhatsApp}>
            <FontAwesome5 name="whatsapp" size={24} color="#25D366" />
            <Text style={styles.sharingText}>WhatsApp</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sharingOption} onPress={shareViaSMS}>
            <MaterialIcons name="sms" size={24} color="#1E1E50" />
            <Text style={styles.sharingText}>SMS</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sharingOption} onPress={shareViaEmail}>
            <MaterialIcons name="email" size={24} color="#EA4335" />
            <Text style={styles.sharingText}>Email</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sharingOption} onPress={shareReferralCode}>
            <FontAwesome5 name="share-alt" size={24} color="#1877F2" />
            <Text style={styles.sharingText}>More</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Terms */}
      <View style={styles.termsSection}>
        <MaterialIcons name="info-outline" size={20} color="#666" />
        <View style={styles.termsContent}>
          <Text style={styles.termsTitle}>Terms & Conditions</Text>
          <Text style={styles.termsText}>
            • Referral bonus is credited within 24 hours of successful signup{'\n'}
            • Your friend must complete KYC verification{'\n'}
            • Maximum 50 referrals per month{'\n'}
            • InstaPay reserves the right to modify rewards
          </Text>
        </View>
      </View>

      {/* Contact Support */}
      <TouchableOpacity style={styles.supportButton}>
        <MaterialIcons name="support-agent" size={20} color="#1E1E50" />
        <Text style={styles.supportText}>Need Help? Contact Support</Text>
        <MaterialIcons name="chevron-right" size={20} color="#666" />
      </TouchableOpacity>
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
  heroSection: {
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 30,
    margin: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E1E50',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  referralCard: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E1E50',
    marginBottom: 16,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  referralCodeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E1E50',
    flex: 1,
    fontFamily: 'monospace',
  },
  copyButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#e9ecef',
  },
  shareButton: {
    backgroundColor: '#1E1E50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  statsCard: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E1E50',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e9ecef',
  },
  earningsSection: {
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingTop: 16,
    alignItems: 'center',
  },
  earningsLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  earningsAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#28a745',
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
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E1E50',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E1E50',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  sharingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sharingOption: {
    width: '22%',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    marginBottom: 12,
  },
  sharingText: {
    fontSize: 10,
    color: '#1E1E50',
    marginTop: 8,
    fontWeight: '500',
  },
  termsSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  termsContent: {
    marginLeft: 12,
    flex: 1,
  },
  termsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E1E50',
    marginBottom: 8,
  },
  termsText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  supportText: {
    fontSize: 16,
    color: '#1E1E50',
    marginLeft: 12,
    flex: 1,
    fontWeight: '500',
  },
});