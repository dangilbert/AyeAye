import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CommunitiesScreen } from "./screens/CommunitiesScreen";
import { CommunityScreen } from "./screens/CommunityScreen";
import { PostScreen } from "./screens/PostScreen";
import { PostSortTypeSelector } from "@rn-app/components/filter/PostSortTypeSelector";
import { CommunitySidebarScreen } from "./screens/CommunitySidebarScreen";
import { ProfileScreen } from "../account/screens/ProfileScreen";
import { IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

export const PostsNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Communities"
        component={CommunitiesScreen}
        options={{ title: "Communities" }}
      />
      <Stack.Screen
        name="CommunityFeed"
        component={CommunityScreen}
        options={{
          title: "<Community info>",
          headerRight: () => <PostSortTypeSelector />,
        }}
      />
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
    </Stack.Navigator>
  );
};
