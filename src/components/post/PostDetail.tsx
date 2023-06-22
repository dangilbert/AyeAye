import { Fragment } from "react";
import { Theme, useTheme } from "@rn-app/theme";
import { StyleSheet, View, Platform, Pressable, Share } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ThemedText } from "@rn-app/components";
import { PostView } from "lemmy-js-client";
import { PostPreview } from "./PostPreview";
import { getShareContent } from "@rn-app/utils/postUtils";
import Snackbar from "react-native-snackbar";
import { SheetManager } from "react-native-actions-sheet";
import { usePostVote } from "@rn-app/pages/posts/hooks/useCommunities";
import { useCurrentUser } from "@rn-app/pages/account/hooks/useAccount";

export interface PostDetailProps {
  post: PostView;
}

export const PostDetail = ({ post }: PostDetailProps) => {
  const theme = useTheme();
  const themedStyle = styles(theme);
  const currentUser = useCurrentUser();

  const onShare = async () => {
    try {
      await Share.share({
        message: getShareContent(post.post),
      });
    } catch (error: any) {
      Snackbar.show({ text: error.message });
    }
  };

  const onPostReply = () => {
    SheetManager.show("comment-reply-sheet", {
      payload: {
        postId: post.post.id,
        communityId: post.post.community_id,
      },
    });
  };

  const { mutate: castVote } = usePostVote(
    post?.post?.id,
    post?.post?.community_id
  );

  const onUpvote = () => {
    if (!currentUser) return;
    if (post.my_vote !== 1) {
      castVote("up");
    } else {
      castVote("unvote");
    }
  };
  const onDownvote = () => {
    if (!currentUser) return;
    if (post.my_vote !== -1) {
      console.log("downvote");
      castVote("down");
    } else {
      console.log("unvote");
      castVote("unvote");
    }
  };

  console.log("Post read", post.read);

  return (
    <Fragment key={`post_${post.post.id}`}>
      <PostPreview post={post} />

      <View style={themedStyle.footer}>
        <View style={themedStyle.footerAction}>
          <MaterialIcons
            name="comment"
            size={themedStyle.footer.iconSize}
            color={themedStyle.footer.iconColor}
          />
          <ThemedText variant="label">{post.counts.comments}</ThemedText>
        </View>
        <Pressable style={themedStyle.footerAction} onPress={onPostReply}>
          <MaterialIcons
            name={"reply"}
            size={themedStyle.footer.iconSize}
            color={themedStyle.footer.iconColor}
          />
        </Pressable>
        <Pressable style={themedStyle.footerAction} onPress={onShare}>
          <MaterialIcons
            name={Platform.OS === "ios" ? "ios-share" : "share"}
            size={themedStyle.footer.iconSize}
            color={themedStyle.footer.iconColor}
          />
        </Pressable>
        <View style={themedStyle.footerAction}>
          <MaterialIcons
            onPress={onUpvote}
            name="keyboard-arrow-up"
            size={themedStyle.footer.iconSize}
            color={themedStyle.footer.iconColor}
            style={{
              backgroundColor:
                post.my_vote === 1 ? theme.colors.iconActive : undefined,
              borderRadius: 5,
            }}
          />
          <ThemedText variant="label">{post.counts.score}</ThemedText>
          <MaterialIcons
            onPress={onDownvote}
            name="keyboard-arrow-down"
            size={themedStyle.footer.iconSize}
            color={themedStyle.footer.iconColor}
            style={{
              backgroundColor:
                post.my_vote === -1 ? theme.colors.iconActive : undefined,
              borderRadius: 5,
            }}
          />
        </View>
      </View>
    </Fragment>
  );
};

const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      borderColor: theme.colors.border,
      borderWidth: 1,
      margin: 5,
      padding: 5,
      borderRadius: 5,
      flexDirection: "row",
      alignItems: "center",
    },
    titleLine: {
      flexDirection: "row",
      marginVertical: 5,
    },
    titleAndCreator: {
      flexDirection: "column",
      flex: 1,
    },
    image: {
      flex: 1,
      aspectRatio: 4 / 3,
      borderRadius: 5,
      resizeMode: "contain",
      backgroundColor: theme.colors.secondaryBackground,
    },
    title: {
      flex: 1,
    },
    icon: {
      size: 50,
      color: theme.colors.text,
      margin: 10,
    },
    iconContainer: {
      width: 60,
      height: 50,
      marginEnd: 10,
      marginTop: 10,
      borderRadius: 5,
      backgroundColor: theme.colors.border,
      justifyContent: "center",
      alignItems: "center",
    },
    creator: {},
    footer: {
      flexDirection: "row",
      iconColor: theme.colors.icon,
      iconSize: 20,
      justifyContent: "space-between",
      padding: 10,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    footerAction: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
    },
  });
