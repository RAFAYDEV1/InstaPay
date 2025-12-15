import { AntDesign } from '@expo/vector-icons';
import * as Crypto from 'expo-crypto';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import ApiService from '../../services/api.service';
import SessionService from '../../services/session.service';

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const isValid =
    oldPassword.length >= 8 &&
    newPassword.length >= 8 &&
    confirmPassword.length >= 8 &&
    newPassword === confirmPassword;

  const handleChangePassword = async () => {
    if (!isValid) {
      setBanner({ type: 'error', message: 'Please fill all fields correctly' });
      return;
    }
    try {
      setLoading(true);
      setBanner(null);
      const token = await SessionService.getAccessToken();
      if (!token) {
        setBanner({ type: 'error', message: 'Session expired. Please log in again.' });
        return;
      }

      const oldHash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        oldPassword
      );
      const newHash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        newPassword
      );

      const response = await ApiService.changePassword(token, oldHash, newHash);

      if (!response.success) {
        setBanner({ type: 'error', message: response.message || response.error || 'Failed to change password' });
        return;
      }

      setBanner({ type: 'success', message: 'Password updated successfully' });
      setTimeout(() => router.back(), 800);
    } catch (err: any) {
      setBanner({ type: 'error', message: err.message || 'Failed to change password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <AntDesign name="arrow-left" size={24} color="#0A0A3E" />
          </TouchableOpacity>
          <Text style={styles.title}>Change Password</Text>
          <Text style={styles.subtitle}>Keep your account secure</Text>
        </View>

        {banner && (
          <View
            style={[
              styles.banner,
              banner.type === 'success' && styles.bannerSuccess,
              banner.type === 'error' && styles.bannerError,
              banner.type === 'info' && styles.bannerInfo,
            ]}
          >
            <Text
              style={[
                styles.bannerText,
                banner.type === 'success' && styles.bannerTextSuccess,
                banner.type === 'error' && styles.bannerTextError,
                banner.type === 'info' && styles.bannerTextInfo,
              ]}
            >
              {banner.message}
            </Text>
          </View>
        )}

        {/* Old Password */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Old Password</Text>
          <View style={styles.inputWrapper}>
            <AntDesign name="lock" size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter old password"
              placeholderTextColor="#9CA3AF"
              value={oldPassword}
              onChangeText={setOldPassword}
              secureTextEntry={!showOld}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowOld(!showOld)}>
              <AntDesign name={showOld ? "eye" : "eye-invisible"} size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* New Password */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>New Password</Text>
          <View style={styles.inputWrapper}>
            <AntDesign name="lock" size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter new password"
              placeholderTextColor="#9CA3AF"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNew}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowNew(!showNew)}>
              <AntDesign name={showNew ? "eye" : "eye-invisible"} size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.helperText}>Minimum 8 characters</Text>
        </View>

        {/* Confirm New Password */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm New Password</Text>
          <View style={styles.inputWrapper}>
            <AntDesign name="lock" size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Re-enter new password"
              placeholderTextColor="#9CA3AF"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirm}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
              <AntDesign name={showConfirm ? "eye" : "eye-invisible"} size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
          {confirmPassword.length > 0 && confirmPassword !== newPassword && (
            <Text style={styles.errorText}>Passwords do not match</Text>
          )}
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.primaryButton, (!isValid || loading) && styles.buttonDisabled]}
          onPress={handleChangePassword}
          disabled={!isValid || loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.primaryButtonText}>Update Password</Text>
              <AntDesign name="check-circle" size={20} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0A0A3E',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
  },
  banner: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  bannerText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  bannerSuccess: {
    backgroundColor: '#ECFDF3',
    borderColor: '#A7F3D0',
  },
  bannerError: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  bannerInfo: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  bannerTextSuccess: {
    color: '#166534',
  },
  bannerTextError: {
    color: '#991B1B',
  },
  bannerTextInfo: {
    color: '#1D4ED8',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#0A0A3E',
    fontWeight: '500',
  },
  helperText: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 8,
    marginLeft: 4,
  },
  errorText: {
    fontSize: 13,
    color: '#DC2626',
    marginTop: 8,
    marginLeft: 4,
    fontWeight: '500',
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: '#4F46E5',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 24,
    elevation: 4,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonDisabled: {
    backgroundColor: '#D1D5DB',
    elevation: 0,
    shadowOpacity: 0,
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
    padding: 5
  },
});

