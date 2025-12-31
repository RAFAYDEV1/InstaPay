import { BarcodeScanningResult, CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const SCAN_BOX_SIZE = 250;

export default function CameraScreen() {
  const router = useRouter();
  const animation = useRef(new Animated.Value(0)).current;
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [banner, setBanner] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

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

  const handleBarCodeScanned = ({ data }: BarcodeScanningResult) => {
    if (scanned) return;
    setScanned(true);
    router.push({ pathname: '/scan-qr/amount', params: { qrData: data } });
  };

  return (
    <View style={styles.container}>
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
      <Text style={styles.heading}>Scan your QR Code</Text>

      <View style={styles.scannerContainer}>
        {permission?.granted ? (
          <View style={styles.cameraWrapper}>
            <CameraView
              style={StyleSheet.absoluteFill}
              onBarcodeScanned={handleBarCodeScanned}
            />
            <View style={styles.scannerBox}>
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
        ) : (
          <View style={styles.permissionBox}>
            <Image
              source={require('@/assets/images/qr.png')}
              style={styles.qrImage}
              resizeMode="contain"
            />
            <Text style={styles.permissionText}>
              Camera access is needed to scan QR codes.
            </Text>
            <TouchableOpacity
              style={styles.permissionButton}
              onPress={async () => {
                const response = await requestPermission();
                if (!response.granted) {
                  setBanner({ type: 'error', message: 'Camera permission is required to scan QR codes.' });
                }
              }}
            >
              <Text style={styles.permissionButtonText}>Allow Camera</Text>
            </TouchableOpacity>
          </View>
        )}
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
  cameraWrapper: {
    width: SCAN_BOX_SIZE,
    height: SCAN_BOX_SIZE,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#1E90FF',
  },
  scannerBox: {
    width: SCAN_BOX_SIZE,
    height: SCAN_BOX_SIZE,
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
  permissionBox: {
    width: SCAN_BOX_SIZE,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  permissionText: {
    color: '#333',
    textAlign: 'center',
  },
  permissionButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  permissionButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  banner: {
    position: 'absolute',
    top: 50,
    zIndex: 100,
    width: '90%',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: 'center',
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
});
