import { ArrowDownLeft, ArrowUpRight, Phone, User, Wifi, Zap } from 'lucide-react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function History() {
  const recentActivities = [
    { id: '1', label: 'Sent to Ali', amount: -1000, date: '2025-05-24', type: 'sent', icon: 'user' },
    { id: '2', label: 'Electricity Bill', amount: -2200, date: '2025-05-23', type: 'bill', icon: 'zap' },
    { id: '3', label: 'Mobile Top-up', amount: -500, date: '2025-05-22', type: 'topup', icon: 'phone' },
    { id: '4', label: 'Received from Ahmed', amount: 3000, date: '2025-05-21', type: 'received', icon: 'user' },
    { id: '5', label: 'Sent to Hina', amount: -1500, date: '2025-05-20', type: 'sent', icon: 'user' },
    { id: '6', label: 'Internet Bill', amount: -1800, date: '2025-05-19', type: 'bill', icon: 'wifi' },
  ];

  const getIcon = (iconType:string) => {
    const iconProps = { size: 20, color: '#fff' };
    switch (iconType) {
      
      case 'zap': return <Zap {...iconProps} />;
      case 'wifi': return <Wifi {...iconProps} />;
      case 'phone': return <Phone {...iconProps} />;
      default: return <User {...iconProps} />;
    }
  };

  const formatDate = (dateStr:string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const totalBalance = recentActivities.reduce((sum, item) => sum + item.amount, 0);

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
            <Text style={styles.statValue}>{recentActivities.filter(a => a.amount < 0).length}</Text>
            <Text style={styles.statLabel}>Outgoing</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{recentActivities.filter(a => a.amount > 0).length}</Text>
            <Text style={styles.statLabel}>Incoming</Text>
          </View>
        </View>
      </View>

      {/* Transactions List */}
      <Text style={styles.sectionTitle}>All Transactions</Text>
      
      {recentActivities.map((item, index) => (
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
              item.amount > 0 ? styles.iconReceived : styles.iconSent
            ]}>
              {getIcon(item.icon)}
            </View>
            
            <View style={styles.activityInfo}>
              <Text style={styles.activityLabel}>{item.label}</Text>
              <Text style={styles.activityDate}>{formatDate(item.date)}</Text>
            </View>

            <View style={styles.amountContainer}>
              <Text style={[
                styles.activityAmount,
                item.amount > 0 ? styles.amountPositive : styles.amountNegative
              ]}>
                {item.amount > 0 ? '+' : ''}Rs {Math.abs(item.amount).toLocaleString()}
              </Text>
              {item.amount > 0 ? (
                <ArrowDownLeft size={14} color="#10B981" style={styles.arrowIcon} />
              ) : (
                <ArrowUpRight size={14} color="#EF4444" style={styles.arrowIcon} />
              )}
            </View>
          </View>
        </TouchableOpacity>
      ))}

      <View style={styles.footer}>
        <Text style={styles.footerText}>Showing last 6 transactions</Text>
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