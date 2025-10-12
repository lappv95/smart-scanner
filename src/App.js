import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider, extendTheme } from "native-base";
import AppNavigator from './src/navigation/AppNavigator';

const colorModeManager = StorageManager({
  get: async () => {
    try {
      const val = await AsyncStorage.getItem("@color-mode");
      return val === "dark" ? "dark" : "light";
    } catch (e) {
      return "light";
    }
  },
  set: async (value) => {
    try {
      await AsyncStorage.setItem("@color-mode", value);
    } catch (e) {
      console.log(e);
    }
  },
});
const theme = extendTheme({
  config: { initialColorMode: "light" },
});
export default function App() {
  return (
    <NavigationContainer>
      <NativeBaseProvider theme={theme} colorModeManager={colorModeManager}>
        <AppNavigator />
      </NativeBaseProvider>
    </NavigationContainer>
  );
}
