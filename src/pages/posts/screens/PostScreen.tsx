import { LemmyHttp, PostView } from "lemmy-js-client";
import { useEffect, useState } from "react";

import { ScrollView } from "react-native";
import { PostDetail } from "@rn-app/components/post/PostDetail";

export const PostScreen = ({ route }) => {
  const postId = route.params.postId;

  const [post, setPost] = useState<PostView>();

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

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ height: "100%", padding: 10 }}
    >
      {post && (
        <PostDetail
          post={{
            id: post.post.id,
            name: post.post.name,
            body: post.post.body,
            thumbnail_url: post.post.thumbnail_url,
            url: post.post.url,
          }}
        />
      )}
    </ScrollView>
  );
};
