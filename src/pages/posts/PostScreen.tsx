import { ThemedText } from "../../components/ThemedText";
import { LemmyHttp, PostView } from "lemmy-js-client";
import { useEffect, useState } from "react";
import Markdown from "react-native-markdown-displayer";
import { ScrollView } from "react-native";

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
        <ThemedText variant="subheading">
          <Markdown>{post.post.name}</Markdown>
        </ThemedText>
      )}
      {post && (
        <ThemedText variant="body">
          <Markdown>{post.post.body}</Markdown>
        </ThemedText>
      )}
    </ScrollView>
  );
};
