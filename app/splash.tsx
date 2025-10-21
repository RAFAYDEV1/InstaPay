// app/splash.tsx
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  StyleSheet,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  
  // Animation references
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const circleScale1 = useRef(new Animated.Value(0)).current;
  const circleScale2 = useRef(new Animated.Value(0)).current;
  const circleScale3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Subtle rotation animation
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    }).start();

    // Glow pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();

    // Ripple effect animations
    Animated.stagger(300, [
      Animated.timing(circleScale1, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(circleScale2, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(circleScale3, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
    ]).start();

    const timer = setTimeout(() => {
      // Fade out animation before navigation
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        router.replace({ pathname: '/onboarding/[step]', params: { step: '0' } });
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <View style={styles.container}>
      {/* Gradient Background Circles */}
      <View style={styles.backgroundGradient1} />
      <View style={styles.backgroundGradient2} />
      
      {/* Animated Ripple Circles */}
      <Animated.View 
        style={[
          styles.rippleCircle,
          styles.ripple1,
          {
            transform: [{ scale: circleScale1 }],
            opacity: circleScale1.interpolate({
              inputRange: [0, 1],
              outputRange: [0.6, 0],
            }),
          }
        ]} 
      />
      <Animated.View 
        style={[
          styles.rippleCircle,
          styles.ripple2,
          {
            transform: [{ scale: circleScale2 }],
            opacity: circleScale2.interpolate({
              inputRange: [0, 1],
              outputRange: [0.4, 0],
            }),
          }
        ]} 
      />
      <Animated.View 
        style={[
          styles.rippleCircle,
          styles.ripple3,
          {
            transform: [{ scale: circleScale3 }],
            opacity: circleScale3.interpolate({
              inputRange: [0, 1],
              outputRange: [0.2, 0],
            }),
          }
        ]} 
      />

      {/* Rotating Glow Effect */}
      <Animated.View 
        style={[
          styles.glowContainer,
          {
            opacity: glowOpacity,
            transform: [{ rotate }],
          }
        ]}
      >
        <View style={styles.glowEffect} />
      </Animated.View>

      {/* Logo */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }
        ]}
      >
        <Image 
          source={require('@/assets/images/logo.png')} 
          style={styles.logo}
        />
      </Animated.View>

      {/* Decorative Elements */}
      <View style={styles.topLeftDecor} />
      <View style={styles.bottomRightDecor} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  backgroundGradient1: {
    position: 'absolute',
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width * 0.75,
    backgroundColor: 'rgba(10, 10, 62, 0.04)',
    top: -width * 0.5,
    left: -width * 0.3,
  },
  backgroundGradient2: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    backgroundColor: 'rgba(10, 10, 62, 0.03)',
    bottom: -width * 0.4,
    right: -width * 0.4,
  },
  rippleCircle: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'rgba(10, 10, 62, 0.3)',
    borderRadius: 300,
  },
  ripple1: {
    width: 200,
    height: 200,
  },
  ripple2: {
    width: 300,
    height: 300,
  },
  ripple3: {
    width: 400,
    height: 400,
  },
  glowContainer: {
    position: 'absolute',
    width: 350,
    height: 350,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowEffect: {
    width: '100%',
    height: '100%',
    borderRadius: 175,
    backgroundColor: 'transparent',
    borderWidth: 30,
    borderColor: 'rgba(10, 10, 62, 0.05)',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  logo: {
    height: 320,
    width: width - 80,
    resizeMode: 'contain',
  },
  topLeftDecor: {
    position: 'absolute',
    top: 80,
    left: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(10, 10, 62, 0.06)',
  },
  bottomRightDecor: {
    position: 'absolute',
    bottom: 100,
    right: 40,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(10, 10, 62, 0.04)',
  },
});