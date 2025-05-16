import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function FinanceScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Finance</Text>

      <Text style={styles.label}>Connected Account</Text>

      <TouchableOpacity style={styles.card} onPress={() => router.push('/payment')}>
        <Image source={require('@/assets/images/ubl.png')} style={styles.bankLogo} />
        <Text style={styles.bankText}>UBL Digital</Text>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', color: '#0A0A3E', marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', color: '#0A0A3E', marginVertical: 10 },
  card: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    marginBottom: 20,
  },
  bankLogo: { width: 40, height: 40, resizeMode: 'contain', marginRight: 16 },
  bankText: { flex: 1, fontSize: 16, fontWeight: '600', color: '#0A0A3E' },
  arrow: { fontSize: 24, color: '#888' },
});
