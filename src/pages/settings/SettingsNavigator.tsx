import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SettingsRootScreen } from "./screens/SettingsRootScreen";

const Stack = createNativeStackNavigator();

export const SettingsNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SettingsRoot"
        component={SettingsRootScreen}
        options={{ title: "Settings" }}
      />
    </Stack.Navigator>
  );
};
