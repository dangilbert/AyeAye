import { PostCard } from "@rn-app/components/post/PostCard";
import { ScrollView } from "react-native";
import { useCommunity, usePosts } from "../hooks/useCommunities";
import { useEffect } from "react";

export const CommunityScreen = ({ navigation, route }) => {
  const communityId = route.params.communityId;

  const { data: community } = useCommunity(communityId);
  const { data: posts } = usePosts(communityId);

  useEffect(() => {
    navigation.setOptions({
      title: community?.community.name ?? "<Community>",
    });
  }, [community]);

  return (
    <ScrollView>
      {posts &&
        posts.map((post) => {
          return <PostCard key={`postcard_${post.post.id}`} post={post} />;
        })}
    </ScrollView>
  );
};
