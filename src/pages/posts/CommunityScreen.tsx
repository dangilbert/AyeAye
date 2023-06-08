import { Button } from "react-native";
import { ThemedText } from "../../components/ThemedText";

export const CommunityScreen = ({ navigation }) => {
  return (
    <>
      <ThemedText>Community feed</ThemedText>
      <Button
        title="Go to post"
        onPress={() => {
          navigation.navigate("Post");
        }}
      />
    </>
  );
};
