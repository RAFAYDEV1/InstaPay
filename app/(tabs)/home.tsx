import { useImage } from "@/app/context/ImageContext";
import { Entypo, FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

export default function HomeScreen() {

  const screenWidth = Dimensions.get("window").width;
  const { imageUri } = useImage();
  const router = useRouter();
  const buttons = [
    {
      label: "Transfer",
      icon: <Ionicons name="people" size={28} color="#0A0A3E" />,
      URL: "/transfer"
    },
    {
      label: "Utility Bills",
      icon: <FontAwesome5 name="file-invoice" size={28} color="#0A0A3E" />,
      URL: "/UtilityBills"
    },
    {
      label: "History",
      icon: <Ionicons name="time" size={28} color="#0A0A3E" />,
      URL: "/history"
    },
    { label: "Top Up", 
      icon: <Entypo name="plus" size={28} color="#0A0A3E" />,
      URL: "/TopUp"
     },
  ];

  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [3000, 5000, 3500, 4000, 6000, 4500, 5000],
        color: () => "#0A0A3E", // line color
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 0,
    color: () => "#0A0A3E",
    labelColor: () => "#0A0A3E",
  };

  const fakePromotions = [
    {
      id: 1,
      title: 'Summer Sale',
      description: 'Get 30% off on all summer collection!',
      discount: '30% OFF',
    },
    {
      id: 2,
      title: 'Buy 1 Get 1 Free',
      description: 'Exclusive offer on select items.',
      discount: 'BOGO',
    },
    {
      id: 3,
      title: 'Free Shipping',
      description: 'On orders above $50.',
      discount: 'FREE SHIP',
    },
  ];


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
          style={{ width: 60, height: 60, borderRadius: 30 }}
        />
        <View>
          <Text style={styles.hello}>Hello</Text>
          <Text style={styles.username}>Rafay</Text>
        </View>
      </TouchableOpacity>

      {/* Balance */}
      <Text style={styles.balanceLabel}>Current Balance</Text>
      <Text style={styles.balance}>13250 Rs</Text>

      {/* Buttons Row */}
      <View style={styles.buttonCard}>
        {buttons.map((btn, index) => (
          <TouchableOpacity key={btn.label} style={styles.iconButton} onPress={() => router.push(btn.URL as any)}>
            {btn.icon}
            <Text style={styles.iconLabel}>{btn.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Activity Chart Placeholder */}
      <View style={styles.chart}>
        <Text style={styles.chartLabel}>Activity Chart</Text>
        <LineChart
          data={data}
          width={screenWidth - 40}
          height={180}
          chartConfig={chartConfig}
          bezier
          style={{ borderRadius: 16 }}
        />
      </View>

      {/* Security Notice */}
      <View style={styles.securityNotice}>
        <MaterialIcons name="security" size={20} color="#FF6B35" />
        <Text style={styles.securityText}>
          Keep your account secure. Never share your OTP with anyone.
        </Text>
      </View>

      {/* Promotions */}
      <ScrollView style={styles.container}>
      {/* Promotions */}
      <View style={styles.promotions}>
        {fakePromotions.map((promo) => (
          <View key={promo.id} style={styles.promoBox}>
            <Text style={styles.promoTitle}>{promo.title}</Text>
            <Text style={styles.promoDescription}>{promo.description}</Text>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{promo.discount}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#fff",
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
    marginRight: 10,
  },
  hello: {
    fontSize: 14,
    color: "#555",
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0A0A3E",
  },
  balanceLabel: {
    textAlign: "center",
    color: "#888",
    fontSize: 16,
    marginTop: 10,
  },
  balance: {
    textAlign: "center",
    fontSize: 36,
    fontWeight: "bold",
    color: "#0A0A3E",
    marginBottom: 20,
  },
  buttonCard: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#f4f4f4",
    borderRadius: 12,
    paddingVertical: 16,
    marginVertical: 15,
    alignItems: "center",
    justifyContent: "space-around",
    elevation: 8, // for Android shadow
    shadowColor: "#000", // for iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconButton: {
    alignItems: "center",
  },
  iconLabel: {
    color: "#0A0A3E", // Changed from white to dark
    fontSize: 14,
    marginTop: 6,
    textAlign: "center",
  },

  chart: {
    marginBottom: 20,
    alignItems: 'center',
  },
  chartLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0A0A3E',
    marginBottom: 10,
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
  },
  securityText: {
    fontSize: 14,
    color: '#856404',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  promotions: {
    flexDirection: 'column',
    gap: 12,
  },
  promoBox: {
    backgroundColor: '#0A0A3E',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    height: 150,
  },
  promoTitle: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  promoDescription: {
    color: '#fff',
    fontSize: 15,
    marginBottom: 10,
  },
  discountBadge: {
    backgroundColor: '#e67e22',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  discountText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
