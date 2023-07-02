import { CommentView } from "lemmy-js-client";
import { ThemedText, CreatorLine } from "@rn-app/components";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { Theme, useTheme } from "@rn-app/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { SheetManager } from "react-native-actions-sheet";
import { useCommentVote } from "@rn-app/pages/posts/hooks/useCommunities";
import { useCurrentUser } from "@rn-app/pages/account/hooks/useAccount";
import { ThemedMarkdown } from "../ThemedMarkdown";
import Animated, {
  interpolateColor,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import SwipeableItem, {
  SwipeableItemImperativeRef,
  UnderlayParams,
} from "react-native-swipeable-item";
import { useEffect, useRef, useState } from "react";

const itemWidth = 75;

export const CommentItem = ({
  comment,
  activeComment: activeItem,
}: {
  comment: CommentView;
  activeComment: Animated.SharedValue<number>;
}) => {
  const theme = useTheme();
  const themedStyle = styles(theme);

  const itemRef = useRef<SwipeableItemImperativeRef>(null);

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
      castVote("down");
    } else {
      castVote("unvote");
    }
  };

  return (
    <SwipeableItem
      ref={itemRef}
      item={comment}
      renderUnderlayRight={VotingUnderlay}
      snapPointsRight={[itemWidth, itemWidth * 2]}
      activationThreshold={40}
      onChange={(params) => {
        if (params?.snapPoint === itemWidth * 2) {
          onDownvote();
        } else if (params?.snapPoint === itemWidth) {
          onUpvote();
        }
        itemRef.current?.close();
      }}
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

const VotingUnderlay = ({
  close,
  percentOpen,
}: UnderlayParams<CommentView>) => {
  const themedStyles = styles(useTheme());
  const [votingState, setVotingState] = useState<"up" | "down">("up");
  const [width, setWidth] = useState(0);
  const rotation = useSharedValue(0);

  useAnimatedReaction(
    () => {
      return percentOpen.value;
    },
    (result) => {
      runOnJS(setVotingState)(result < 0.6 ? "up" : "down");
      runOnJS(setWidth)(result * itemWidth * 2);
    },
    [percentOpen, setVotingState]
  );

  useEffect(() => {
    if (votingState == "down") {
      rotation.value = withTiming(180, { duration: 200 });
    } else {
      rotation.value = withTiming(0, { duration: 200 });
    }
  }, [votingState, rotation]);

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${rotation.value}deg` }],
    };
  });

  const animatedContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      rotation.value,
      [0, 180],
      [
        themedStyles.upvoteItem.backgroundColor,
        themedStyles.downvoteItem.backgroundColor,
      ]
    );

    return {
      backgroundColor,
      width: width,
    };
  });

  return (
    <Animated.View
      style={[
        themedStyles.row,
        themedStyles.underlayRight,
        animatedContainerStyle,
      ]}
    >
      <TouchableOpacity onPress={() => close()}>
        <Animated.View style={animatedIconStyle}>
          <MaterialIcons name={"arrow-upward"} color={"white"} size={36} />
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

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
    row: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      width: itemWidth * 2,
      flex: 1,
    },
    underlayRight: {},
    voteItem: {
      color: theme.colors.icon,
    },
    upvoteItem: {
      backgroundColor: theme.colors.vote.upvoteBackgroundColor,
    },
    downvoteItem: {
      backgroundColor: theme.colors.vote.downvoteBackgroundColor,
    },
  });
