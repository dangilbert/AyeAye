import { Button } from "react-native";
import { ThemedText } from "../../components/ThemedText";

export const CommunitiesScreen = ({ navigation }) => {
  return (
    <>
      <ThemedText>Communities content</ThemedText>
      <Button
        title="Go to community"
        onPress={() => {
          navigation.navigate("CommunityFeed");
        }}
      />
    </>
  );
};
