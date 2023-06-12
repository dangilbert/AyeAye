import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "./screens/LoginScreen";

const Stack = createNativeStackNavigator();

export const AccountNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Group>
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
};
