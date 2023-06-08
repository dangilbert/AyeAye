import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "../../components/ThemedText";

export const SettingsNavigator = () => {
  return (
    <SafeAreaView>
      <ThemedText>Settings screen</ThemedText>
      <ThemedText>Dark/Light toggle (eventually theme)</ThemedText>
      <ThemedText>Card layout</ThemedText>
      <ThemedText>Face ID/Passcode</ThemedText>
      <ThemedText>About (Libraries used)</ThemedText>
    </SafeAreaView>
  );
};
