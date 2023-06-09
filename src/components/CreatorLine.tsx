import { useTheme, Theme } from "@rn-app/theme";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";
import TimeAgo from "./TimeAgo";
import { Person } from "lemmy-js-client";

interface CreatorLineProps {
  creator: Person;
  community?: string;
  published: Date;
}

export const CreatorLine = ({
  creator,
  community,
  published,
}: CreatorLineProps) => {
  const themedStyle = styles(useTheme());
  return (
    <View style={themedStyle.creatorLine}>
      <View style={{ flexDirection: "column" }}>
        <ThemedText variant="label">
          {creator.name}
          {"@<instance name...>"}
        </ThemedText>
        {community && <ThemedText variant="label">to {community}</ThemedText>}
      </View>
      <TimeAgo date={published} />
    </View>
  );
};

const styles = (theme: Theme) =>
  StyleSheet.create({
    creatorLine: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
    },
  });
