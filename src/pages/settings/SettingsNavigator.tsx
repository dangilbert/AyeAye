import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const SettingsNavigator = () => {
  return (
    <SafeAreaView>
      <Text>Settings screen</Text>
      <Text>Dark/Light toggle (eventually theme)</Text>
      <Text>Card layout</Text>
      <Text>Face ID/Passcode</Text>
      <Text>About (Libraries used)</Text>
    </SafeAreaView>
  );
};
