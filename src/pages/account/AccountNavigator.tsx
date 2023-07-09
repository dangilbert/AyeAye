import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "./screens/LoginScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import { AccountSelectorScreen } from "./screens/AccountSelectorScreen";
import { AddIconButton } from "./components/AddIconButton";
import { BackButton } from "./components/BackButton";
import { ManageAccountsButton } from "./components/ManageAccountsButton";
import { PostScreen } from "../posts/screens/PostScreen";
import { CommunitySidebarScreen } from "../posts/screens/CommunitySidebarScreen";
import { useNavigation } from "@react-navigation/native";
import { IconButton } from "react-native-paper";
import { CommunityScreen } from "../posts/screens/CommunityScreen";
import { PostSortTypeSelector } from "@rn-app/components/filter/PostSortTypeSelector";

const Stack = createNativeStackNavigator();

export const AccountNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Profile">
      <Stack.Group>
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            headerRight: () => <ManageAccountsButton />,
          }}
        />
        <Stack.Screen name="Post" component={PostScreen} />

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
