import { StatusBar } from "expo-status-bar";
import { Platform, useColorScheme } from "react-native";
import {
  MD3DarkTheme,
  MD3LightTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
} from "@tanstack/react-query";
import React from "react";
import { useAppState } from "./src/hooks/useAppState";
import { useOnlineManager } from "./src/hooks/useOnlineManager";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { HomeRoot } from "./src/pages/home/root";
import { ThemeProvider } from "./src/theme";
import { MediaModalScreen } from "./src/components/media/MediaModalScreen";

import "react-native-url-polyfill/auto";

import "@rn-app/components/sheets/sheets.tsx";
import "@rn-app/components/time/timeSetup.ts";
import { SheetProvider } from "react-native-actions-sheet";

function onAppStateChange(status: any) {
  // React Query already supports in web browser refetch on window focus by default
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 2 } },
});

const RootStack = createNativeStackNavigator();

export default function App() {
  useOnlineManager();
  useAppState(onAppStateChange);

  // TODO fetch the feed from lemmy.ml
  // const loginResult = useLogin("https://lemmy.dangilbert.eu", {
  //   username_or_email: "perketel",
  //   password: "redacted",
  // });

  const theme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <PaperProvider theme={theme === "dark" ? MD3DarkTheme : MD3LightTheme}>
          <SheetProvider>
            <NavigationContainer
              theme={theme === "dark" ? DarkTheme : DefaultTheme}
            >
              <RootStack.Navigator screenOptions={{ headerShown: false }}>
                <RootStack.Group>
                  <RootStack.Screen name={"HOME"} component={HomeRoot} />
                </RootStack.Group>
                <RootStack.Group screenOptions={{ presentation: "modal" }}>
                  <RootStack.Screen
                    name={"MediaModal"}
                    component={MediaModalScreen}
                  />
                </RootStack.Group>
              </RootStack.Navigator>
              <StatusBar style="auto" />
            </NavigationContainer>
          </SheetProvider>
        </PaperProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
