import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from './features/home/presentation/screen/HomeScreen';
import ImagePreviewScreen from './features/image_preview/presentation/screen/ImagePreviewScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <StatusBar style='light'></StatusBar>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="GPS Cam" component={HomeScreen} />
          <Stack.Screen name="Image Preview" component={ImagePreviewScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
