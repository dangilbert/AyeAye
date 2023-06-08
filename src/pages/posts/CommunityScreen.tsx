import { ThemedText } from "../../components/ThemedText";
import { LemmyHttp, PostView } from "lemmy-js-client";
import { useEffect, useState } from "react";
import { PostCard } from "../../components/post/PostCard";
import { ScrollView } from "react-native";

export const CommunityScreen = ({ navigation, route }) => {
  const communityId = route.params.communityId;
  const [posts, setPosts] = useState<PostView[]>();
  // TODO set up react query caching to get the community detailsg
  // const [communityName, setCommunityName] = useState<string>();

  useEffect(() => {
    (async () => {
      try {
        let client: LemmyHttp = new LemmyHttp("https://lemmy.ml");
        const res = await client.getPosts({
          type_: "All",
          community_id: communityId,
        });

        setPosts(res.posts);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [setPosts]);

  return (
    <ScrollView>
      {posts &&
        posts.map((post) => {
          return <PostCard post={post} />;
        })}
    </ScrollView>
  );
};
