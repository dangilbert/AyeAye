import { CommentView, LemmyHttp, PostView } from "lemmy-js-client";
import { useEffect, useState } from "react";

import { PostDetail } from "@rn-app/components/post/PostDetail";
import { useComments } from "../hooks/useCommunities";
import { IOScrollView, InView } from "react-native-intersection-observer";
import { ActivityIndicator } from "react-native-paper";
import { CommentItem } from "@rn-app/components/comment/CommentItem";

export const PostScreen = ({ route }) => {
  const postId = route.params.postId;

  const [post, setPost] = useState<PostView>();
  const {
    data: comments,
    fetchNextPage,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
  } = useComments(postId, post?.community.id);

  console.log(
    "Post",
    post && {
      id: post.post.id,
      embed_title: post.post.embed_title,
      embed_description: post.post.embed_description,
      embed_video_url: post.post.embed_video_url,
      thumbnail_url: post.post.thumbnail_url,
      url: post.post.url,
      ap_id: post.post.ap_id,
    }
  );

  useEffect(() => {
    (async () => {
      try {
        let client: LemmyHttp = new LemmyHttp("https://lemmy.ml");
        const res = await client.getPost({
          id: postId,
        });

        setPost(res.post_view);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [setPost]);

  const commentMap: Map<number, CommentView[]> = comments?.pages
    .flatMap((page) => page.comments)
    ?.reduce((commentMap, comment) => {
      const parentId = parseInt(comment.comment.path.split(".").slice(-2)[0]);
      commentMap[parentId] = commentMap[parentId] ?? [];
      commentMap[parentId].push(comment);
      return commentMap;
    }, new Map());

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
    <IOScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ height: "100%", paddingHorizontal: 10 }}
    >
      {post && <PostDetail post={post} />}
      {post &&
        commentList &&
        commentList.map((comment) => {
          return (
            <CommentItem
              key={`commentitem_${comment.comment.id}`}
              comment={comment}
            />
          );
        })}
      {!isLoading && !isFetchingNextPage && hasNextPage && (
        <InView
          style={{ height: 50 }}
          onChange={(inView: boolean) => {
            inView && fetchNextPage();
          }}
        />
      )}
      {(isLoading || isFetchingNextPage) && (
        <ActivityIndicator style={{ height: 50 }} />
      )}
    </IOScrollView>
  );
};
