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
import { CommentView, PostView, SortType } from "lemmy-js-client";
import { useMMKVString } from "react-native-mmkv";

export const useCommunities = (
  communityType: CommunityType,
  userId?: string
) => {
  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    error,
  } = useInfiniteQuery({
    ...communityQueries.communities(communityType, userId),
    getNextPageParam: (lastPage) => lastPage.hasNextPage && lastPage.nextPage,
  });

  const queryClient = useQueryClient();

  return {
    isLoading,
    data: data?.pages?.flatMap((page) => page.communities),
    error,
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

export const useTrendingCommunities = (communityType: CommunityType) => {
  const { data, isLoading, error } = useQuery({
    ...communityQueries.trendingCommunities({ communityType }),
  });

  const queryClient = useQueryClient();

  return {
    isLoading,
    data: data?.communities,
    error,
    invalidate: () => {
      queryClient.invalidateQueries({
        queryKey: communityQueries.trendingCommunities({ communityType })
          .queryKey,
      });
    },
  };
};

export const useCommunity = (communityId: number) => {
  const { data, isLoading, error } = useQuery({
    ...communityQueries.community(communityId),
    select: (data) => data.community_view,
    enabled: !!communityId,
  });

  return {
    isLoading,
    data,
    error,
  };
};

export const useChangeSubscription = ({
  communityId,
}: {
  communityId: number;
}) => {
  const queryClient = useQueryClient();

  const { mutate, isLoading, error } = useMutation({
    mutationFn: async (subscribe: boolean) => {
      const client = useLemmyHttp();
      const res = await client.followCommunity({
        community_id: communityId,
        follow: subscribe,
        auth: await getCurrentUserSessionToken(),
      });

      return res;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries([
        ...communityQueries.communities("Subscribed").queryKey,
      ]);
      queryClient.setQueryData(
        [...communityQueries.community(communityId).queryKey],
        () => {
          return data;
        }
      );
    },
  });

  return {
    mutate,
    isLoading,
    error,
  };
};

export const useChangeCommunityBlock = ({
  communityId,
}: {
  communityId: number;
}) => {
  const queryClient = useQueryClient();

  const { mutate, isLoading, error } = useMutation({
    mutationFn: async (block: boolean) => {
      const client = useLemmyHttp();
      const res = await client.blockCommunity({
        community_id: communityId,
        block: block,
        auth: await getCurrentUserSessionToken(),
      });

      return res;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries([
        ...communityQueries.communities("Subscribed").queryKey,
      ]);
      queryClient.setQueryData(
        [...communityQueries.community(communityId).queryKey],
        () => {
          return data;
        }
      );
    },
  });

  return {
    mutate,
    isLoading,
    error,
  };
};

export const usePosts = (
  communityId: number,
  communityType?: CommunityType,
  sortType?: SortType
) => {
  const [defaultSortType] = useMMKVString("settings.post-sort-type", storage);
  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    ...communityQueries.posts({
      communityId,
      communityType,
      sortType: (sortType ?? defaultSortType) as SortType,
    }),
    getNextPageParam: (lastPage) => lastPage.hasNextPage && lastPage.nextPage,
  });

  const queryClient = useQueryClient();

  return {
    isLoading,
    data,
    error,
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
  const { data, error, isLoading } = useQuery({
    ...communityQueries.post(postId, communityId),
  });

  const queryClient = useQueryClient();

  return {
    isLoading,
    data,
    error,
    invalidate: () => {
      queryClient.invalidateQueries({
        queryKey: communityQueries.post(postId, communityId).queryKey,
      });
    },
  };
};

export const useMarkAsRead = (postId: number, communityId?: number) => {
  const queryClient = useQueryClient();

  const { isLoading, mutate } = useMutation({
    mutationFn: async () => {
      const client = useLemmyHttp();
      const res = await client.markPostAsRead({
        post_id: postId,
        read: true,
        auth: await getCurrentUserSessionToken(),
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
    isLoading,
    mutate,
  };
};

export const useComments = (postId: number, communityId?: number) => {
  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    ...communityQueries.comments(postId, communityId),
    getNextPageParam: (lastPage) => lastPage.hasNextPage && lastPage.nextPage,
  });

  const queryClient = useQueryClient();

  return {
    isLoading,
    data,
    error,
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
  const queryKey = [...communityQueries.post(postId, communityId).queryKey];

  const voteScore = (vote: "up" | "unvote" | "down"): number => {
    switch (vote) {
      case "up":
        return 1;
      case "down":
        return -1;
      case "unvote":
      default:
        return 0;
    }
  };

  const { mutate } = useMutation({
    mutationFn: async (vote: "up" | "unvote" | "down") => {
      const client = useLemmyHttp();
      const res = await client.likePost({
        post_id: postId!!,
        auth: await getCurrentUserSessionToken(),
        score: voteScore(vote),
      });

      return res;
    },
    onMutate: async (vote) => {
      await queryClient.cancelQueries(queryKey);

      const previousData = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (oldData?: PostView) => {
        if (!oldData) throw new Error("No data");
        return {
          ...oldData,
          my_vote: voteScore(vote),
          counts: {
            ...oldData.counts,
            score: oldData.counts.score + voteScore(vote),
          },
          someKey: new Date().getTime(),
        };
      });

      return { previousData };
    },
    onError: (err, vote, context) => {
      queryClient.setQueryData(queryKey, context?.previousData);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKey, () => {
        return data.post_view;
      });
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

  const queryKey = [...communityQueries.comments(postId, communityId).queryKey];

  const voteScore = (vote: "up" | "unvote" | "down"): number => {
    switch (vote) {
      case "up":
        return 1;
      case "down":
        return -1;
      case "unvote":
      default:
        return 0;
    }
  };

  const { mutate } = useMutation({
    mutationFn: async (vote: "up" | "unvote" | "down") => {
      const client = useLemmyHttp();
      const res = await client.likeComment({
        comment_id: commentId,
        auth: await getCurrentUserSessionToken(),
        score: voteScore(vote),
      });

      return res;
    },
    onMutate: async (vote) => {
      await queryClient.cancelQueries(queryKey);

      const previousData = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (oldData: any): any => {
        if (!oldData) throw new Error("No data");

        const relevantCommentPage = oldData.pages.find((page: any) =>
          page.comments.find((comment: any) => comment.comment.id === commentId)
        );

        const relevantCommentPageIndex =
          oldData.pages.indexOf(relevantCommentPage);

        relevantCommentPage.comments = relevantCommentPage.comments.map(
          (comment: CommentView) => {
            if (comment.comment.id === commentId) {
              return {
                ...comment,
                my_vote: voteScore(vote),
                counts: {
                  ...comment.counts,
                  score: comment.counts.score + voteScore(vote),
                },
              };
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
      });

      return { previousData };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKey, (oldData: any) => {
        const relevantCommentPage = oldData.pages.find((page: any) =>
          page.comments.find((comment: any) => comment.comment.id === commentId)
        );

        const relevantCommentPageIndex =
          oldData.pages.indexOf(relevantCommentPage);

        relevantCommentPage.comments = relevantCommentPage.comments.map(
          (comment: any) => {
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
      });
    },
  });

  return {
    mutate,
  };
};
