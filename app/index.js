import { NativeBaseProvider } from "native-base";
import AppNavigator from "../navigation/AppNavigator";

export default function HomeScreen() {
    return (
        <NativeBaseProvider>
            <AppNavigator />
        </NativeBaseProvider>
    )
}