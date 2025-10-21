import { Stack } from 'expo-router';
// import 'react-native-reanimated';
import { ImageProvider } from './context/ImageContext'; // ✅ adjust the path if needed

function Layout() {
  return (
    <ImageProvider>
      <Stack initialRouteName="splash" />
    </ImageProvider>
  );
}

export default Layout;