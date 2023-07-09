import { useTheme, Theme } from "@rn-app/theme";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import TimeAgo from "./TimeAgo";
import { Community, Person } from "lemmy-js-client";
import { getShortActorId } from "@rn-app/utils/actorUtils";
import { MaterialIcons } from "@expo/vector-icons";
import { useBooleanSetting } from "@rn-app/hooks/useSetting";
import { useNavigation } from "@react-navigation/native";
import FastImage from "react-native-fast-image";

interface CreatorLineProps {
  creator: Person;
  community?: Community;
  actorId?: string;
  communityActorId?: string;
  published: string;
  updated?: string;
  isOp?: boolean;
}

export const CreatorLine = ({
  creator,
  community,
  actorId,
  communityActorId,
  published,
  updated,
  isOp,
}: CreatorLineProps) => {
  const theme = useTheme();
  const themedStyle = styles(theme);
  const navigator = useNavigation();

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
        <TouchableOpacity
          onPress={() => {
            navigator.push("Profile", {
              userId: creator.id,
            });
          }}
        >
          <Text variant="labelMedium">
            @{creator.name}
            {actorId && showUserInstanceNames && `@${getShortActorId(actorId)}`}
          </Text>
        </TouchableOpacity>
        {community && (
          <TouchableOpacity
            onPress={() => {
              navigator.push("CommunityFeed", {
                communityId: community.id,
                communityType: undefined,
              });
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingTop: 5,
            }}
          >
            {community.icon && (
              <FastImage
                source={{ uri: community.icon }}
                style={{
                  width: 15,
                  height: 15,
                  borderRadius: 15,
                  marginEnd: 5,
                }}
              />
            )}
            <Text variant="labelSmall">
              to {community.name}
              {communityActorId &&
                showCommunityInstanceNames &&
                `@${getShortActorId(communityActorId)}`}
            </Text>
          </TouchableOpacity>
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
      {isOp && (
        <View style={{ marginHorizontal: 5 }}>
          <MaterialIcons
            name="mic"
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
