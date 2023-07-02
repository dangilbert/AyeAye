import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { PostsNavigator } from "@pages/posts/PostsNavigator";
import { InboxNavigator } from "@pages/inbox/InboxNavigator";
import { AccountNavigator } from "@pages/account/AccountNavigator";
import { SearchNavigator } from "@pages/search/SearchNavigator";
import { SettingsNavigator } from "@pages/settings/SettingsNavigator";
import { TabBarIcon } from "@rn-app/components/TabBarIcon";
import { useCurrentUser } from "../account/hooks/useAccount";

const Tab = createMaterialBottomTabNavigator();

export const HomeRoot = () => {
  const currentSession = useCurrentUser({ enabled: true });

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
        name={currentSession ? currentSession.username : "Account"}
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
