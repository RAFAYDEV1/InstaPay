import { Entypo, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();

  const profileCards = [
    {
      id: 'personal',
      icon: <Ionicons name="person" size={20} color="#fff" />,
      title: 'Personal Details',
      subtitle: 'Manage your profile information',
      colors: ['#3b82f6', '#06b6d4'],
      route: '/profile/personalDetails',
    },
    {
      id: 'account',
      icon: <FontAwesome5 name="university" size={18} color="#fff" />,
      title: 'InstaPay Account Details',
      subtitle: 'View account and payment info',
      colors: ['#a855f7', '#ec4899'],
      route: '/profile/AccountDetails',
    },
    {
      id: 'invite',
      icon: <Entypo name="add-user" size={20} color="#fff" />,
      title: 'Invite Friend to InstaPay',
      subtitle: 'Share and earn rewards',
      colors: ['#f97316', '#ef4444'],
      route: '/profile/Invite',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <Text style={styles.headerSubtitle}>
          Manage your account and preferences
        </Text>
      </View>

      {/* QR Code Section */}
      <View style={styles.qrSection}>
        <View style={styles.qrCard}>
          <LinearGradient
            colors={['#ec4899', '#8b5cf6', '#3b82f6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.qrGradientBorder}
          >
            <View style={styles.qrInnerBorder}>
              <View style={styles.qrImageContainer}>
                <Image
                  source={require('@/assets/images/qr.png')}
                  style={styles.qrImage}
                />
              </View>
            </View>
          </LinearGradient>

          <View style={styles.qrInfo}>
            <View style={styles.qrTitleRow}>
              <Ionicons name="sparkles" size={16} color="#a855f7" />
              <Text style={styles.qrTitle}>Your Payment QR</Text>
            </View>
            <Text style={styles.qrSubtitle}>
              Share this code to receive payments instantly
            </Text>

            <TouchableOpacity style={styles.shareButton}>
              <LinearGradient
                colors={['#ec4899', '#8b5cf6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.shareButtonGradient}
              >
                <Ionicons name="share-social" size={16} color="#fff" />
                <Text style={styles.shareButtonText}>Share QR Code</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Profile Cards */}
      <View style={styles.cardContainer}>
        {profileCards.map((card) => (
          <ProfileCard
            key={card.id}
            icon={card.icon}
            title={card.title}
            subtitle={card.subtitle}
            colors={card.colors}
            onPress={() => router.push(card.route)}
          />
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Need help? Visit our support center</Text>
      </View>
    </View>
  );
}

function ProfileCard({
  icon,
  title,
  subtitle,
  colors,
  onPress,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  colors: string[];
  onPress?: () => void;
}) {
  const [scaleValue] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
    >
      <Animated.View
        style={[styles.card, { transform: [{ scale: scaleValue }] }]}
      >
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconGradient}
        >
          {icon}
        </LinearGradient>

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardSubtitle}>{subtitle}</Text>
        </View>

        <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#64748b',
  },
  qrSection: {
    marginBottom: 24,
  },
  qrCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 8,
  },
  qrGradientBorder: {
    borderRadius: 20,
    padding: 3,
  },
  qrInnerBorder: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 2,
  },
  qrImageContainer: {
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    padding: 16,
  },
  qrImage: {
    width: 180,
    height: 180,
    borderRadius: 12,
  },
  qrInfo: {
    alignItems: 'center',
    marginTop: 20,
  },
  qrTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  qrTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  qrSubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
  },
  shareButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#8b5cf6',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },
  shareButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  cardContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  iconGradient: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#64748b',
  },
  footer: {
    marginTop: 24,
    marginBottom: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#94a3b8',
  },
});