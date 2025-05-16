import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function PaymentScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Payment</Text>
      <Text style={styles.subheader}>Connect with Bank Account</Text>
      <TextInput placeholder="Search Bank" style={styles.searchInput} />

      <Text style={styles.allBanks}>All Banks</Text>

      <TouchableOpacity style={[styles.bankCard, styles.greenBorder]} onPress={() => router.push('/add-account')}>
        <Image source={require('@/assets/images/easypaisa.png')} style={styles.bankIcon} />
        <Text style={styles.bankLabel}>Easypaisa</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.bankCard, styles.yellowBorder]} onPress={() => router.push('/add-account')}>
        <Image source={require('@/assets/images/jazzcash.png')} style={styles.bankIcon} />
        <Text style={styles.bankLabel}>JazzCash</Text>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.bankCard, styles.greenBorder]} onPress={() => router.push('/add-account')}>
        <Image source={require('@/assets/images/hbl.png')} style={styles.bankIcon} />
        <Text style={styles.bankLabel}>HBL Limited</Text>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#0A0A3E', marginBottom: 10 },
  subheader: { fontSize: 14, color: '#444', marginBottom: 10 },
  searchInput: {
    backgroundColor: '#eee',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 20,
  },
  allBanks: { fontWeight: '600', color: '#0A0A3E', fontSize: 16, marginBottom: 10 },
  bankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  greenBorder: { borderColor: '#4CAF50' },
  yellowBorder: { borderColor: '#FFB300' },
  bankIcon: { width: 32, height: 32, resizeMode: 'contain', marginRight: 16 },
  bankLabel: { flex: 1, fontSize: 16, fontWeight: '600', color: '#0A0A3E' },
  arrow: { fontSize: 24, color: '#999' },
});
