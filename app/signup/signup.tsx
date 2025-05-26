// File: app/(signup)/signup.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SignUp() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push('/signup/credit')}
      >
        <Image
          source={require('@/assets/images/creditCard.png')}
          style={styles.icon}
        />
        <Text style={styles.cardText}>Sign Up Via Credit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  backBtn: { marginBottom: 10 },
  backArrow: { fontSize: 22, color: '#001F54' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#001F54' },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
  },
  icon: { width: 40, height: 40, marginRight: 20 },
  cardText: { fontSize: 16, color: '#001F54', fontWeight: '500' },
});