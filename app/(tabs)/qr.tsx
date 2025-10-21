import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ScanQRStart() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#0A0A3E" />
        </TouchableOpacity>
        <Text style={styles.title}>Scan QR Code</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Main Card */}
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <View style={styles.iconBackground}>
            <Image 
              source={require('@/assets/images/qr.png')} 
              style={styles.icon} 
            />
          </View>
        </View>

        <Text style={styles.heading}>Quick QR Payment</Text>
        <Text style={styles.subtext}>
          Scan any merchant QR code to make instant and secure payments
        </Text>

        {/* Features */}
        <View style={styles.features}>
          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <Ionicons name="flash" size={16} color="#4A90E2" />
            </View>
            <Text style={styles.featureText}>Instant Payment</Text>
          </View>
          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <Ionicons name="shield-checkmark" size={16} color="#50C878" />
            </View>
            <Text style={styles.featureText}>Secure Transaction</Text>
          </View>
        </View>

        {/* Scan Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/scan-qr/loading')}
        >
          <Ionicons name="scan" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Start Scanning</Text>
        </TouchableOpacity>

        {/* Help Text */}
        <TouchableOpacity style={styles.helpContainer}>
          <Ionicons name="help-circle-outline" size={16} color="#888" />
          <Text style={styles.helpText}>How to scan QR code?</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Info */}
      <View style={styles.bottomInfo}>
        <Ionicons name="information-circle-outline" size={18} color="#666" />
        <Text style={styles.infoText}>
          Make sure the QR code is clear and well-lit
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { 
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E8F4FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  icon: { 
    height: 64, 
    width: 64,
  },
  heading: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#0A0A3E',
    marginBottom: 12,
  },
  subtext: { 
    fontSize: 14, 
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  features: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 24,
    marginBottom: 28,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  featureIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: 13,
    color: '#0A0A3E',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#0A0A3E',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    justifyContent: 'center',
    shadowColor: '#0A0A3E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonIcon: {
    marginRight: 4,
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: 'bold',
    fontSize: 16,
  },
  helpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 20,
  },
  helpText: {
    fontSize: 13,
    color: '#888',
    textDecorationLine: 'underline',
  },
  bottomInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 30,
    paddingHorizontal: 40,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },
});