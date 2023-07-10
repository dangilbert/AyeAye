import { PostView } from "lemmy-js-client";
import { Theme, useTheme } from "@rn-app/theme";
import { Pressable, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CreatorLine } from "@rn-app/components";
import { getPostType } from "@rn-app/utils/postUtils";

import { PostTitle } from "../PostPreview";
import { Text } from "react-native-paper";
import { PostIcon } from "../PostIcon";
import { PostCardFooter } from "../PostCardFooter";

export interface PostCardProps {
  post: PostView;
}

// TODO pass the Id and fetch this from reeact query
export const CompactPostCard = ({ post }: PostCardProps) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const themedStyle = styles(theme);

  const postType = getPostType(post.post);

  return (
    <Pressable
      key={`post_${post.post.id}`}
      style={themedStyle.container}
      onPress={() =>
        navigation.push("Post", {
          originalPost: post,
        })
      }
    >
      <PostIcon post={post} />
      <View style={themedStyle.rightContent}>
        <CreatorLine
          creator={post.creator}
          actorId={post.creator.actor_id}
          published={post.post.published}
        />
        <View style={themedStyle.title}>
          <PostTitle text={post.post.name} />
        </View>
        {["Link", "SimpleLink", "Video"].includes(postType) &&
          post.post.url && (
            <View style={themedStyle.title}>
              <Text variant={"labelSmall"}>
                {new URL(post.post.url).hostname.replace("www.", "")}
              </Text>
            </View>
          )}
        <PostCardFooter post={post} />
      </View>
    </Pressable>
  );
};

const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.secondaryBackground,
      padding: 10,
      flexDirection: "row",
    },
    rightContent: {
      flex: 1,
      flexDirection: "column",
    },
    footer: {
      flexDirection: "row",
      iconColor: theme.colors.icon,
      iconSize: 20,
      marginTop: 10,
      gap: 15,
    },
    footerAction: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
    },
    imageContainer: {
      position: "relative",
      width: 60,
      height: 60,
      marginEnd: 10,
    },
    imageBox: {
      position: "absolute",
      top: 0,
      width: 60,
      height: 60,
      left: 0,
      bottom: 0,
      right: 0,
      borderRadius: 5,
      backgroundColor: theme.colors.image.placeholder.backgroundColor,
    },
    image: {
      zIndex: 1,
    },
    imageBlur: {
      zIndex: 2,
    },
    warningIcon: {
      alignSelf: "center",
    },
    title: {
      flex: 1,
    },
    icon: {
      color: theme.colors.text,
      margin: 10,
      fontSize: 30,
    },
    iconContainer: {
      width: 60,
      height: 60,
      marginEnd: 10,
      borderRadius: 5,
      backgroundColor: theme.colors.border,
      justifyContent: "center",
      alignItems: "center",
    },
  });
