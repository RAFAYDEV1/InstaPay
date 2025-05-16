import { Entypo, FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.avatarWrapper}>
        <View style={styles.avatarBorder}>
          <Image
            source={require('@/assets/images/Avatar.png')} // replace with your actual image
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.cameraButton}>
            <Ionicons name="camera" size={18} color="#1E1E50" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardContainer}>
        <ProfileCard
          icon={<Ionicons name="person" size={20} color="#1E1E50" />}
          title="Personal Details"
        />
        <ProfileCard
          icon={<FontAwesome5 name="university" size={18} color="#1E1E50" />}
          title="Bank Account Details"
        />
        <ProfileCard
          icon={<MaterialIcons name="article" size={20} color="#1E1E50" />}
          title="Account opening Form"
        />
        <ProfileCard
          icon={<Entypo name="add-user" size={20} color="#1E1E50" />}
          title="Invite Friend to Paynow"
        />
      </View>
    </View>
  );
}

function ProfileCard({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <TouchableOpacity style={styles.card}>
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
  avatarBorder: {
    borderWidth: 3,
    borderColor: '#c91f5a',
    borderRadius: 100,
    padding: 5,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 5,
    position: 'relative',
  },
  avatar: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: '#ddd',
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
