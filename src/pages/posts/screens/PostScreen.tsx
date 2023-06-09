import { CommentView } from "lemmy-js-client";

import { PostDetail } from "@rn-app/components/post/PostDetail";
import { useComments, useMarkAsRead, usePost } from "../hooks/useCommunities";
import { ActivityIndicator, FAB } from "react-native-paper";
import { CommentItem } from "@rn-app/components/comment/CommentItem";
import { FlashList } from "@shopify/flash-list";
import { StyleSheet } from "react-native";
import { Theme, useTheme } from "@rn-app/theme";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSharedValue } from "react-native-reanimated";
import { EmptyErrorRetry } from "@rn-app/components/feed/EmptyErrorRetry";
import { LoadingActivityView } from "@rn-app/components/feed/LoadingActivityView";

export const PostScreen = ({ navigation, route }) => {
  const originalPost = route.params.originalPost;
  const themedStyles = styles(useTheme());

  const listRef = useRef<FlashList<CommentView>>(null);

  const postId = originalPost.post.id;
  const communityId = originalPost.community.id;

  const [currentTopComment, setCurentTopComment] = useState<number>(0);

  const {
    data: post,
    error: postError,
    isLoading: isLoadingPost,
    invalidate: invalidatePost,
  } = usePost(communityId, postId);
  const {
    data: comments,
    error: commentsError,
    fetchNextPage,
    isLoading: isLoadingComments,
    isFetchingNextPage,
    hasNextPage,
    invalidate: invalidateComments,
  } = useComments(postId, communityId);

  const { mutate: markAsRead } = useMarkAsRead(postId, communityId);

  const invalidate = () => {
    invalidatePost();
    invalidateComments();
  };

  useEffect(() => {
    navigation.setOptions({
      title: post
        ? `${post?.counts.comments} comments`
        : `${originalPost.counts.comments} comments`,
    });

    post?.read == false && markAsRead();
  }, [post]);

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurentTopComment(viewableItems[0].index);
    }
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
    waitForInteraction: true,
  };

  const commentMap: Map<number, CommentView[]> = comments?.pages
    .flatMap((page) => page.comments)
    ?.reduce((commentMap, comment) => {
      const parentId = parseInt(comment.comment.path.split(".").slice(-2)[0]);
      commentMap[parentId] = commentMap[parentId] ?? [];
      commentMap[parentId].push(comment);
      return commentMap;
    }, new Map<number, CommentView[]>()) as Map<number, CommentView[]>;

  const commentList: CommentView[] = [];
  const buildTree = (commentId: number) => {
    if (commentMap[commentId]) {
      commentMap[commentId].forEach((comment) => {
        commentList.push(comment);
        buildTree(comment.comment.id);
      });
    }
  };

  commentMap && buildTree(0);

  const scrollToNextComment = () => {
    const topLevelCommentIndexes = commentList
      .filter((comment) => comment.comment.path.split(".").length === 2)
      .map((comment) => commentList.indexOf(comment))
      .filter((index) => index > currentTopComment);

    listRef.current?.scrollToIndex({
      index: topLevelCommentIndexes[0] ?? commentList.length,
      animated: true,
    });
  };

  const isError = !!commentsError || !!postError;

  commentsError && console.log("commentsError", commentsError);
  postError && console.log("postError", postError);

  const onErrorRetry = () => {
    if (post) {
      invalidateComments();
    } else if (comments) {
      invalidatePost();
    } else {
      invalidate();
    }
  };

  if (isError && !post) {
    return <EmptyErrorRetry retryCalback={onErrorRetry} />;
  }

  return (
    <>
      <FlashList
        ref={listRef}
        data={post || originalPost ? commentList : []}
        onRefresh={() => {
          invalidate();
        }}
        contentContainerStyle={{ paddingBottom: 86 }}
        refreshing={isLoadingPost && !post}
        estimatedItemSize={100}
        drawDistance={500}
        renderItem={({ item }) => {
          return (
            <CommentItem
              key={`commentitem_${item.comment.id}`}
              comment={item}
            />
          );
        }}
        keyExtractor={(item) =>
          `comment_${item.comment.id}+${item.my_vote}+${item.counts.score}`
        }
        ListHeaderComponent={() =>
          post ? (
            <PostDetail post={post} />
          ) : originalPost ? (
            <PostDetail post={originalPost} />
          ) : (
            <LoadingActivityView />
          )
        }
        onEndReached={() => {
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isFetchingNextPage ? LoadingActivityView : null}
        viewabilityConfigCallbackPairs={[
          { viewabilityConfig, onViewableItemsChanged },
        ]}
        ListEmptyComponent={() =>
          isLoadingComments && (!!post || !!originalPost) ? (
            <LoadingActivityView />
          ) : isError ? (
            <EmptyErrorRetry retryCalback={onErrorRetry} />
          ) : null
        }
      />
      <FAB
        icon="chevron-down"
        style={themedStyles.fab}
        onPress={scrollToNextComment}
      />
    </>
  );
};

const styles = (theme: Theme) =>
  StyleSheet.create({
    fab: {
      position: "absolute",
      margin: 16,
      right: 0,
      bottom: 0,
    },
  });
