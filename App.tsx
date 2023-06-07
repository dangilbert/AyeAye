import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useLogin } from "./src/pods/auth/useLogin";
import { NavigationContainer } from "@react-navigation/native";
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

export default function App() {
  useOnlineManager();

  useAppState(onAppStateChange);

  // TODO fetch the feed from lemmy.ml
  // const loginResult = useLogin("https://lemmy.dangilbert.eu", {
  //   username_or_email: "perketel",
  //   password: "gdBkM.UHRJDNiQBHrC*hvKd2nPEg!T",
  // });

  // console.log(loginResult);

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <HomeRoot />
        <StatusBar style="auto" />
      </NavigationContainer>
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
