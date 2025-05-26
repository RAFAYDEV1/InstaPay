import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function TopUpScreen() {
  const [operator, setOperator] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [amount, setAmount] = useState('');

  const handleTopUp = () => {
    if (!operator || !mobileNumber || !amount) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    Alert.alert('Success', `Rs ${amount} top-up to ${mobileNumber} via ${operator}.`);
    setOperator('');
    setMobileNumber('');
    setAmount('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Mobile Top-Up</Text>

      <Text style={styles.label}>Select Operator</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={operator}
          onValueChange={(value) => setOperator(value)}
          style={styles.picker}
        >
          <Picker.Item label="Choose operator..." value="" />
          <Picker.Item label="Jazz" value="Jazz" />
          <Picker.Item label="Zong" value="Zong" />
          <Picker.Item label="Telenor" value="Telenor" />
          <Picker.Item label="Ufone" value="Ufone" />
        </Picker>
      </View>

      <Text style={styles.label}>Mobile Number</Text>
      <TextInput
        style={styles.input}
        placeholder="03XX-XXXXXXX"
        placeholderTextColor="#aaa"
        keyboardType="phone-pad"
        value={mobileNumber}
        onChangeText={setMobileNumber}
        maxLength={11}
      />

      <Text style={styles.label}>Amount (Rs)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter amount"
        placeholderTextColor="#aaa"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <TouchableOpacity style={styles.payButton} onPress={handleTopUp}>
        <Text style={styles.payButtonText}>Top Up Now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    flex: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0A0A3E',
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    color: '#555',
    fontSize: 14,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#F0F0F0',
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    color: '#000',
  },
  pickerWrapper: {
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  picker: {
    color: '#000',
  },
  payButton: {
    backgroundColor: '#0A0A3E',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 30,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
