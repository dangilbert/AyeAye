import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@rn-app/components/ThemedText";

export const AccountNavigator = () => {
  return (
    <SafeAreaView>
      <ThemedText>Account view</ThemedText>
      <ThemedText>Username</ThemedText>
      <ThemedText>Host Server</ThemedText>
    </SafeAreaView>
  );
};
