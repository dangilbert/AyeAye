import { useTheme, Theme } from "@rn-app/theme";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";
import TimeAgo from "./TimeAgo";
import { Person } from "lemmy-js-client";
import { getShortActorId } from "@rn-app/utils/actorUtils";
import { MaterialIcons } from "@expo/vector-icons";
import { useBooleanSetting } from "@rn-app/hooks/useSetting";

interface CreatorLineProps {
  creator: Person;
  community?: string;
  actorId?: string;
  communityActorId?: string;
  published: string;
  updated?: string;
}

export const CreatorLine = ({
  creator,
  community,
  actorId,
  communityActorId,
  published,
  updated,
}: CreatorLineProps) => {
  const theme = useTheme();
  const themedStyle = styles(theme);

  const { value: showUserInstanceNames } = useBooleanSetting(
    "show_user_instance_names"
  );

  const { value: showCommunityInstanceNames } = useBooleanSetting(
    "show_community_instance_names"
  );

  const fixedPublished = new Date(
    published.endsWith("Z") == true ? published : `${published}Z`
  );
  return (
    <View style={themedStyle.creatorLine}>
      <View style={{ flexDirection: "column" }}>
        <ThemedText variant="labelBold">
          @{creator.name}
          {actorId && showUserInstanceNames && `@${getShortActorId(actorId)}`}
        </ThemedText>
        {community && (
          <ThemedText variant="label">
            to {community}
            {communityActorId &&
              showCommunityInstanceNames &&
              `@${getShortActorId(communityActorId)}`}
          </ThemedText>
        )}
      </View>
      {updated && (
        <View style={{ marginHorizontal: 5 }}>
          <MaterialIcons
            name="edit"
            color={theme.colors.text}
            size={theme.sizes.text.label}
          />
        </View>
      )}
      <View style={{ flex: 1, alignItems: "flex-end" }}>
        <TimeAgo date={fixedPublished} />
      </View>
    </View>
  );
};

const styles = (theme: Theme) =>
  StyleSheet.create({
    creatorLine: {
      flex: 1,
      flexDirection: "row",
    },
  });
