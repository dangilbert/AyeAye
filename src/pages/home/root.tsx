import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { PostsNavigator } from "../posts/PostsNavigator";
import { InboxNavigator } from "../inbox/InboxNavigator";
import { AccountNavigator } from "../account/AccountNavigator";
import { SearchNavigator } from "../search/SearchNavigator";
import { SettingsNavigator } from "../settings/SettingsNavigator";

const Tab = createMaterialBottomTabNavigator();

export const HomeRoot = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Posts" component={PostsNavigator} />
      <Tab.Screen name="Inbox" component={InboxNavigator} />
      <Tab.Screen name="Account" component={AccountNavigator} />
      <Tab.Screen name="Search" component={SearchNavigator} />
      <Tab.Screen name="Settings" component={SettingsNavigator} />
    </Tab.Navigator>
  );
};
