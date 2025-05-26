import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HistoryScreen() {
  const recentActivities = [
    { id: '1', label: 'Sent Rs 1000 to Ali', date: '2025-05-24' },
    { id: '2', label: 'Paid Electricity Bill Rs 2200', date: '2025-05-23' },
    { id: '3', label: 'Mobile Top-up Rs 500', date: '2025-05-22' },
    { id: '4', label: 'Received Rs 3000 from Ahmed', date: '2025-05-21' },
    { id: '5', label: 'Transferred Rs 1500 to Hina', date: '2025-05-20' },
    { id: '6', label: 'Paid Internet Bill Rs 1800', date: '2025-05-19' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Transaction History</Text>

      {recentActivities.map((item) => (
        <View key={item.id} style={styles.activityCard}>
          <Text style={styles.activityLabel}>{item.label}</Text>
          <Text style={styles.activityDate}>{item.date}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0A0A3E',
    marginBottom: 20,
  },
  activityCard: {
    backgroundColor: '#0A0A3E',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  activityLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
  activityDate: {
    fontSize: 13,
    color: '#F0F0F0',
    marginTop: 5,
  },
});
