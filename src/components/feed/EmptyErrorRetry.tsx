import { Button } from "react-native-paper";
import { ThemedText } from "../ThemedText";

export const EmptyErrorRetry = ({
  retryCalback,
}: {
  retryCalback: () => void;
}) => {
  return (
    <>
      <ThemedText
        variant="subheading"
        style={{ textAlign: "center", margin: 10 }}
      >
        Something went wrong :/
      </ThemedText>
      <Button onPress={retryCalback}>Retry</Button>
    </>
  );
};
