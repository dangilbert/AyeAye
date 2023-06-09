import { PostCard } from "@rn-app/components/post/PostCard";
import { useCommunity, usePosts } from "../hooks/useCommunities";
import { useEffect } from "react";
import { IOScrollView, InView } from "react-native-intersection-observer";
import { ActivityIndicator, ProgressBar } from "react-native-paper";

export const CommunityScreen = ({ navigation, route }) => {
  const communityId = route.params.communityId;

  const { data: community } = useCommunity(communityId);
  const {
    data: posts,
    fetchNextPage,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
  } = usePosts(communityId);

  useEffect(() => {
    navigation.setOptions({
      title: community?.community.name ?? "<Community>",
    });
  }, [community]);

  return (
    <IOScrollView>
      {posts &&
        posts.pages.flatMap((page) => {
          return page.posts.map((post) => {
            return <PostCard key={`postcard_${post.post.id}`} post={post} />;
          });
        })}
      {!isLoading && !isFetchingNextPage && (
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
