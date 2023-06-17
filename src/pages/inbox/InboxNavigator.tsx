import { SafeAreaView } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { InboxScreen } from "./screens/InboxScreen";

const Stack = createNativeStackNavigator();

export const InboxNavigator = () => {
  return (
    <SafeAreaView>
      <Stack.Navigator initialRouteName="InboxScreen">
        <Stack.Group>
          <Stack.Screen
            name="InboxScreen"
            options={{ title: "Inbox" }}
            component={InboxScreen}
          />
        </Stack.Group>
      </Stack.Navigator>
    </SafeAreaView>
  );
};
