// File: app/(signup)/signup.tsx
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

export default function SignUp() {
  const router = useRouter();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const card1Scale = useRef(new Animated.Value(0.9)).current;
  const card2Scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Staggered card animations
    Animated.stagger(150, [
      Animated.spring(card1Scale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(card2Scale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Background Decorations */}
      <View style={styles.backgroundCircle1} />
      <View style={styles.backgroundCircle2} />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <AntDesign name="arrow-left" size={24} color="#0A0A3E" />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Choose your preferred sign up method</Text>
          </View>

          <View style={styles.iconContainer}>
            <AntDesign name="user-add" size={40} color="#4F46E5" />
          </View>
        </Animated.View>

        {/* Sign Up Options */}
        <View style={styles.optionsContainer}>
          {/* Phone Number Sign Up Card */}
          <Animated.View
            style={[
              { transform: [{ scale: card1Scale }] }
            ]}
          >
            <TouchableOpacity
              style={[styles.card, styles.primaryCard]}
              onPress={() => router.push('/signup/phone')}
              activeOpacity={0.8}
            >
              <View style={styles.cardContent}>
                <View style={[styles.iconBadge, styles.phoneBadge]}>
                  <AntDesign name="mobile" size={28} color="#fff" />
                </View>
                
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>Sign Up with Phone</Text>
                  <Text style={styles.cardDescription}>
                    Quick verification via OTP
                  </Text>
                </View>

                <View style={styles.arrowContainer}>
                  <AntDesign name="arrow-right" size={20} color="#4F46E5" />
                </View>
              </View>

              <View style={styles.cardBadge}>
                <Text style={styles.badgeText}>Recommended</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Info Card */}
          <Animated.View
            style={[
              styles.infoCard,
              {
                opacity: fadeAnim,
              }
            ]}
          >
            <AntDesign name="info-circle" size={20} color="#4F46E5" />
            <Text style={styles.infoText}>
              Your information is secure and encrypted. We never share your data with third parties.
            </Text>
          </Animated.View>
        </View>

        {/* Footer */}
        <Animated.View 
          style={[
            styles.footer,
            { opacity: fadeAnim }
          ]}
        >
          <Text style={styles.footerText}>
            Already have an account?{' '}
            <Text 
              style={styles.footerLink}
              onPress={() => router.push('/login')}
            >
              Sign In
            </Text>
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFF',
  },
  backgroundCircle1: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    backgroundColor: 'rgba(79, 70, 229, 0.03)',
    top: -width * 0.4,
    right: -width * 0.3,
  },
  backgroundCircle2: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: 'rgba(79, 70, 229, 0.02)',
    bottom: -width * 0.2,
    left: -width * 0.3,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 40,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  headerContent: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0A0A3E',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  optionsContainer: {
    flex: 1,
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#F3F4F6',
  },
  primaryCard: {
    borderColor: '#4F46E5',
    borderWidth: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBadge: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  phoneBadge: {
    backgroundColor: '#4F46E5',
  },
  creditBadge: {
    backgroundColor: '#F3F4F6',
  },
  creditIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0A0A3E',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  arrowContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#4F46E5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(79, 70, 229, 0.05)',
    padding: 16,
    borderRadius: 16,
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 20,
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 15,
    color: '#6B7280',
  },
  footerLink: {
    color: '#4F46E5',
    fontWeight: '700',
  },
});