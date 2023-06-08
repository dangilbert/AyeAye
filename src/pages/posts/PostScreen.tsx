import { ThemedText } from "../../components/ThemedText";
import { LemmyHttp, PostView } from "lemmy-js-client";
import { useEffect, useState } from "react";

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
    <>
      {post && <ThemedText variant="subheading">{post.post.name}</ThemedText>}
      {post && <ThemedText variant="body">{post.post.body}</ThemedText>}
    </>
  );
};
