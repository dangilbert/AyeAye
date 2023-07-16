import { createQueryKeys } from "@lukemorales/query-key-factory";
import {
  CommentView,
  CommunityView,
  PostView,
  SortType,
} from "lemmy-js-client";
import { useLemmyHttp } from "../host/useLemmyHttp";
import { getCurrentUserSessionToken } from "../auth/queries";

export type CommunityType = "All" | "Subscribed" | "Local";

const getCommunitiesForUser = async ({
  communityType = "All",
  page,
  userId,
}: {
  communityType?: CommunityType;
  page: number;
  userId?: string;
}) => {
  const res = await useLemmyHttp().listCommunities({
    type_: communityType,
    limit: 49,
    page: page,
    sort: "Active",
    auth: await getCurrentUserSessionToken(),
  });

  return res;
};

const getCommunity = async ({ communityId }: { communityId: number }) => {
  const res = await useLemmyHttp().getCommunity({
    id: communityId,
    auth: await getCurrentUserSessionToken(),
  });

  return res;
};

const getPostsForCommunity = async ({
  page,
  sortType,
  communityId,
  communityType,
  userId,
  fetchedPostIds,
}: {
  page: number;
  sortType: SortType;
  communityId?: number;
  communityType?: CommunityType;
  userId?: string;
  fetchedPostIds: number[];
}) => {
  const retries = 5;

  for (let i = 0; i < retries; i++) {
    const res = await useLemmyHttp().getPosts({
      type_: communityType ?? "All",
      community_id: communityId,
      page: page + i,
      limit: 25,
      auth: await getCurrentUserSessionToken(),
      sort: sortType,
    });

    if (res.posts.length === 0) {
      // We've reached the end of the posts
      return res;
    }

    const filteredResult = {
      ...res,
      posts: res.posts.filter((post) => !fetchedPostIds.includes(post.post.id)),
    };

    if (filteredResult.posts.length > 0) {
      // We have some content to show, so return, but also update the page number
      return {
        ...filteredResult,
        page: page + i,
      };
    }

    if (i === retries - 1) {
      // We've reached the end of the posts
      return res;
    }
  }
};

const getCommentsForPost = async (
  page: number,
  postId?: number,
  communityId?: number,
  userId?: string
) => {
  return await useLemmyHttp().getComments({
    // type_: "All",
    community_id: communityId,
    post_id: postId,
    page: page,
    max_depth: 10,
    limit: 1,
    auth: await getCurrentUserSessionToken(),
    // sort: "Hot",
  });
};

export const communityQueries = createQueryKeys("communities", {
  communities: (communityType?: CommunityType, userId?: string) => ({
    queryKey: [{ communityType, userId, entity: "communities" }],
    queryFn: async ({
      pageParam = 1,
    }): Promise<{
      nextPage: number;
      hasNextPage: Boolean;
      communities: CommunityView[];
    }> => {
      const res = await getCommunitiesForUser({
        communityType,
        userId,
        page: pageParam,
      });
      return {
        ...res,
        nextPage: pageParam + 1,
        hasNextPage: res.communities.length > 0,
      };
    },
  }),
  trendingCommunities: ({
    communityType,
  }: {
    communityType: CommunityType;
  }) => ({
    queryKey: [{ entity: "trendingCommunities" }],
    queryFn: async () => {
      const res = await useLemmyHttp().listCommunities({
        type_: communityType,
        limit: 5,
        page: 1,
        sort: "Active",
        auth: await getCurrentUserSessionToken(),
      });
      return res;
    },
  }),
  community: (communityId: number) => ({
    queryKey: [{ communityId, entity: "community" }],
    queryFn: async () => await getCommunity({ communityId }),
  }),
  post: (postId: number, communityId?: number, userId?: string) => ({
    queryKey: [{ communityId, postId, entity: "post" }],
    queryFn: async () => {
      const res = (
        await useLemmyHttp().getPost({
          id: postId,
          auth: await getCurrentUserSessionToken(),
        })
      ).post_view;
      return res;
    },
  }),
  posts: ({
    communityId,
    communityType,
    userId,
    sortType,
  }: {
    communityId?: number;
    communityType?: CommunityType;
    userId?: string;
    sortType: SortType;
  }) => ({
    queryKey: [
      { communityId, communityType, userId, sortType, entity: "posts" },
    ],
    queryFn: async ({
      pageParam = { page: 1, fetchedPostIds: [] },
    }): Promise<{
      nextPage: { page: number; fetchedPostIds: number[] };
      hasNextPage: Boolean;
      posts: PostView[];
    }> => {
      const res = await getPostsForCommunity({
        page: pageParam.page,
        sortType,
        communityId,
        communityType,
        userId,
        fetchedPostIds: pageParam.fetchedPostIds,
      });
      return {
        ...res,
        nextPage: {
          page: !!res.page ? res.page + 1 : pageParam.page + 1,
          fetchedPostIds:
            pageParam.fetchedPostIds + res.posts.map((p) => p.post.id),
        },
        hasNextPage: res.posts.length > 0,
      };
    },
  }),
  comments: (postId: number, communityId?: number, userId?: string) => ({
    queryKey: [{ communityId, postId, userId, entity: "comments" }],
    queryFn: async ({
      pageParam = 1,
    }): Promise<{
      nextPage: number;
      hasNextPage: Boolean;
      comments: CommentView[];
    }> => {
      try {
        const res = await getCommentsForPost(
          pageParam,
          postId,
          communityId,
          userId
        );
        return {
          ...res,
          nextPage: pageParam + 1,
          // It looks like `page` does nothing on this request. Disabling pagination for now.
          hasNextPage: false, //res.comments.length > 0,
        };
      } catch (e) {
        console.log(e);
        return {
          nextPage: pageParam + 1,
          hasNextPage: false,
          comments: [],
        };
      }
    },
  }),
});
