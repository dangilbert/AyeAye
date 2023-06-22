import { CommentView } from "lemmy-js-client";
import { ThemedText, CreatorLine } from "@rn-app/components";
import { Pressable, StyleSheet, View } from "react-native";
import { Theme, useTheme } from "@rn-app/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { SheetManager } from "react-native-actions-sheet";
import { useCommentVote } from "@rn-app/pages/posts/hooks/useCommunities";
import { useCurrentUser } from "@rn-app/pages/account/hooks/useAccount";
import { ThemedMarkdown } from "../ThemedMarkdown";
import {
  SwipeableItem,
  withSwipeableContext,
  useSwipeableContext,
} from "react-native-easy-swipe";
import { useCallback } from "react";
import Animated, { useDerivedValue } from "react-native-reanimated";

const _CommentItem = ({
  comment,
  activeComment: activeItem,
}: {
  comment: CommentView;
  activeComment: Animated.SharedValue<number>;
}) => {
  const theme = useTheme();
  const themedStyle = styles(theme);
  const { close } = useSwipeableContext();

  const commentIndentColors = theme.colors.commentIndentHighlight;
  const commentIndent = comment.comment.path.split(".").length - 3;

  const currentUser = useCurrentUser();

  useDerivedValue(() => {
    if (activeItem.value !== comment.comment.id) {
      close();
    }
  }, []);

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
    close();
  };
  const onDownvote = () => {
    if (!currentUser) return;
    if (comment.my_vote !== -1) {
      castVote("down");
    } else {
      castVote("unvote");
    }
    close();
  };

  const renderLeftActions = useCallback(() => {
    return (
      <>
        <SwipeableItem.Button onPress={onUpvote}>
          <View
            style={[themedStyle.swipeAction, { backgroundColor: "orange" }]}
          >
            <MaterialIcons name={"arrow-upward"} />
          </View>
        </SwipeableItem.Button>
        <SwipeableItem.Button onPress={onDownvote}>
          <View style={[themedStyle.swipeAction, { backgroundColor: "blue" }]}>
            <MaterialIcons name={"arrow-downward"} />
          </View>
        </SwipeableItem.Button>
      </>
    );
  }, []);

  const renderRightActions = useCallback(() => {
    return <></>;
  }, []);

  const handleStartDrag = useCallback(() => {
    activeItem.value = comment.comment.id;
  }, [comment, activeItem]);

  return (
    <SwipeableItem
      containerStyle={themedStyle.container}
      renderRightActions={renderRightActions}
      renderLeftActions={renderLeftActions}
      onStartDrag={handleStartDrag}
      // onItemPress={handleItemPress}
    >
      <View style={themedStyle.overlay}>
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
            <Pressable
              style={themedStyle.footerAction}
              onPress={onCommentReply}
            >
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
                    comment.my_vote === -1
                      ? theme.colors.iconActive
                      : undefined,
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </SwipeableItem>
  );
};

export const CommentItem = withSwipeableContext(_CommentItem);

const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {},
    footer: {
      flexDirection: "row",
      iconColor: theme.colors.icon,
      iconSize: 20,
      justifyContent: "flex-end",
      gap: 20,
    },
    overlay: {
      backgroundColor: theme.colors.background,
    },
    footerAction: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
    },
    swipeAction: {
      width: 80,
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
  });
