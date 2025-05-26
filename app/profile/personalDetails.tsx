import { useImage } from '@/app/context/ImageContext'; // adjust path
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const { imageUri, setImageUri } = useImage();

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert('Permission is required to access the gallery.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatarRing}>
          <Image
            source={
              imageUri
                ? { uri: imageUri }
                : require('@/assets/images/Avatar.png')
            }
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.cameraIcon} onPress={pickImage}>
            <Feather name="camera" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Fields */}
      <View style={styles.infoContainer}>
        <Field label="Name" value="Abdur Rafay Ali" />
        <Field label="User Name" value="Rafay2003" />
        <Field label="Mobile Number" value="03******19" />
        <Field label="Email" value="raffay@gmail.com" />
      </View>

      <Text style={styles.note}>
        Note: All communication, including OTPs will be sent to your contact detail mentioned here.
      </Text>
    </ScrollView>
  );
}

// Reusable Field component
const Field = ({ label, value }: { label: string; value: string }) => (
  <View style={{ marginBottom: 20 }}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputWrapper}>
      <Text style={styles.inputText}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginLeft: 10,
    color: '#0A0A3E',
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatarRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#B030B0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: -5,
    backgroundColor: '#0A0A3E',
    borderRadius: 20,
    padding: 8,
  },
  infoContainer: {
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: '#0A0A3E',
  },
  inputWrapper: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
  },
  inputText: {
    textTransform: 'uppercase',
    fontSize: 16,
    color: '#333',
  },
  note: {
    fontSize: 12,
    color: '#7A7A7A',
    marginTop: 30,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
});
