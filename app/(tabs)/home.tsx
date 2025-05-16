import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/Avatar.png')} // Add this image
          style={styles.avatar}
        />
        <View>
          <Text style={styles.hello}>Hello</Text>
          <Text style={styles.username}>Rafay</Text>
        </View>
      </View>

      {/* Balance */}
      <Text style={styles.balanceLabel}>Current Balance</Text>
      <Text style={styles.balance}>13250 Rs</Text>

      {/* Buttons Row */}
      <View style={styles.buttonRow}>
        {['Transfer', 'Utility Bills', 'History', 'Top Up'].map((label, index) => (
          <TouchableOpacity key={index} style={styles.circleButton}>
            <Text style={styles.circleButtonText}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Activity Chart Placeholder */}
      <View style={styles.chart}>
        <Text style={styles.chartLabel}>Activity Chart</Text>
      </View>

      {/* Scam Warning */}
      <View style={styles.warningCard}>
        <Text style={styles.warningTitle}>⚠️ Beware of Scammers</Text>
        <Text style={styles.warningText}>
          Do not share your OTP with anyone. InstaPay will never ask you to share your OTP.
        </Text>
      </View>

      {/* Promotions */}
      <View style={styles.promotions}>
        <View style={styles.promoBox}>
          <Text style={styles.promoText}>Promotions</Text>
        </View>
        <View style={styles.promoBox}>
          <Text style={styles.promoText}>Promotions</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  hello: {
    fontSize: 14,
    color: '#555',
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0A0A3E',
  },
  balanceLabel: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 10,
  },
  balance: {
    textAlign: 'center',
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0A0A3E',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingVertical: 20,
    borderRadius: 0,
    elevation: 3,
    marginBottom: 25,
  },
  circleButton: {
    backgroundColor: '#0A0A3E',
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  circleButtonText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  chart: {
    backgroundColor: '#ddd',
    height: 140,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartLabel: {
    color: '#555',
    fontSize: 16,
  },
  warningCard: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  warningTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  warningText: {
    fontSize: 14,
    color: '#444',
  },
  promotions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  promoBox: {
    backgroundColor: '#ddd',
    flex: 1,
    height: 100,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  promoText: {
    fontWeight: '600',
    color: '#333',
  },
});
