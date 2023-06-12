import { createQueryKeys } from "@lukemorales/query-key-factory";
import { CommentView, LemmyHttp, PostView } from "lemmy-js-client";
import { getCurrentAuthToken, useLemmyHttp } from "../host/useLemmyHttp";

const getCommunitiesForUser = async (
  userId?: string,
  communityType: "All" | "Subscribed" = "All"
) => {
  return await useLemmyHttp().listCommunities({
    type_: communityType,
    limit: 25,
    sort: "Active",
    auth: getCurrentAuthToken(),
  });
};

const getPostsForCommunity = async (
  page: number,
  communityId?: number,
  userId?: string
) => {
  return await useLemmyHttp().getPosts({
    type_: "All",
    community_id: communityId,
    page: page,
    limit: 25,
    auth: getCurrentAuthToken(),
  });
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
    auth: getCurrentAuthToken(),
    // sort: "Hot",
  });
};

export const communityQueries = createQueryKeys("communities", {
  communities: (userId?: string) => ({
    queryKey: [{ userId, entity: "communities" }],
    queryFn: () => getCommunitiesForUser(userId),
  }),
  post: (postId: number, communityId?: number, userId?: string) => ({
    queryKey: [{ communityId, postId, userId, entity: "post" }],
    queryFn: async () => {
      const res = (
        await useLemmyHttp().getPost({
          id: postId,
          auth: getCurrentAuthToken(),
        })
      ).post_view;
      return res;
    },
  }),
  posts: (
    communityId?: number,
    communityType?: "All" | "Subscribed" | "Local",
    userId?: string
  ) => ({
    queryKey: [{ communityId, communityType, userId, entity: "posts" }],
    queryFn: async ({
      pageParam = 1,
    }): Promise<{
      nextPage: number;
      hasNextPage: Boolean;
      posts: PostView[];
    }> => {
      const res = await getPostsForCommunity(pageParam, communityId, userId);
      return {
        ...res,
        nextPage: pageParam + 1,
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
