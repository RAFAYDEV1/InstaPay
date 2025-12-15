import { Entypo, FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import ApiService from "../../services/api.service";
import SessionService, { StoredUser } from "../../services/session.service";
import { useImage } from "../context/ImageContext";

type Transaction = {
  id: number;
  amount: number;
  currency: string;
  created_at: string;
  transaction_type: string;
  status: string;
  sender_id?: number;
  receiver_id?: number;
  receiver_name?: string;
  sender_name?: string;
  description?: string;
};

export default function HomeScreen() {
  const screenWidth = Dimensions.get("window").width;
  const { imageUri, setImageUri } = useImage();
  const router = useRouter();

  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("User");
  const [userId, setUserId] = useState<number | undefined>(undefined);

  const buttons = [
    {
      label: "Transfer",
      icon: <Ionicons name="people" size={28} color="#fff" />,
      URL: "/transfer",
      bgColor: "#4A90E2"
    },
    {
      label: "Utility Bills",
      icon: <FontAwesome5 name="file-invoice" size={28} color="#fff" />,
      URL: "/UtilityBills",
      bgColor: "#50C878"
    },
    {
      label: "History",
      icon: <Ionicons name="time" size={28} color="#fff" />,
      URL: "/history",
      bgColor: "#9B59B6"
    },
    {
      label: "Top Up",
      icon: <Entypo name="plus" size={28} color="#fff" />,
      URL: "/TopUp",
      bgColor: "#E67E22"
    },
  ];

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [token, storedUser] = await Promise.all([
        SessionService.getAccessToken(),
        SessionService.getUser(),
      ]);

      let userData = storedUser;

      if (token) {
        const profileRes = await ApiService.getProfile(token);
        if (profileRes.success && profileRes.data?.user) {
          userData = profileRes.data.user;
          await SessionService.saveSession({ accessToken: token }, userData as StoredUser);
        }
      }

      if (userData?.fullName) setUserName(userData.fullName);
      if (userData?.id) setUserId(userData.id);

      // Load profile image from session / API
      if (userData?.profileImageUrl) {
        setImageUri(userData.profileImageUrl);
      }

      if (!token) {
        setTransactions([]);
        setWallet(null);
        return;
      }

      const [walletRes, txRes] = await Promise.all([
        ApiService.getWalletBalance(token),
        ApiService.getTransactions(token, { limit: 10 }),
      ]);

      if (walletRes.success && walletRes.data?.wallet) {
        setWallet(walletRes.data.wallet);
      }

      if (txRes.success && txRes.data?.transactions) {
        setTransactions(txRes.data.transactions);
      }
    } finally {
      setLoading(false);
    }
  }, [setImageUri]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const chartData = useMemo(() => {
    const labels: string[] = [];
    const values: number[] = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      labels.push(date.toLocaleDateString("en-US", { weekday: "short" }));
      const totalForDay = transactions.reduce((sum, tx) => {
        const txDate = new Date(tx.created_at);
        if (txDate.toDateString() !== date.toDateString()) return sum;
        const amount = Number(tx.amount) || 0;
        if (userId && tx.sender_id === userId) {
          return sum - amount;
        }
        return sum + amount;
      }, 0);
      values.push(Math.abs(totalForDay));
    }

    return {
      labels,
      datasets: [
        {
          data: values,
          color: () => "#4A90E2",
          strokeWidth: 3,
        },
      ],
    };
  }, [transactions, userId]);

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 0,
    color: () => "#4A90E2",
    labelColor: () => "#666",
    propsForBackgroundLines: {
      strokeDasharray: "",
      stroke: "#E8E8E8",
      strokeWidth: 1,
    },
  };

  const quickStats = useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const monthly = transactions.filter(
      (tx) => new Date(tx.created_at) >= monthStart
    );

    const totals = monthly.reduce(
      (acc, tx) => {
        const amount = Number(tx.amount) || 0;
        if (userId && tx.sender_id === userId) {
          acc.sent += amount;
        } else {
          acc.received += amount;
        }
        return acc;
      },
      { sent: 0, received: 0 }
    );

    return [
      {
        label: "Sent This Month",
        value: `Rs ${totals.sent.toLocaleString()}`,
        icon: "trending-down",
        color: "#E74C3C",
      },
      {
        label: "Received",
        value: `Rs ${totals.received.toLocaleString()}`,
        icon: "trending-up",
        color: "#50C878",
      },
    ];
  }, [transactions, userId]);

  const recentTransactions = useMemo(
    () => transactions.slice(0, 5),
    [transactions]
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <TouchableOpacity
        style={styles.header}
        onPress={() => router.push("/profile")}
      >
        <Image
          source={
            imageUri ? { uri: imageUri } : require("@/assets/images/Avatar.png")
          }
          style={styles.avatar}
        />
        <View style={styles.headerText}>
          <Text style={styles.hello}>Welcome back</Text>
          <Text style={styles.username}>{userName}</Text>
        </View>
        <Ionicons name="notifications-outline" size={24} color="#0A0A3E" style={styles.notificationIcon} />
      </TouchableOpacity>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.balance}>
            {wallet ? `${wallet.currency} ${Number(wallet.balance).toLocaleString()}` : '—'}
          </Text>
        )}
        <View style={styles.statsRow}>
          {quickStats.map((stat, idx) => (
            <View key={idx} style={styles.statItem}>
              <Ionicons name={stat.icon as any} size={16} color={stat.color} />
              <View style={styles.statText}>
                <Text style={styles.statLabel}>{stat.label}</Text>
                <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.buttonCard}>
        {buttons.map((btn) => (
          <TouchableOpacity
            key={btn.label}
            style={[styles.iconButton, { backgroundColor: btn.bgColor }]}
            onPress={() => router.push(btn.URL as any)}
          >
            {btn.icon}
            <Text style={styles.iconLabel}>{btn.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Activity Chart */}
      <View style={styles.chart}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartLabel}>Weekly Activity</Text>
          <TouchableOpacity onPress={loadData}>
            <Text style={styles.viewAll}>Refresh</Text>
          </TouchableOpacity>
        </View>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <LineChart
            data={chartData}
            width={screenWidth - 40}
            height={200}
            chartConfig={chartConfig}
            bezier
            style={styles.chartStyle}
          />
        )}
      </View>

      {/* Security Notice */}
      <View style={styles.securityNotice}>
        <View style={styles.securityIconBg}>
          <MaterialIcons name="security" size={20} color="#FF6B35" />
        </View>
        <View style={styles.securityTextContainer}>
          <Text style={styles.securityTitle}>Security Reminder</Text>
          <Text style={styles.securityText}>
            Never share your PIN or OTP with anyone, including bank staff.
          </Text>
        </View>
      </View>

      {/* Payment History */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <TouchableOpacity onPress={() => router.push("/history")}>
          <Text style={styles.viewAll}>See All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.paymentHistory}>
        {loading ? (
          <ActivityIndicator />
        ) : (
          recentTransactions.map((transaction) => {
            const isSent = userId && transaction.sender_id === userId;
            const amountDisplay = `${isSent ? '-' : '+'}Rs ${Number(transaction.amount).toLocaleString()}`;
            const color = isSent ? '#E74C3C' : '#50C878';
            const counterparty = isSent ? transaction.receiver_name || 'Recipient' : transaction.sender_name || 'Sender';
            return (
              <TouchableOpacity key={transaction.id} style={styles.transactionCard}>
                <View style={[styles.transactionIcon, { backgroundColor: color + '20' }]}>
                  <Ionicons name={isSent ? 'arrow-up' : 'arrow-down'} size={20} color={color} />
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionName}>{counterparty}</Text>
                  <Text style={styles.transactionType}>{transaction.transaction_type || 'transaction'}</Text>
                </View>
                <View style={styles.transactionRight}>
                  <Text style={[styles.transactionAmount, { color }]}>
                    {amountDisplay}
                  </Text>
                  <Text style={styles.transactionDate}>
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 2,
    borderColor: "#4A90E2",
  },
  headerText: {
    flex: 1,
  },
  hello: {
    fontSize: 14,
    color: "#888",
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0A0A3E",
  },
  notificationIcon: {
    padding: 8,
  },
  balanceCard: {
    backgroundColor: "#0A0A3E",
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  balanceLabel: {
    color: "#B0B0C0",
    fontSize: 14,
    marginBottom: 8,
  },
  balance: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statText: {
    gap: 2,
  },
  statLabel: {
    color: "#B0B0C0",
    fontSize: 12,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  buttonCard: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  iconButton: {
    flex: 1,
    alignItems: "center",
    borderRadius: 12,
    paddingVertical: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconLabel: {
    color: "#fff",
    fontSize: 12,
    marginTop: 8,
    textAlign: "center",
    fontWeight: "600",
  },
  chart: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  chartLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0A0A3E",
  },
  viewAll: {
    color: "#4A90E2",
    fontSize: 14,
    fontWeight: "600",
  },
  chartStyle: {
    borderRadius: 12,
  },
  securityNotice: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#FF6B35",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  securityIconBg: {
    backgroundColor: "#FFF3E0",
    borderRadius: 8,
    padding: 8,
    marginRight: 12,
  },
  securityTextContainer: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0A0A3E",
    marginBottom: 4,
  },
  securityText: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0A0A3E",
  },
  paymentHistory: {
    gap: 12,
    marginBottom: 20,
  },
  transactionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0A0A3E",
    marginBottom: 4,
  },
  transactionType: {
    fontSize: 13,
    color: "#888",
  },
  transactionRight: {
    alignItems: "flex-end",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: "#888",
  },
});