import { Entypo, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>

      {/* QR Code Section */}
      <View style={styles.avatarWrapper}>
        <View style={styles.qrBorder}>
          <Image
            source={require('@/assets/images/qr.png')}
            style={styles.qrImage}
          />
        </View>
      </View>

      <View style={styles.cardContainer}>
        <ProfileCard 
          icon={<Ionicons name="person" size={20} color="#1E1E50" />}
          title="Personal Details"
          onPress={() => router.push('/profile/personalDetails')}
        />

        <ProfileCard
          icon={<FontAwesome5 name="university" size={18} color="#1E1E50" />}
          title="InstaPay Account Details"
          onPress={() => router.push('/profile/AccountDetails')}
        />
        <ProfileCard
          icon={<Entypo name="add-user" size={20} color="#1E1E50" />}
          title="Invite Friend to InstaPay"
          onPress={() => router.push('/profile/Invite')}
        />
      </View>
    </View>
  );
}

function ProfileCard({
  icon,
  title,
  onPress,
}: {
  icon: React.ReactNode;
  title: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.iconWrapper}>{icon}</View>
      <Text style={styles.cardText}>{title}</Text>
      <Ionicons name="chevron-forward" size={18} color="#1E1E50" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E1E50',
    marginBottom: 30,
  },
  avatarWrapper: {
    alignItems: 'center',
    marginBottom: 40,
  },
  qrBorder: {
    borderWidth: 3,
    borderColor: '#c91f5a',
    borderRadius: 16,
    padding: 6,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 5,
  },
  qrImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  qrText: {
    marginTop: 12,
    color: '#1E1E50',
    fontSize: 14,
    fontWeight: '500',
  },
  cardContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  iconWrapper: {
    width: 32,
    alignItems: 'center',
    marginRight: 16,
  },
  cardText: {
    flex: 1,
    fontSize: 16,
    color: '#1E1E50',
    fontWeight: '500',
  },
});
