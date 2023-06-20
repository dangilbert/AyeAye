import { getCurrentUserSessionToken } from "@rn-app/pods/auth/queries";
import {
  CommunityType,
  communityQueries,
} from "@rn-app/pods/communities/queries";
import { useLemmyHttp } from "@rn-app/pods/host/useLemmyHttp";
import { storage } from "@rn-app/utils/storage";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  CommunityView,
  ListCommunitiesResponse,
  SortType,
} from "lemmy-js-client";
import { useMMKVString } from "react-native-mmkv";

export const useCommunities = (
  communityType: CommunityType,
  userId?: string
) => {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      ...communityQueries.communities(communityType, userId),
      getNextPageParam: (lastPage) => lastPage.hasNextPage && lastPage.nextPage,
    });

  const queryClient = useQueryClient();

  return {
    isLoading,
    data: data?.pages?.flatMap((page) => page.communities),
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
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
  const [sortType] = useMMKVString("settings.post-sort-type", storage);
  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      ...communityQueries.posts({
        communityId,
        communityType,
        sortType: (sortType ?? "Hot") as SortType,
      }),
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
        queryKey: communityQueries.posts({
          communityId,
          communityType,
          sortType: (sortType ?? "Hot") as SortType,
        }).queryKey,
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
        queryKey: communityQueries.post(postId, communityId).queryKey,
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

  const { isLoading, mutate } = useMutation({
    mutationFn: async (content: string) => {
      const client = useLemmyHttp();
      const res = await client.createComment({
        post_id: postId,
        content,
        parent_id: commentId,
        auth: await getCurrentUserSessionToken(),
      });

      return res;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        [...communityQueries.comments(postId, communityId).queryKey],
        (oldData) => {
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
    mutate,
  };
};

export const usePostVote = (postId: number, communityId?: number) => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async (vote: "up" | "unvote" | "down") => {
      let voteScore;
      switch (vote) {
        case "up":
          voteScore = 1;
          break;
        case "down":
          voteScore = -1;
          break;
        case "unvote":
          voteScore = 0;
          break;
      }
      const client = useLemmyHttp();
      const res = await client.likePost({
        post_id: postId!!,
        auth: await getCurrentUserSessionToken(),
        score: voteScore,
      });

      return res;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        [...communityQueries.post(postId, communityId).queryKey],
        () => {
          return data.post_view;
        }
      );
    },
  });

  return {
    mutate,
  };
};

export const useCommentVote = ({
  postId,
  commentId,
  communityId,
}: {
  postId: number;
  commentId: number;
  communityId?: number;
}) => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async (vote: "up" | "unvote" | "down") => {
      let voteScore;
      switch (vote) {
        case "up":
          voteScore = 1;
          break;
        case "down":
          voteScore = -1;
          break;
        case "unvote":
          voteScore = 0;
          break;
      }

      console.log("Params in comment mutation", postId, communityId);

      const client = useLemmyHttp();
      const res = await client.likeComment({
        comment_id: commentId,
        auth: await getCurrentUserSessionToken(),
        score: voteScore,
      });

      return res;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        [...communityQueries.comments(postId, communityId).queryKey],
        (oldData) => {
          const relevantCommentPage = oldData.pages.find((page) =>
            page.comments.find((comment) => comment.comment.id === commentId)
          );

          const relevantCommentPageIndex =
            oldData.pages.indexOf(relevantCommentPage);

          relevantCommentPage.comments = relevantCommentPage.comments.map(
            (comment) => {
              if (comment.comment.id === commentId) {
                return data.comment_view;
              }

              return comment;
            }
          );

          const output = {
            ...oldData,
            pages: [
              ...oldData.pages.slice(0, relevantCommentPageIndex),
              { ...relevantCommentPage },
              ...oldData.pages.slice(relevantCommentPageIndex + 1),
            ],
          };

          return { ...output, someKey: new Date().getTime() };
        }
      );
    },
  });

  return {
    mutate,
  };
};
