import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useImage } from '../context/ImageContext'; // adjust path

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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
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
                <Feather name="camera" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.profileName}>Abdur Rafay Ali</Text>
          <Text style={styles.profileHandle}>@Rafay2003</Text>
        </View>

        {/* Info Fields */}
        <View style={styles.fieldsContainer}>
          <Field 
            icon="user" 
            label="Full Name" 
            value="Abdur Rafay Ali" 
          />
          <Field 
            icon="at-sign" 
            label="Username" 
            value="Rafay2003" 
          />
          <Field 
            icon="phone" 
            label="Mobile Number" 
            value="03000755519"
          />
          <Field 
            icon="mail" 
            label="Email Address" 
            value="raffay@gmail.com" 
          />
        </View>
      </View>

      {/* Note Section */}
      <View style={styles.noteContainer}>
        <View style={styles.noteIcon}>
          <Feather name="info" size={16} color="#6C63FF" />
        </View>
        <Text style={styles.noteText}>
          All communication, including OTPs will be sent to your contact details mentioned above.
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Change Password</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Enhanced Field component
const Field = ({ 
  icon, 
  label, 
  value, 
  sensitive = false 
}: { 
  icon: string; 
  label: string; 
  value: string; 
  sensitive?: boolean;
}) => (
  <View style={styles.fieldContainer}>
    <View style={styles.fieldHeader}>
      <View style={styles.fieldLabelContainer}>
        <Feather name={icon as any} size={16} color="#6C63FF" />
        <Text style={styles.fieldLabel}>{label}</Text>
      </View>
    </View>
    <View style={styles.fieldValueContainer}>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F0FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarSection: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatarRing: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 4,
    borderColor: '#1E1E50',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#1E1E50',
    borderRadius: 20,
    padding: 10,
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E1E50',
    marginBottom: 4,
  },
  profileHandle: {
    fontSize: 16,
    color: '#1E1E50',
    fontWeight: '500',
  },
  fieldsContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E1E50',
    marginLeft: 8,
  },
  fieldValueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E1E50',
  },
  fieldValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  noteContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0F0FF',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#6C63FF',
  },
  noteIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  noteText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    flex: 1,
  },
  actionButtons: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
    gap: 12,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1E1E50',
  },
  secondaryButtonText: {
    color: '#1E1E50',
    fontSize: 16,
    fontWeight: '600',
  },
});