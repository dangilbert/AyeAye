import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar, useColorScheme } from "react-native";

import { HomeRoot } from "@rn-app/pages/home/root";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";

import allCommunitiesState from "@rn-app/pages/home/state/allCommunities.json";
import localCommunitiesState from "@rn-app/pages/home/state/localCommunities.json";
import subscribedCommunitiesState from "@rn-app/pages/home/state/subscribedCommunities.json";
import { MediaModalScreen } from "@rn-app/components/media/MediaModalScreen";
import { useStringSetting } from "@rn-app/hooks/useSetting";
import { getCurrentUserSessionToken } from "@rn-app/pods/auth/queries";

const RootStack = createNativeStackNavigator();

export const NavigationRoot = () => {
  const theme = useColorScheme();

  const { value: defaultLaunchView } = useStringSetting("default_launch_view");
  const currentSession = getCurrentUserSessionToken();

  let initialState;
  switch (defaultLaunchView) {
    case "All":
      initialState = allCommunitiesState;
      break;
    case "Local":
      initialState = localCommunitiesState;
      break;
    case "Subscribed":
      if (!currentSession) {
        // fall back to All
        initialState = allCommunitiesState;
      } else {
        initialState = subscribedCommunitiesState;
      }
      break;
  }

  return (
    <NavigationContainer
      theme={theme === "dark" ? DarkTheme : DefaultTheme}
      initialState={initialState}
    >
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Group>
          <RootStack.Screen name={"HOME"} component={HomeRoot} />
        </RootStack.Group>
        <RootStack.Group screenOptions={{ presentation: "modal" }}>
          <RootStack.Screen name={"MediaModal"} component={MediaModalScreen} />
        </RootStack.Group>
      </RootStack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
};
