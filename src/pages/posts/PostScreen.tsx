import { ThemedText } from "../../components/ThemedText";
import { LemmyHttp, PostView } from "lemmy-js-client";
import { useEffect, useState } from "react";

import { ScrollView, StyleSheet } from "react-native";
import { Theme, useTheme } from "../../theme";
import { PostDetail } from "../../components/post/PostDetail";

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
          }}
        />
      )}
    </ScrollView>
  );
};
