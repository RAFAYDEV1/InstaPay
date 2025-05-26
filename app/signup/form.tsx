import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function CreditForm() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up Via Credit</Text>
      <Text style={styles.subtitle}>headlin starts with (24px)</Text>

      <View style={styles.card}>
        <View style={styles.cardTop} />
        <View style={styles.row}>
          <TextInput style={styles.input} placeholder="last 4 digit" placeholderTextColor="#999" />
          <TextInput style={styles.input} placeholder="Expiry" placeholderTextColor="#999" />
        </View>
        <View style={styles.disabledField} />
      </View>

      <TouchableOpacity style={styles.proceedBtn}>
        <Text style={styles.proceedText}>Proceed</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  backArrow: { fontSize: 22, color: '#001F54' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#001F54', marginTop: 10 },
  subtitle: { fontSize: 12, color: '#6B7280', marginBottom: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTop: {
    height: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: '#E2AEB1',
    marginBottom: 10,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  input: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  disabledField: {
    marginTop: 20,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F4F4F4',
  },
  proceedBtn: {
    marginTop: 50,
    alignItems: 'center',
    backgroundColor: '#EAF2FF',
    paddingVertical: 16,
    borderRadius: 14,
  },
  proceedText: { fontSize: 16, color: '#001F54' },
});
