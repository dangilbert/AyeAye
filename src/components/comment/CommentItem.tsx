import { CommentView } from "lemmy-js-client";
import { ThemedText, CreatorLine } from "@rn-app/components";
import { Pressable, StyleSheet, View } from "react-native";
import { Theme, useTheme } from "@rn-app/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { SheetManager } from "react-native-actions-sheet";
import { useCommentVote } from "@rn-app/pages/posts/hooks/useCommunities";
import { useCurrentUser } from "@rn-app/pages/account/hooks/useAccount";
import { ThemedMarkdown } from "../ThemedMarkdown";

export const CommentItem = ({ comment }: { comment: CommentView }) => {
  const theme = useTheme();
  const themedStyle = styles(theme);

  const commentIndentColors = theme.colors.commentIndentHighlight;
  const commentIndent = comment.comment.path.split(".").length - 3;

  const currentUser = useCurrentUser();

  const onCommentReply = () => {
    SheetManager.show("comment-reply-sheet", {
      payload: {
        postId: comment.post.id,
        commentId: comment.comment.id,
        communityId: comment.post.community_id,
      },
    });
  };

  const { mutate: castVote } = useCommentVote({
    postId: comment.post.id,
    commentId: comment.comment.id,
    communityId: comment.post.community_id,
  });

  const onUpvote = () => {
    if (!currentUser) return;
    if (comment.my_vote !== 1) {
      castVote("up");
    } else {
      castVote("unvote");
    }
  };
  const onDownvote = () => {
    if (!currentUser) return;
    if (comment.my_vote !== -1) {
      console.log("downvote");
      castVote("down");
    } else {
      console.log("unvote");
      castVote("unvote");
    }
  };

  return (
    <View
      style={{
        borderBottomColor: theme.colors.border,
        borderBottomWidth: 1,
        marginStart: commentIndent * 3,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderStartColor:
          commentIndentColors[commentIndent % commentIndentColors.length],
        borderStartWidth: 3,
        backgroundColor: theme.colors.secondaryBackground,
        flexDirection: "column",
        gap: 5,
      }}
    >
      <CreatorLine
        creator={comment.creator}
        actorId={comment.creator.actor_id}
        published={comment.comment.published}
        updated={comment.comment.updated}
        isOp={comment.creator.id === comment.post.creator_id}
      />
      <ThemedMarkdown>{comment.comment.content}</ThemedMarkdown>
      <View style={themedStyle.footer}>
        <Pressable style={themedStyle.footerAction} onPress={onCommentReply}>
          <MaterialIcons
            name={"reply"}
            size={themedStyle.footer.iconSize}
            color={themedStyle.footer.iconColor}
          />
        </Pressable>
        <View style={themedStyle.footerAction}>
          <MaterialIcons
            onPress={onUpvote}
            name="arrow-upward"
            size={themedStyle.footer.iconSize}
            color={themedStyle.footer.iconColor}
            style={{
              backgroundColor:
                comment.my_vote === 1 ? theme.colors.iconActive : undefined,
            }}
          />
          <ThemedText variant="label">{comment.counts.score}</ThemedText>
          <MaterialIcons
            onPress={onDownvote}
            name="arrow-downward"
            size={themedStyle.footer.iconSize}
            color={themedStyle.footer.iconColor}
            style={{
              backgroundColor:
                comment.my_vote === -1 ? theme.colors.iconActive : undefined,
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = (theme: Theme) =>
  StyleSheet.create({
    footer: {
      flexDirection: "row",
      iconColor: theme.colors.icon,
      iconSize: 20,
      justifyContent: "flex-end",
      gap: 20,
    },
    footerAction: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
    },
  });
