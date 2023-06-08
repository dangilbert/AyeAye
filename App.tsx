import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, useColorScheme } from "react-native";
import {
  MD3DarkTheme,
  MD3LightTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import { useLogin } from "./src/pods/auth/useLogin";
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
// import {
//   createAppContainer,
// } from '@react-navigation/native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeRoot } from "./src/pages/home/root";
import { ThemeProvider } from "./src/theme";

const Tab = createBottomTabNavigator();

function onAppStateChange(status) {
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
          <NavigationContainer
            theme={theme === "dark" ? DarkTheme : DefaultTheme}
          >
            <RootStack.Navigator screenOptions={{ headerShown: false }}>
              <RootStack.Screen name={"HOME"} component={HomeRoot} />
            </RootStack.Navigator>
            <StatusBar style="auto" />
          </NavigationContainer>
        </PaperProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
