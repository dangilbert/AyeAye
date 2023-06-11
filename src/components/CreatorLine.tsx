import { useTheme, Theme } from "@rn-app/theme";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";
import TimeAgo from "./TimeAgo";
import { Person } from "lemmy-js-client";
import { getShortActorId } from "@rn-app/utils/actorUtils";

interface CreatorLineProps {
  creator: Person;
  community?: string;
  actorId?: string;
  published: Date;
}

export const CreatorLine = ({
  creator,
  community,
  actorId,
  published,
}: CreatorLineProps) => {
  const themedStyle = styles(useTheme());
  return (
    <View style={themedStyle.creatorLine}>
      <View style={{ flexDirection: "column" }}>
        <ThemedText variant="label">
          {creator.name}
          {actorId && `@${getShortActorId(actorId)}`}
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
