import { ArrowDownLeft, ArrowUpRight, Phone, User, Wifi, Zap } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ApiService from '../../services/api.service';
import SessionService from '../../services/session.service';

type HistoryItem = {
  id: string | number;
  amount: number;
  currency: string;
  created_at: string;
  transaction_type: string;
  sender_id?: number;
  receiver_id?: number;
  sender_name?: string;
  receiver_name?: string;
};

export default function History() {
  const [transactions, setTransactions] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | undefined>(undefined);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const [token, storedUser] = await Promise.all([
        SessionService.getAccessToken(),
        SessionService.getUser(),
      ]);

      if (storedUser?.id) setUserId(storedUser.id);

      if (!token) {
        setTransactions([]);
        return;
      }

      const response = await ApiService.getWalletHistory(token, 50, 0);
      if (response.success && response.data?.transactions) {
        setTransactions(response.data.transactions);
      } else if (response.success && response.data?.history) {
        setTransactions(response.data.history);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const getIcon = (item: HistoryItem) => {
    const iconProps = { size: 20, color: '#fff' };
    const type = item.transaction_type || '';
    if (type.includes('bill')) return <Zap {...iconProps} />;
    if (type.includes('top')) return <Phone {...iconProps} />;
    return <User {...iconProps} />;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const totalBalance = useMemo(
    () =>
      transactions.reduce((sum, item) => {
        const amount = Number(item.amount) || 0;
        if (userId && item.sender_id === userId) {
          return sum - amount;
        }
        return sum + amount;
      }, 0),
    [transactions, userId]
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.heading}>Transaction History</Text>
        <Text style={styles.subheading}>Recent activity</Text>
      </View>

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Net Flow</Text>
          <Text style={[styles.summaryAmount, totalBalance >= 0 ? styles.positive : styles.negative]}>
            Rs {Math.abs(totalBalance).toLocaleString()}
          </Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{transactions.filter(a => userId && a.sender_id === userId).length}</Text>
            <Text style={styles.statLabel}>Outgoing</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{transactions.filter(a => !userId || a.sender_id !== userId).length}</Text>
            <Text style={styles.statLabel}>Incoming</Text>
          </View>
        </View>
      </View>

      {/* Transactions List */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 24 }}>
        <Text style={styles.sectionTitle}>All Transactions</Text>
        <TouchableOpacity onPress={loadHistory}>
          <Text style={{ color: '#4A90E2', fontWeight: '600' }}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 16 }} />
      ) : (
        transactions.map((item, index) => {
          const isOutgoing = userId && item.sender_id === userId;
          const amount = Number(item.amount) || 0;
          const label = isOutgoing ? item.receiver_name || 'Recipient' : item.sender_name || 'Sender';
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.activityCard,
                index === 0 && styles.firstCard
              ]}
              activeOpacity={0.7}
            >
              <View style={styles.cardContent}>
                <View style={[
                  styles.iconContainer,
                  isOutgoing ? styles.iconSent : styles.iconReceived
                ]}>
                  {getIcon(item)}
                </View>

                <View style={styles.activityInfo}>
                  <Text style={styles.activityLabel}>{label}</Text>
                  <Text style={styles.activityDate}>{formatDate(item.created_at)}</Text>
                </View>

                <View style={styles.amountContainer}>
                  <Text style={[
                    styles.activityAmount,
                    isOutgoing ? styles.amountNegative : styles.amountPositive
                  ]}>
                    {isOutgoing ? '-' : '+'}Rs {Math.abs(amount).toLocaleString()}
                  </Text>
                  {isOutgoing ? (
                    <ArrowUpRight size={14} color="#EF4444" style={styles.arrowIcon} />
                  ) : (
                    <ArrowDownLeft size={14} color="#10B981" style={styles.arrowIcon} />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        })
      )}

      <View style={{ paddingVertical: 24, alignItems: 'center' }}>
        <Text style={styles.footerText}>Showing {transactions.length} transactions</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  subheading: {
    fontSize: 15,
    color: '#64748B',
  },
  summaryCard: {
    backgroundColor: '#fff',
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  summaryAmount: {
    fontSize: 24,
    fontWeight: '700',
  },
  positive: {
    color: '#10B981',
  },
  negative: {
    color: '#EF4444',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginBottom: 16,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginLeft: 24,
    marginBottom: 12,
  },
  activityCard: {
    backgroundColor: '#fff',
    marginHorizontal: 24,
    marginBottom: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 1,
  },
  firstCard: {
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconSent: {
    backgroundColor: '#0A0A3E',
  },
  iconReceived: {
    backgroundColor: '#10B981',
  },
  activityInfo: {
    flex: 1,
  },
  activityLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 13,
    color: '#64748B',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityAmount: {
    fontSize: 16,
    fontWeight: '700',
    marginRight: 4,
  },
  amountPositive: {
    color: '#10B981',
  },
  amountNegative: {
    color: '#0F172A',
  },
  arrowIcon: {
    marginLeft: 2,
  },
  footer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#94A3B8',
  },
});