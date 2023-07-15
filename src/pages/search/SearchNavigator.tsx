import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SearchScreen } from "./screens/SearchScreen";
import { CommunitiesScreen } from "../posts/screens/CommunitiesScreen";
import { CommunityScreen } from "../posts/screens/CommunityScreen";
import { CommunitySidebarScreen } from "../posts/screens/CommunitySidebarScreen";
import { useNavigation } from "@react-navigation/native";
import { IconButton } from "react-native-paper";
import { PostScreen } from "../posts/screens/PostScreen";
import { ProfileScreen } from "../account/screens/ProfileScreen";

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
        <Stack.Screen
          name="Communities"
          component={CommunitiesScreen}
          options={{ title: "Communities" }}
        />
        <Stack.Screen name="CommunityFeed" component={CommunityScreen} />
        <Stack.Screen
          name="CommunitySidebar"
          component={CommunitySidebarScreen}
          options={{
            presentation: "modal",
            headerLeft: () => {
              const navigation = useNavigation();
              return (
                <IconButton icon="close" onPress={() => navigation.goBack()} />
              );
            },
          }}
        />
        <Stack.Screen
          name="Post"
          component={PostScreen}
          options={{ title: "<Post info>" }}
        />

        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
};
