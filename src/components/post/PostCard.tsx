import { PostView } from "lemmy-js-client";
import { Theme, useTheme } from "@rn-app/theme";
import { Pressable, StyleSheet, View, Platform, Share } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { ThemedText, CreatorLine } from "@rn-app/components";
import { getPostType, getShareContent } from "@rn-app/utils/postUtils";
import FastImage from "react-native-fast-image";
import Snackbar from "react-native-snackbar";
import { useBooleanSetting } from "@rn-app/hooks/useSetting";
import { BlurView } from "@react-native-community/blur";
import ImageModal from "@dreamwalk-os/react-native-image-modal";
import { ThemedMarkdown } from "../ThemedMarkdown";
import { PostTitle } from "./PostPreview";

export interface PostCardProps {
  post: PostView;
}

// TODO pass the Id and fetch this from reeact query
export const PostCard = ({ post }: PostCardProps) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const themedStyle = styles(theme);

  const postType = getPostType(post.post);

  const { value: blurNSFW } = useBooleanSetting("blur_nsfw");

  const onShare = async () => {
    try {
      await Share.share({
        message: getShareContent(post.post),
      });
    } catch (error: any) {
      Snackbar.show({ text: error.message });
    }
  };

  return (
    <Pressable
      key={`post_${post.post.id}`}
      style={themedStyle.container}
      onPress={() =>
        navigation.navigate("Post", {
          originalPost: post,
        })
      }
    >
      {postType === "Image" && (
        <View style={themedStyle.imageContainer}>
          <ImageModal
            resizeMode="cover"
            modalImageResizeMode="contain"
            style={[themedStyle.imageBox, themedStyle.image]}
            source={{ uri: post.post.thumbnail_url ?? post.post.url }}
          />
          {post.post.nsfw && blurNSFW && (
            <BlurView
              blurType="light"
              style={[themedStyle.imageBox, themedStyle.imageBlur]}
              blurAmount={5}
              pointerEvents="none"
            />
          )}
        </View>
      )}
      {postType === "Video" && (
        <Pressable
          style={themedStyle.imageContainer}
          onPress={() => {
            navigation.navigate("MediaModal", {
              videoUri: post.post.embed_video_url ?? post.post.url,
            });
          }}
        >
          {post.post.thumbnail_url ? (
            <FastImage
              style={[themedStyle.imageBox, themedStyle.image]}
              source={{ uri: post.post.thumbnail_url }}
            />
          ) : (
            <View style={themedStyle.iconContainer}>
              <MaterialIcons
                name={"play-circle-outline"}
                style={themedStyle.icon}
              />
            </View>
          )}
          {post.post.nsfw && blurNSFW && (
            <BlurView
              blurType="light"
              style={[themedStyle.imageBox, themedStyle.imageBlur]}
              blurAmount={5}
            />
          )}
        </Pressable>
      )}
      {(postType === "Link" || postType === "SimpleLink") && (
        <View style={themedStyle.iconContainer}>
          <MaterialIcons name={"link"} style={themedStyle.icon} />
        </View>
      )}
      {postType === "Text" && (
        <View style={themedStyle.iconContainer}>
          <MaterialIcons name={"text-snippet"} style={themedStyle.icon} />
        </View>
      )}
      <View style={themedStyle.rightContent}>
        <CreatorLine
          creator={post.creator}
          community={post.community.name}
          actorId={post.creator.actor_id}
          communityActorId={post.community.actor_id}
          published={post.post.published}
        />
        <View style={themedStyle.title}>
          <PostTitle text={post.post.name} />
        </View>
        {["Link", "SimpleLink", "Video"].includes(postType) &&
          post.post.url && (
            <View style={themedStyle.title}>
              <ThemedText variant={"caption"}>
                {new URL(post.post.url).hostname.replace("www.", "")}
              </ThemedText>
            </View>
          )}
        <View style={themedStyle.footer}>
          <View style={themedStyle.footerAction}>
            <MaterialIcons
              name="comment"
              size={themedStyle.footer.iconSize}
              color={themedStyle.footer.iconColor}
            />
            <ThemedText variant="label">{post.counts.comments}</ThemedText>
          </View>
          <Pressable style={themedStyle.footerAction} onPress={onShare}>
            <MaterialIcons
              name={Platform.OS === "ios" ? "ios-share" : "share"}
              size={themedStyle.footer.iconSize}
              color={themedStyle.footer.iconColor}
            />
          </Pressable>
          <View style={themedStyle.footerAction}>
            <MaterialIcons
              name="arrow-upward"
              size={themedStyle.footer.iconSize}
              color={themedStyle.footer.iconColor}
            />
            <ThemedText variant="label">{post.counts.score}</ThemedText>
            <MaterialIcons
              name="arrow-downward"
              size={themedStyle.footer.iconSize}
              color={themedStyle.footer.iconColor}
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.secondaryBackground,
      marginVertical: 5,
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
      marginTop: 5,
      justifyContent: "space-between",
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
    },
    image: {
      zIndex: 1,
    },
    imageBlur: {
      zIndex: 2,
    },
    title: {
      flex: 1,
    },
    icon: {
      color: theme.colors.text,
      margin: 10,
      fontSize: 20,
    },
    iconContainer: {
      width: 50,
      height: 50,
      marginEnd: 10,
      borderRadius: 5,
      backgroundColor: theme.colors.border,
      justifyContent: "center",
      alignItems: "center",
    },
  });
