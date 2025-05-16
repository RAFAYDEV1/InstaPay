import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ScanQRStart() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan QR</Text>

      <View style={styles.card}>
        <Image source={require('@/assets/images/qr.png')} style={styles.icon} />
        <Text style={styles.heading}>Scan QR</Text>
        <Text style={styles.subtext}>Scan the QR to process payment</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/scan-qr/loading')}
        >
          <Text style={styles.buttonText}>Scan Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1E1E50', marginTop: 50 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginTop: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  icon: { height: 64, width: 64, marginBottom: 20 },
  heading: { fontSize: 18, fontWeight: '600', color: '#1E1E50' },
  subtext: { fontSize: 12, color: '#888', marginVertical: 10 },
  button: {
    backgroundColor: '#0A0A3E',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 20,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
