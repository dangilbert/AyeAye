import { PrivateMessageView } from "lemmy-js-client";
import { ThemedText } from "../ThemedText";
import { StyleSheet, View } from "react-native";
import { Theme, useTheme } from "@rn-app/theme";
import { CreatorLine } from "../CreatorLine";

export const InboxItem = ({ message }: { message: PrivateMessageView }) => {
  const themedStyles = styles(useTheme());
  return (
    <View style={themedStyles.container}>
      <View style={themedStyles.row}>
        <ThemedText>{`${message.private_message.content}`}</ThemedText>
      </View>
      <CreatorLine
        creator={message.creator}
        published={message.private_message.published}
      />
    </View>
  );
};

const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      padding: 10,
    },
    row: {
      flexDirection: "row",
    },
  });
