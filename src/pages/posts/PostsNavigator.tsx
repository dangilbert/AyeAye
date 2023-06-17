import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CommunitiesScreen } from "./screens/CommunitiesScreen";
import { CommunityScreen } from "./screens/CommunityScreen";
import { PostScreen } from "./screens/PostScreen";
import { PostSortTypeSelector } from "@rn-app/components/filter/PostSortTypeSelector";

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
        name="Post"
        component={PostScreen}
        options={{ title: "<Post info>" }}
      />
    </Stack.Navigator>
  );
};
