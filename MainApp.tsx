
import { PaperProvider } from "react-native-paper";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParams } from "./screens/navProps";
import HomeScreen from "./screens/home/HomeScreen";
import MainAppBar from "./components/MainAppBar";
import ViewProfile from "./screens/profile/ViewProfile";
import EditFieldsScreen from "./screens/profile/EditFieldsScreen";
import FieldForm from "./screens/profile/FieldForm";
import SettingsScreen from "./screens/settings/SettingsScreen";
import LoginScreen from "./screens/auth/LoginScreen";
import RegistrationScreen from "./screens/auth/RegistrationScreen";
import ScannerScreen from "./screens/scanner/ScannerScreen";
import UserListScreen from "./screens/userlist/UserListScreen";
import DeleteAccountScreen from "./screens/deleteAccount/DeleteAccountScreen";

const Stack = createNativeStackNavigator<RootStackParams>();

export default function MainApp()
{
    return (
        <PaperProvider>
            <NavigationContainer theme={DarkTheme}>
                <Stack.Navigator screenOptions={{ headerTitleStyle: { fontSize: 24 } }}>
                    <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Home" }}/>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Registration" component={RegistrationScreen} />
                    <Stack.Screen name="Settings" component={SettingsScreen}/>
                    <Stack.Screen name="Scanner" component={ScannerScreen} options={{ title: 'Scan Code' }}/>
                    <Stack.Screen name="Profile" component={ViewProfile} />
                    <Stack.Screen name="EditFields" component={EditFieldsScreen} options={{ title: 'Edit My Fields' }}/>
                    <Stack.Screen name="FieldForm" component={FieldForm} options={{ title: 'Edit Field' }}/>
                    <Stack.Screen name="UserList" component={UserListScreen} options={{ title: '' }}/>
                    <Stack.Screen name="DeleteAccount" component={DeleteAccountScreen} options={{ title: 'Delete My Account' }} />
                </Stack.Navigator>
            </NavigationContainer>
        </PaperProvider>
    );
}