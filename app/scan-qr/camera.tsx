import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');
const SCAN_BOX_SIZE = 250;

export default function CameraScreen() {
  const router = useRouter();
  const animation = useRef(new Animated.Value(0)).current;

  // Simulate QR scanning result after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/scan-qr/success');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Start scan line animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: SCAN_BOX_SIZE - 4,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Scan your QR Code</Text>

      <View style={styles.scannerContainer}>
        <View style={styles.scannerBox}>
          {/* Dummy QR Code */}
          <Image
            source={require('@/assets/images/qr.png')} // ⬅️ Add your QR image to this path
            style={styles.qrImage}
            resizeMode="contain"
          />

          {/* Scan line animation */}
          <Animated.View
            style={[
              styles.scanLine,
              { transform: [{ translateY: animation }] },
            ]}
          />

          {/* Scanner corners */}
          <View style={styles.cornerTopLeft} />
          <View style={styles.cornerTopRight} />
          <View style={styles.cornerBottomLeft} />
          <View style={styles.cornerBottomRight} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    alignItems: 'center',
    paddingTop: 100,
  },
  heading: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 40,
  },
  scannerContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannerBox: {
    width: SCAN_BOX_SIZE,
    height: SCAN_BOX_SIZE,
    backgroundColor: '#fff',
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrImage: {
    width: SCAN_BOX_SIZE,
    height: SCAN_BOX_SIZE,
  },
  scanLine: {
    width: '100%',
    height: 2,
    backgroundColor: 'limegreen',
    position: 'absolute',
    top: 0,
  },
  cornerTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 30,
    height: 4,
    backgroundColor: '#fff',
  },
  cornerTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 30,
    height: 4,
    backgroundColor: '#fff',
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 30,
    height: 4,
    backgroundColor: '#fff',
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 4,
    backgroundColor: '#fff',
  },
});
