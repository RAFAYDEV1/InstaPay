import { ImageProvider } from '@/app/context/ImageContext'; // ✅ adjust the path if needed
import { Stack } from 'expo-router';
import 'react-native-reanimated';

export default function Layout() {
  return (
    <ImageProvider>
      <Stack initialRouteName="splash" />
    </ImageProvider>
  );
}
