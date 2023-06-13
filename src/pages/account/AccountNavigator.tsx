import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "./screens/LoginScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import { AccountSelectorScreen } from "./screens/AccountSelectorScreen";
import { AddIconButton } from "./components/AddIconButton";
import { BackButton } from "./components/BackButton";

const Stack = createNativeStackNavigator();

export const AccountNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Profile">
      <Stack.Group>
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerLeft: () => <BackButton /> }}
        />
        <Stack.Screen
          name="AccountSelector"
          component={AccountSelectorScreen}
          options={{
            headerRight: () => <AddIconButton />,
            headerLeft: () => <BackButton />,
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};
