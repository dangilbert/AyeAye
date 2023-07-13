import { PostCard } from "@rn-app/components/post/PostCard";
import { useCommunity, usePosts } from "../hooks/useCommunities";
import { useCallback, useEffect, useRef, useState } from "react";
import { FlashList } from "@shopify/flash-list";
import FastImage, { Source } from "react-native-fast-image";
import { PostSortTypeSelector } from "@rn-app/components/filter/PostSortTypeSelector";
import { View } from "react-native";
import { CommunityOverflowMenu } from "@rn-app/components/community/CommunityOverflowMenu";
import { LoadingActivityView } from "@rn-app/components/feed/LoadingActivityView";
import { EndOfContentView } from "@rn-app/components/feed/EndOfContentView";
import { EmptyErrorRetry } from "@rn-app/components/feed/EmptyErrorRetry";
import { PostView, SortType } from "lemmy-js-client";
import { useStringSetting } from "@rn-app/hooks/useSetting";

export const CommunityScreen = ({ navigation, route }) => {
  const communityId = route.params.communityId;
  const communityType = route.params.communityType;
  const flashListRef = useRef<FlashList<PostView>>(null);

  const { value: defaultSortType } = useStringSetting(
    "community_default_sort_type"
  );
  const [sortType, setSortType] = useState<SortType>(
    defaultSortType as unknown as SortType
  );

  const { data: community, error: communityError } = useCommunity(communityId);
  const {
    data: posts,
    error: postsError,
    fetchNextPage,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    invalidate,
  } = usePosts(communityId, communityType, sortType);

  posts &&
    FastImage.preload(
      posts.pages
        .flatMap((page) => page.posts)
        .map((post) =>
          post.post.thumbnail_url ? { uri: post.post.thumbnail_url } : undefined
        )
        .filter((x) => !!x) as Source[]
    );

  const onChangeSortType = useCallback(
    (sortType: SortType) => {
      flashListRef.current?.scrollToIndex({ animated: false, index: 0 });
      setSortType(sortType);
      invalidate();
    },
    [flashListRef]
  );

  useEffect(() => {
    navigation.setOptions({
      title:
        community?.community.title ??
        community?.community.name ??
        communityType,
      headerRight: () => (
        <View style={{ flexDirection: "row" }}>
          <PostSortTypeSelector value={sortType} onChange={onChangeSortType} />
          {community && <CommunityOverflowMenu community={community} />}
        </View>
      ),
    });
  }, [community, sortType]);

  const isError = !!communityError || !!postsError;

  if (isError && !posts) {
    return (
      <EmptyErrorRetry
        retryCalback={function (): void {
          invalidate();
        }}
      />
    );
  }

  return (
    <>
      <FlashList
        ref={flashListRef}
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
        ListHeaderComponent={() =>
          isLoading && !posts ? <LoadingActivityView /> : null
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            LoadingActivityView
          ) : !hasNextPage && !isLoading && !isFetchingNextPage && posts ? (
            <EndOfContentView />
          ) : null
        }
        ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
        ListEmptyComponent={() =>
          !isLoading && !isFetchingNextPage && !!isError ? (
            <EndOfContentView />
          ) : null
        }
      />
    </>
  );
};
