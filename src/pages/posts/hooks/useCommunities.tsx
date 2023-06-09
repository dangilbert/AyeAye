import { communityQueries } from "@rn-app/pods/communities/queries";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { CommunityView, ListCommunitiesResponse } from "lemmy-js-client";

export const useCommunities = (userId?: string) => {
  const { data, isLoading } = useQuery({
    ...communityQueries.communities(userId),
    select: (data) => data.communities,
  });

  return {
    isLoading,
    data,
  };
};

export const useCommunity = (communityId: number, userId?: string) => {
  const { data, isLoading } = useQuery({
    ...communityQueries.communities(userId),

    select: (data: ListCommunitiesResponse) =>
      data.communities.find(
        (community: CommunityView) => community.community.id === communityId
      ),
  });

  return {
    isLoading,
    data,
  };
};

export const usePosts = (communityId: number) => {
  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      ...communityQueries.posts(communityId),
      getNextPageParam: (lastPage) => lastPage.hasNextPage && lastPage.nextPage,
    });

  return {
    isLoading,
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  };
};
