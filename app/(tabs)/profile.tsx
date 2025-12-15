import { Entypo, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Animated,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import SessionService from '../../services/session.service';

export default function ProfileScreen() {
  const router = useRouter();
  const [qrValue, setQrValue] = useState<string>('');
  const [userPhone, setUserPhone] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const profileCards = [
    {
      id: 'personal',
      icon: <Ionicons name="person" size={20} color="#fff" />,
      title: 'Personal Details',
      subtitle: 'Manage your profile information',
      colors: ['#3b82f6', '#06b6d4'] as const,
      route: '/profile/personalDetails' as const,
    },
    {
      id: 'account',
      icon: <FontAwesome5 name="university" size={18} color="#fff" />,
      title: 'InstaPay Account Details',
      subtitle: 'View account and payment info',
      colors: ['#a855f7', '#ec4899'] as const,
      route: '/profile/AccountDetails' as const,
    },
    {
      id: 'invite',
      icon: <Entypo name="add-user" size={20} color="#fff" />,
      title: 'Invite Friend to InstaPay',
      subtitle: 'Share and earn rewards',
      colors: ['#f97316', '#ef4444'] as const,
      route: '/profile/Invite' as const,
    },
  ] as const;

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        const stored = await SessionService.getUser();

        if (stored) {
          // Handle potential nested user object from previous bug
          const user = (stored as any).user || stored;

          if (user.phoneNumber) {
            setUserPhone(user.phoneNumber);
          }

          // Generate unique QR code data for this user
          const qrData = JSON.stringify({
            type: 'instapay_payment',
            userId: user.id,
            phoneNumber: user.phoneNumber,
            fullName: user.fullName,
            timestamp: Date.now(),
          });

          setQrValue(qrData);
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <Text style={styles.headerSubtitle}>
          Manage your account and preferences
        </Text>
      </View>

      {/* QR Section */}
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
                {loading ? (
                  <View style={[styles.qrImage, styles.qrLoading]}>
                    <Text style={styles.loadingText}>Generating...</Text>
                  </View>
                ) : qrValue ? (
                  <QRCode
                    value={qrValue}
                    size={180}
                    color="#1e293b"
                    backgroundColor="#ffffff"
                  />
                ) : (
                  <View style={[styles.qrImage, styles.qrError]}>
                    <Text style={styles.errorText}>Failed to load QR</Text>
                  </View>
                )}
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
                <Ionicons name="share-social" size={16} color="#fff" style={styles.shareButtonIcon} />
                <Text style={styles.shareButtonText}>Share QR Code</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* FlatList Cards */}
      <FlatList
        data={profileCards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProfileCard
            icon={item.icon}
            title={item.title}
            subtitle={item.subtitle}
            colors={item.colors}
            onPress={() => router.push(item.route as any)}
          />
        )}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
      />

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Need help? Visit our support center</Text>
      </View>
    </ScrollView>
  );
}

interface ProfileCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  colors: readonly string[];
  onPress?: () => void;
}

function ProfileCard({ icon, title, subtitle, colors, onPress }: ProfileCardProps) {
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
          colors={colors as any}
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

/* Styles */
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
    marginBottom: 6,
    gap: 6,
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
    elevation: 6,
  },
  shareButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  shareButtonIcon: {
    marginRight: 8,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 16,
  },
  iconGradient: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
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
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#94a3b8',
  },
  qrLoading: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
  },
  loadingText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  qrError: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
  },
  errorText: {
    fontSize: 12,
    color: '#991b1b',
    fontWeight: '500',
  },
});
