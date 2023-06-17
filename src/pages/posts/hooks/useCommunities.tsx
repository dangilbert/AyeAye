import { getCurrentUserSessionToken } from "@rn-app/pods/auth/queries";
import {
  CommunityType,
  communityQueries,
} from "@rn-app/pods/communities/queries";
import { useLemmyHttp } from "@rn-app/pods/host/useLemmyHttp";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { CommunityView, ListCommunitiesResponse } from "lemmy-js-client";

export const useCommunities = (
  communityType: CommunityType,
  userId?: string
) => {
  const { data, isLoading } = useQuery({
    ...communityQueries.communities(communityType, userId),
    select: (data) => data.communities,
  });

  const queryClient = useQueryClient();

  return {
    isLoading,
    data,
    invalidate: () => {
      queryClient.invalidateQueries({
        queryKey: communityQueries.communities(communityType, userId).queryKey,
      });
    },
  };
};

export const useCommunity = (
  communityId: number,
  communityType: CommunityType,
  userId?: string
) => {
  const { data, isLoading } = useQuery({
    ...communityQueries.communities(communityType, userId),

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

export const usePosts = (
  communityId: number,
  communityType?: CommunityType
) => {
  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      ...communityQueries.posts(communityId, communityType),
      getNextPageParam: (lastPage) => lastPage.hasNextPage && lastPage.nextPage,
    });

  const queryClient = useQueryClient();

  return {
    isLoading,
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    invalidate: () => {
      queryClient.invalidateQueries({
        queryKey: communityQueries.posts(communityId).queryKey,
      });
    },
  };
};

export const usePost = (communityId: number, postId: number) => {
  const { data, isLoading } = useQuery({
    ...communityQueries.post(postId, communityId),
  });

  const queryClient = useQueryClient();

  return {
    isLoading,
    data,
    invalidate: () => {
      queryClient.invalidateQueries({
        queryKey: communityQueries.post(communityId, postId).queryKey,
      });
    },
  };
};

export const useComments = (postId: number, communityId?: number) => {
  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      ...communityQueries.comments(postId, communityId),
      getNextPageParam: (lastPage) => lastPage.hasNextPage && lastPage.nextPage,
    });

  const queryClient = useQueryClient();

  return {
    isLoading,
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    invalidate: () =>
      queryClient.invalidateQueries({
        queryKey: communityQueries.comments(postId, communityId).queryKey,
      }),
  };
};

export const usePostComment = (
  postId: number,
  commentId?: number,
  communityId?: number
) => {
  const queryClient = useQueryClient();

  const { data, isLoading, mutate } = useMutation({
    mutationFn: async (content: string) => {
      const client = useLemmyHttp();
      const res = await client.createComment({
        post_id: postId,
        content,
        parent_id: commentId,
        auth: await getCurrentUserSessionToken(),
      });

      console.log("res", res);

      return res;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        [...communityQueries.comments(postId, communityId).queryKey],
        (oldData) => {
          console.log(oldData.pages);

          const lastCommentPage = {
            comments: [
              data.comment_view,
              ...oldData.pages[oldData.pages.length - 1].comments,
            ],
          };
          const otherCommentPages = oldData.pages.slice(
            0,
            oldData.pages.length - 1
          );

          return {
            ...oldData,
            pages: [...otherCommentPages, lastCommentPage],
          };
        }
      );
    },
  });

  return {
    isLoading,
    data,
    mutate,
  };
};
