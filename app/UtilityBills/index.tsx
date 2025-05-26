import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function UtilityBillsScreen() {
  const [billType, setBillType] = useState('');
  const [consumerNumber, setConsumerNumber] = useState('');
  const [amount, setAmount] = useState('');

  const handlePayment = () => {
    if (!billType || !consumerNumber || !amount) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    Alert.alert('Success', `Rs ${amount} paid for ${billType} bill.`);
    setBillType('');
    setConsumerNumber('');
    setAmount('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Pay Utility Bills</Text>

      <Text style={styles.label}>Select Bill Type</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={billType}
          onValueChange={(itemValue) => setBillType(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select bill type..." value="" />
          <Picker.Item label="Electricity (KE, LESCO, IESCO)" value="Electricity" />
          <Picker.Item label="Gas (SSGC, SNGPL)" value="Gas" />
          <Picker.Item label="Water (KWSB)" value="Water" />
          <Picker.Item label="Internet (StormFiber, Nayatel)" value="Internet" />
          <Picker.Item label="PTCL Landline" value="PTCL" />
        </Picker>
      </View>

      {billType !== '' && (
        <>
          <Text style={styles.label}>Consumer/Account Number</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 123456789"
            placeholderTextColor="#aaa"
            value={consumerNumber}
            onChangeText={setConsumerNumber}
            keyboardType="number-pad"
          />

          <Text style={styles.label}>Amount (Rs)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            placeholderTextColor="#aaa"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />

          <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
            <Text style={styles.payButtonText}>Pay Bill</Text>
          </TouchableOpacity>
        </>
      )}
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
