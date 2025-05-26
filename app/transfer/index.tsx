import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function TransferScreen() {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const handleTransfer = () => {
    if (!recipient || !amount) {
      Alert.alert('Error', 'Please enter recipient and amount.');
      return;
    }
    // Here you would normally call an API or navigate to confirmation
    Alert.alert('Success', `Rs ${amount} sent to ${recipient}`);
    setRecipient('');
    setAmount('');
    setNote('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Send Money</Text>

      <Text style={styles.label}>Recipient Account/Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter recipient account"
        placeholderTextColor="#aaa"
        value={recipient}
        onChangeText={setRecipient}
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

      <Text style={styles.label}>Note (Optional)</Text>
      <TextInput
        style={[styles.input, styles.noteInput]}
        placeholder="Add a note"
        placeholderTextColor="#aaa"
        value={note}
        onChangeText={setNote}
      />

      <TouchableOpacity style={styles.sendButton} onPress={handleTransfer}>
        <Text style={styles.sendButtonText}>Send Money</Text>
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
  noteInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: '#0A0A3E',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 30,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
