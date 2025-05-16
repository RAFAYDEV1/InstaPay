// app/login.tsx
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Image source={require('../assets/images/logo.png')} style={styles.logo} />
      </View>

      <TouchableOpacity
        style={styles.arrowButton}
        onPress={() => router.replace('/(tabs)/home')} // navigates to main tab layout
      >
        <AntDesign name="arrowup" size={20} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.text}>Tap to Login</Text>

      <View style={styles.footer}>
        <Text style={styles.footerText}>More</Text>
        <Text style={styles.footerText}>Sign Up</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 60,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  top: {
    alignItems: 'center',
    marginTop: 80,
  },
  logo: {
    height: 300,
    resizeMode: 'contain',
  },
  arrowButton: {
    backgroundColor: '#0A0A3E',
    padding: 18,
    borderRadius: 50,
    elevation: 5,
  },
  text: {
    fontSize: 16,
    marginTop: 10,
    color: '#0A0A3E',
  },
  footer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  footerText: {
    fontSize: 16,
    color: '#0A0A3E',
  },
});
