import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AddAccountScreen() {
  const [accountNumber, setAccountNumber] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Account Number</Text>

      <View style={styles.inputBox}>
        <Text style={styles.accountText}>
          {accountNumber.padEnd(16, 'X')}
        </Text>
      </View>


      <View style={styles.keypad}>
        {['1','2','3','4','5','6','7','8','9','0'].map((num, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.key}
            onPress={() => setAccountNumber((prev) => (prev.length < 16 ? prev + num : prev))}
          >
            <Text style={styles.keyText}>{num}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.deleteKey} onPress={() => setAccountNumber(accountNumber.slice(0, -1))}>
          <Text style={styles.keyText}>⌫</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Add Account →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: { fontSize: 22, fontWeight: 'bold', color: '#0A0A3E', marginBottom: 20 },
  inputBox: {
    height: 100,
    backgroundColor: '#eee',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  accountText: { fontSize: 20, fontWeight: 'bold', color: '#0A0A3E' },
  helperText: { color: '#0A0A3E', fontWeight: '600', textAlign: 'right', marginBottom: 20 },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 30,
  },
  key: {
    width: '30%',
    margin: '1.5%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
    borderRadius: 12,
  },
  deleteKey: {
    width: '94%',
    marginTop: 10,
    padding: 14,
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 12,
  },
  keyText: { fontSize: 20, color: '#555' },
  button: {
    backgroundColor: '#eee',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: { color: '#0A0A3E', fontWeight: '600' },
});
