import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SuccessScreen() {
    const router = useRouter();
  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/success.png')} // Use your success checkmark image here
        style={styles.image}
      />
      <Text style={styles.title}>Congratulations</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/home')}>
        <Text style={styles.buttonText}>Payment Successful</Text>
      </TouchableOpacity>
    </View>+
    
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  image: { height: 200, width: 200, resizeMode: 'contain', marginBottom: 30 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1E1E50' },
  button: {
    backgroundColor: '#E6F0FF',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 15,
    marginTop: 20,
  },
  buttonText: { color: '#1E1E50', fontWeight: '600' },
});
