import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ApiService from '../../services/api.service';
import SessionService from '../../services/session.service';

export default function FinanceScreen() {
  const [wallet, setWallet] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadWallet = async () => {
    setLoading(true);
    try {
      const token = await SessionService.getAccessToken();
      if (!token) {
        setWallet(null);
        return;
      }
      const res = await ApiService.getWalletBalance(token);
      if (res.success && res.data?.wallet) {
        setWallet(res.data.wallet);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWallet();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Finance</Text>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={styles.label}>Primary Wallet</Text>
        <TouchableOpacity onPress={loadWallet}>
          <Text style={{ color: '#4A90E2', fontWeight: '600' }}>Refresh</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        {loading ? (
          <ActivityIndicator />
        ) : wallet ? (
          <>
            <Text style={styles.bankText}>InstaPay Wallet</Text>
            <Text style={{ color: '#0A0A3E', fontWeight: '700', fontSize: 18, marginTop: 8 }}>
              {wallet.currency} {Number(wallet.balance || 0).toLocaleString()}
            </Text>
            <Text style={{ color: '#666', marginTop: 4 }}>
              Status: {wallet.status || 'Active'} • Type: {wallet.wallet_type || 'Personal'}
            </Text>
            <Text style={{ color: '#666', marginTop: 4 }}>
              Opened: {wallet.created_at ? new Date(wallet.created_at).toLocaleDateString() : '—'}
            </Text>
          </>
        ) : (
          <Text style={{ color: '#999' }}>No wallet found for this account.</Text>
        )}
      </View>
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
  bankText: { flex: 1, fontSize: 16, fontWeight: '600', color: '#0A0A3E' },
});
