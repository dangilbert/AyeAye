import { CommentView } from "lemmy-js-client";

import { PostDetail } from "@rn-app/components/post/PostDetail";
import { useComments, usePost } from "../hooks/useCommunities";
import { ActivityIndicator } from "react-native-paper";
import { CommentItem } from "@rn-app/components/comment/CommentItem";
import { FlashList } from "@shopify/flash-list";

export const PostScreen = ({ route }) => {
  const originalPost = route.params.originalPost;

  const postId = originalPost.post.id;
  const communityId = originalPost.community.id;

  const {
    data: post,
    isLoading: isLoadingPost,
    invalidate: invalidatePost,
  } = usePost(communityId, postId);
  const {
    data: comments,
    fetchNextPage,
    isLoading: isLoadingComments,
    isFetchingNextPage,
    hasNextPage,
    invalidate: invalidateComments,
  } = useComments(postId, communityId);

  const invalidate = () => {
    invalidatePost();
    invalidateComments();
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

  return (
    <FlashList
      data={post ? commentList : []}
      onRefresh={() => {
        invalidate();
      }}
      refreshing={isLoadingPost && !!post}
      estimatedItemSize={100}
      renderItem={({ item }) => {
        return (
          <CommentItem key={`commentitem_${item.comment.id}`} comment={item} />
        );
      }}
      ListHeaderComponent={() =>
        post ? (
          <PostDetail post={post} />
        ) : originalPost ? (
          <PostDetail post={originalPost} />
        ) : (
          <ActivityIndicator />
        )
      }
      onEndReached={() => {
        if (hasNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isLoadingComments || isFetchingNextPage ? ActivityIndicator : null
      }
    />
  );
};
