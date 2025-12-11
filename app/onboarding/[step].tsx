// app/onboarding/[step].tsx
import { AntDesign } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');


type StepParams = {
  step?: string | string[];
};

const data = [
  {
    title: 'Automating Microfinance',
    subtitle: 'Revolutionizing financial services across Pakistan',
    description: 'Empowering communities with modern, accessible microfinance solutions tailored for growth and sustainability.',
    image: require('@/assets/images/wallet.png'),
    color: '#4F46E5',
    gradient: ['#4F46E5', '#7C3AED'],
  },
  {
    title: 'Smart Business Software',
    subtitle: 'Built for microfinance excellence',
    description: 'Instapay provides comprehensive tools to manage, scale, and optimize your microfinance operations seamlessly.',
    image: require('@/assets/images/network.png'),
    color: '#0891B2',
    gradient: ['#0891B2', '#06B6D4'],
  },
];

export default function OnboardingStep() {
  const router = useRouter();
  const params = useLocalSearchParams() as StepParams;

  const stepParam = Array.isArray(params.step) ? params.step[0] : params.step;
  const index = parseInt(stepParam || '0', 10);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Reset animations on step change
    fadeAnim.setValue(0);
    slideAnim.setValue(50);
    scaleAnim.setValue(0.8);

    // Entrance animations
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
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Floating animation for image
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -15,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [index]);

  const goNext = () => {
    if (index + 1 < data.length) {
      router.push({
        pathname: '/onboarding/[step]',
        params: { step: `${index + 1}` },
      });
    } else {
      router.replace('/login');
    }
  };

  const goBack = () => {
    if (index > 0) {
      router.push({
        pathname: '/onboarding/[step]',
        params: { step: `${index - 1}` },
      });
    }
  };

  const skip = () => {
    router.replace('/login');
  };

  if (index < 0 || index >= data.length) {
    return null;
  }

  const currentData = data[index];
  const isLastStep = index === data.length - 1;

  return (
    <View style={styles.container}>
      {/* Dynamic Background */}
      <View
        style={[
          styles.backgroundGradient,
          { backgroundColor: currentData.color }
        ]}
      />
      <View style={styles.backgroundPattern}>
        <View style={[styles.circle1, { backgroundColor: `${currentData.color}20` }]} />
        <View style={[styles.circle2, { backgroundColor: `${currentData.color}15` }]} />
      </View>

      {/* Skip Button */}
      {!isLastStep && (
        <TouchableOpacity style={styles.skipButton} onPress={skip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      {/* Content */}
      <View style={styles.content}>
        {/* Image Section */}
        <Animated.View
          style={[
            styles.imageContainer,
            {
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
                { translateY: floatAnim }
              ],
            }
          ]}
        >
          <View style={[styles.imageBg, { backgroundColor: `${currentData.color}10` }]}>
            <Image source={currentData.image} style={styles.image} />
          </View>
        </Animated.View>

        {/* Text Section */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <View style={styles.badge}>
            <Text style={[styles.badgeText, { color: currentData.color }]}>
              Step {index + 1} of {data.length}
            </Text>
          </View>

          <Text style={styles.title}>{currentData.title}</Text>
          <Text style={[styles.subtitle, { color: currentData.color }]}>
            {currentData.subtitle}
          </Text>
          <Text style={styles.description}>{currentData.description}</Text>

          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            {data.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.progressDot,
                  i === index && styles.progressDotActive,
                  i === index && { backgroundColor: currentData.color },
                ]}
              />
            ))}
          </View>
        </Animated.View>
      </View>

      {/* Navigation Buttons */}
      <Animated.View
        style={[
          styles.navigationContainer,
          { opacity: fadeAnim }
        ]}
      >
        {index > 0 && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={goBack}
            activeOpacity={0.7}
          >
            <AntDesign name="arrow-left" size={24} color="#6B7280" />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.nextButton,
            { backgroundColor: currentData.color },
            index === 0 && styles.nextButtonFull
          ]}
          onPress={goNext}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>
            {isLastStep ? 'Get Started' : 'Continue'}
          </Text>
          <AntDesign name="arrow-right" size={20} color="#fff" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFF',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.5,
    opacity: 0.05,
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  circle1: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    top: -width * 0.4,
    right: -width * 0.3,
  },
  circle2: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    bottom: -width * 0.2,
    left: -width * 0.3,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  skipText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingTop: 80,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  imageBg: {
    width: width * 0.85,
    height: width * 0.85,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width * 0.65,
    height: width * 0.65,
    resizeMode: 'contain',
  },
  textContainer: {
    paddingHorizontal: 30,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0A0A3E',
    marginBottom: 10,
    letterSpacing: -0.5,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 30,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  progressDotActive: {
    width: 10,
  },
  navigationContainer: {
    flexDirection: 'row',
    paddingHorizontal: 30,
    paddingBottom: 50,
    gap: 16,
  },
  backButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  nextButton: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  nextButtonFull: {
    flex: 1,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});