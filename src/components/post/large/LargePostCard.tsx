import { PostView } from "lemmy-js-client";
import { Theme, useTheme } from "@rn-app/theme";
import { Pressable, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { CreatorLine } from "@rn-app/components";
import { getPostType } from "@rn-app/utils/postUtils";

import { PostTitle } from "../PostPreview";
import { PostCardFooter } from "../PostCardFooter";
import { useBooleanSetting } from "@rn-app/hooks/useSetting";
import { BlurView } from "@react-native-community/blur";
import { useState } from "react";
import { Text } from "react-native-paper";
import { ImagePopover } from "../media/ImagePopover";

export interface PostCardProps {
  post: PostView;
}

// TODO pass the Id and fetch this from reeact query
export const LargePostCard = ({ post }: PostCardProps) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const themedStyle = styles(theme);

  const postType = getPostType(post.post);
  const blurNSFW = useBooleanSetting("blur_nsfw");
  const [unblurNSFW, setUnblurNSFW] = useState(false);

  let postContent;
  switch (postType) {
    case "Image":
      postContent = (
        <View style={{ position: "relative", width: "100%", aspectRatio: 1 }}>
          <ImagePopover
            uri={post.post.url!!}
            title={
              post.post.name ??
              new URL(post.post.url!!).pathname.split("/").slice(-1)
            }
          />
          {blurNSFW && !unblurNSFW && post.post.nsfw && (
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={() => setUnblurNSFW(true)}
            >
              <BlurView
                style={StyleSheet.absoluteFill}
                blurType="light"
                blurAmount={30}
              />
              <View
                style={[
                  StyleSheet.absoluteFill,
                  { alignItems: "center", justifyContent: "center" },
                ]}
              >
                <MaterialIcons
                  name="warning"
                  size={50}
                  color={theme.colors.icon}
                />
                <Text variant="labelMedium">Sensitive content ahead</Text>
                <Text variant="labelMedium">View anyway</Text>
              </View>
            </Pressable>
          )}
        </View>
      );
      break;
  }

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
      {postContent}
      <View style={{ padding: 10 }}>
        <PostTitle text={post.post.name} />
        <CreatorLine
          creator={post.creator}
          actorId={post.creator.actor_id}
          published={post.post.published}
        />
        <PostCardFooter post={post} />
      </View>
    </Pressable>
  );
};

const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.secondaryBackground,
      flexDirection: "column",
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
