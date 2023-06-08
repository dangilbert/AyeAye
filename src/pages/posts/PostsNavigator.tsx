import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "../../components/ThemedText";

export const PostsNavigator = () => {
  return (
    <SafeAreaView>
      <ThemedText>Posts feed</ThemedText>
      <ThemedText>Home screen shows options for viewing</ThemedText>
    </SafeAreaView>
  );
};
