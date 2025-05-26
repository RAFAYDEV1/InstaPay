import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SignUpCredit() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
          <Image
            source={require('@/assets/images/creditCard.png')}
            style={styles.cardImage}
          />
      </View>
      <Text style={styles.title}>Sign Up Via Credit</Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => router.push('/signup/form')}
      >
        <Text style={styles.btnText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', backgroundColor: '#fff', padding: 20 },
  backBtn: { alignSelf: 'flex-start', marginBottom: 20 },
  imageWrapper: { marginTop: 20, marginBottom: 40 },
  cardImage: { width: 100, height: 100, resizeMode: 'contain' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#001F54' },
  subtitle: { fontSize: 14, color: '#6B7280', marginVertical: 10 },
  btn: {
    backgroundColor: '#EAF2FF',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 14,
    marginTop: 40,
  },
  btnText: { color: '#001F54', fontWeight: '500', fontSize: 16 },
});
