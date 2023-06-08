import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { PostsNavigator } from "../posts/PostsNavigator";
import { InboxNavigator } from "../inbox/InboxNavigator";
import { AccountNavigator } from "../account/AccountNavigator";
import { SearchNavigator } from "../search/SearchNavigator";
import { SettingsNavigator } from "../settings/SettingsNavigator";
import { TabBarIcon } from "../../components/TabBarIcon";

const Tab = createMaterialBottomTabNavigator();

export const HomeRoot = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Posts"
        component={PostsNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon="dynamic-feed" />
          ),
        }}
      />
      <Tab.Screen
        name="Inbox"
        component={InboxNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon="inbox" />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon="person-outline" />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon="search" />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon="settings" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
