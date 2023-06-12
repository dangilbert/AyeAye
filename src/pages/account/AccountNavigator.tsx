import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "./screens/LoginScreen";
import { ProfileScreen } from "./screens/ProfileScreen";

const Stack = createNativeStackNavigator();

export const AccountNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Profile">
      <Stack.Group>
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
};
