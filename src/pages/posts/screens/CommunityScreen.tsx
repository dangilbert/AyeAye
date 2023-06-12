import { PostCard } from "@rn-app/components/post/PostCard";
import { useCommunity, usePosts } from "../hooks/useCommunities";
import { useEffect } from "react";
import { ActivityIndicator } from "react-native-paper";
import { FlashList } from "@shopify/flash-list";

export const CommunityScreen = ({ navigation, route }) => {
  const communityId = route.params.communityId;

  const { data: community } = useCommunity(communityId);
  const {
    data: posts,
    fetchNextPage,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    invalidate,
  } = usePosts(communityId);

  useEffect(() => {
    navigation.setOptions({
      title: community?.community.name ?? "<Community>",
    });
  }, [community]);

  return (
    <FlashList
      data={posts?.pages.flatMap((page) => page.posts)}
      onRefresh={() => {
        invalidate();
      }}
      refreshing={isLoading}
      estimatedItemSize={60}
      renderItem={({ item }) => {
        return <PostCard key={`postcard_${item.post.id}`} post={item} />;
      }}
      onEndReached={() => {
        if (hasNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={isFetchingNextPage ? ActivityIndicator : null}
    />
  );
};
