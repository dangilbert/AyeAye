import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SearchScreen } from "./screens/SearchScreen";

const Stack = createNativeStackNavigator();

export const SearchNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="SearchScreen">
      <Stack.Group>
        <Stack.Screen
          name="SearchScreen"
          component={SearchScreen}
          options={{ title: "Discover" }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};
