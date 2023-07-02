import { PostCard } from "@rn-app/components/post/PostCard";
import { useCommunity, usePosts } from "../hooks/useCommunities";
import { useEffect } from "react";
import { ActivityIndicator } from "react-native-paper";
import { FlashList } from "@shopify/flash-list";
import FastImage, { Source } from "react-native-fast-image";
import { PostSortTypeSelector } from "@rn-app/components/filter/PostSortTypeSelector";
import { View } from "react-native";
import { CommunityOverflowMenu } from "@rn-app/components/community/CommunityOverflowMenu";
import { LoadingActivityView } from "@rn-app/components/feed/LoadingActivityView";
import { EndOfContentView } from "@rn-app/components/feed/EndOfContentView";

export const CommunityScreen = ({ navigation, route }) => {
  const communityId = route.params.communityId;
  const communityType = route.params.communityType;

  const { data: community } = useCommunity(communityId, communityType);
  const {
    data: posts,
    fetchNextPage,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    invalidate,
  } = usePosts(communityId, communityType);

  posts &&
    FastImage.preload(
      posts.pages
        .flatMap((page) => page.posts)
        .map((post) =>
          post.post.thumbnail_url ? { uri: post.post.thumbnail_url } : undefined
        )
        .filter((x) => !!x) as Source[]
    );

  useEffect(() => {
    navigation.setOptions({
      title:
        community?.community.title ??
        community?.community.name ??
        communityType,
      headerRight: () => (
        <View style={{ flexDirection: "row" }}>
          <PostSortTypeSelector />
          {community && <CommunityOverflowMenu community={community} />}
        </View>
      ),
    });
  }, [community]);

  return (
    <>
      <FlashList
        data={posts?.pages.flatMap((page) => page.posts)}
        onRefresh={() => {
          invalidate();
        }}
        refreshing={isLoading && !!posts}
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
        ListHeaderComponent={() =>
          isLoading && !posts ? <LoadingActivityView /> : null
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            LoadingActivityView
          ) : !hasNextPage && !isLoading && !isFetchingNextPage ? (
            <EndOfContentView />
          ) : null
        }
        ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
      />
    </>
  );
};
