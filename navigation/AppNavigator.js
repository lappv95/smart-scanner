import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useColorMode } from "native-base";
import HistoryScreen from '../src/screens/HistoryScreen';
import ScanScreen from '../src/screens/ScanScreen';
import SettingsScreen from '../src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
const { colorMode } = useColorMode();
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: colorMode === "dark" ? "#90CDF4" : "#007AFF",
                tabBarStyle: {
                    backgroundColor: colorMode === "dark" ? "#1A202C" : "#fff",
                },
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === "Scan") iconName = "qr-code-outline";
                    else if (route.name === "History") iconName = "time-outline";
                    else if (route.name === "Settings") iconName = "settings-outline";
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}>

            <Tab.Screen name="Scan" component={ScanScreen} />
            <Tab.Screen name="History" component={HistoryScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />

        </Tab.Navigator>
    );
}
