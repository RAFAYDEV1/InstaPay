import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const BANK_OPTIONS = [
  { name: 'UBL Digital', logo: require('@/assets/images/ubl.png') },
  { name: 'HBL Konnect', logo: require('@/assets/images/hbl.png') },
  { name: 'EasyPaisa', logo: require('@/assets/images/easypaisa.png') },
  { name: 'JazzCash', logo: require('@/assets/images/jazzcash.png') },
];

export default function FinanceScreen() {
  const router = useRouter();
  const [linkedAccount, setLinkedAccount] = useState<{ name: string; logo: any } | null>(BANK_OPTIONS[0]);

  const handleUnlink = () => {
    Alert.alert(
      'Unlink Account',
      'Are you sure you want to unlink your connected bank account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unlink',
          style: 'destructive',
          onPress: () => setLinkedAccount(null),
        },
      ]
    );
  };

  const handleLink = async (bank: { name: string; logo: any }) => {
    if (linkedAccount) {
      Alert.alert('Cannot Link', 'Please unlink the existing account before linking a new one.');
      return;
    }

    setLinkedAccount(bank);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Finance</Text>

      <Text style={styles.label}>Connected Account</Text>
      {linkedAccount ? (
        <TouchableOpacity style={styles.card}>
          <Image source={linkedAccount.logo} style={styles.bankLogo} />
          <Text style={styles.bankText}>{linkedAccount.name}</Text>
        </TouchableOpacity>
      ) : (
        <Text style={{ color: '#999', fontSize: 14 }}>No account linked.</Text>
      )}

      {linkedAccount && (
        <TouchableOpacity style={styles.unlinkButton} onPress={handleUnlink}>
          <Text style={styles.unlinkText}>Unlink Account</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.label}>Link a New Account</Text>
      {!linkedAccount ? (
        <View style={styles.bankGrid}>
          {BANK_OPTIONS.map((bank, index) => (
            <TouchableOpacity
              key={index}
              style={styles.bankOption}
              onPress={() => handleLink(bank)}
            >
              <Image source={bank.logo} style={styles.optionLogo} />
              <Text style={styles.optionName}>{bank.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <Text style={{ color: '#888' }}>Please unlink the current account to link a new one.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', color: '#0A0A3E', marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', color: '#0A0A3E', marginVertical: 10 },
  card: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    marginBottom: 10,
  },
  bankLogo: { width: 40, height: 40, resizeMode: 'contain', marginRight: 16 },
  bankText: { flex: 1, fontSize: 16, fontWeight: '600', color: '#0A0A3E' },
  arrow: { fontSize: 24, color: '#888' },
  unlinkButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8d7da',
    borderRadius: 8,
    marginBottom: 10,
  },
  unlinkText: {
    color: '#721c24',
    fontSize: 14,
    fontWeight: '500',
  },
  bankGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  bankOption: {
    width: '47%',
    backgroundColor: '#f7f7f7',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
  },
  optionLogo: {
    width: 40,
    height: 40,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  optionName: {
    fontSize: 14,
    color: '#0A0A3E',
    textAlign: 'center',
  },
});
