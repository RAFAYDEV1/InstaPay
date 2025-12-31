import { useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ApiService from '../../services/api.service';
import SessionService from '../../services/session.service';

export default function FinanceScreen() {
  const [wallet, setWallet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadWallet = async () => {
    try {
      const token = await SessionService.getAccessToken();
      if (!token) {
        setWallet(null);
        return;
      }
      const res = await ApiService.getWalletBalance(token as string);
      if (res.success && res.data?.wallet) {
        setWallet(res.data.wallet);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadWallet();
  };

  useEffect(() => {
    loadWallet();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4A90E2']} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Finance</Text>
        <Text style={styles.headerSubtitle}>Manage your wallet</Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Instapay Wallet</Text>
        <TouchableOpacity
          onPress={loadWallet}
          style={styles.refreshButton}
          disabled={loading}
        >
          <Text style={styles.refreshText}>↻ Refresh</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>Loading wallet...</Text>
        </View>
      ) : wallet ? (
        <View style={styles.walletCard}>
          <View style={styles.walletHeader}>
            <View style={styles.walletIcon}>
              <Text style={styles.walletIconText}>💳</Text>
            </View>
            <View style={styles.statusBadge}>
              <View style={[styles.statusDot, wallet.status === 'Active' && styles.statusDotActive]} />
              <Text style={styles.statusText}>{wallet.status || 'Active'}</Text>
            </View>
          </View>

          <Text style={styles.walletLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>
            {wallet.currency} {formatCurrency(Number(wallet.balance || 0))}
          </Text>

          <View style={styles.divider} />

          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Wallet Type</Text>
              <Text style={styles.detailValue}>{wallet.wallet_type || 'Personal'}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Opened</Text>
              <Text style={styles.detailValue}>
                {wallet.created_at ? new Date(wallet.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                }) : '—'}
              </Text>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Send Money</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Add Funds</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>💼</Text>
          <Text style={styles.emptyTitle}>No Wallet Found</Text>
          <Text style={styles.emptyText}>
            No Instapay wallet found for this account. Please create one to get started.
          </Text>
          <TouchableOpacity style={styles.createButton}>
            <Text style={styles.createButtonText}>Create Wallet</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FC'
  },
  header: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 16
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0A0A3E',
    letterSpacing: -0.5
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0A0A3E'
  },
  refreshButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#EEF5FF'
  },
  refreshText: {
    color: '#4A90E2',
    fontWeight: '600',
    fontSize: 14
  },
  loadingCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  loadingText: {
    marginTop: 12,
    color: '#6B7280',
    fontSize: 14
  },
  walletCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 20
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  walletIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EEF5FF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  walletIconText: {
    fontSize: 24
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#ECFDF5'
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#9CA3AF',
    marginRight: 6
  },
  statusDotActive: {
    backgroundColor: '#10B981'
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669'
  },
  walletLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
    fontWeight: '500'
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: '#0A0A3E',
    letterSpacing: -1
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 20
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  detailItem: {
    flex: 1
  },
  detailLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    fontWeight: '500'
  },
  detailValue: {
    fontSize: 15,
    color: '#0A0A3E',
    fontWeight: '600'
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#4A90E2',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center'
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  secondaryButtonText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 15
  },
  emptyCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0A0A3E',
    marginBottom: 8
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24
  },
  createButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15
  }
});