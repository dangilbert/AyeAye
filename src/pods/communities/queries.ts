import { createQueryKeys } from "@lukemorales/query-key-factory";
import { GetPostResponse, LemmyHttp, PostView } from "lemmy-js-client";

const getCommunitiesForUser = async (
  userId?: string,
  communityType: "All" | "Subscribed" = "All"
) => {
  const client: LemmyHttp = new LemmyHttp("https://lemmy.ml");
  return await client.listCommunities({
    type_: communityType,
    // TODO get the auth to list the communities for a user
    // auth: auth
  });
};

const getPostsForCommunity = async (
  page: number,
  communityId?: number,
  userId?: string
) => {
  const client: LemmyHttp = new LemmyHttp("https://lemmy.ml");
  return await client.getPosts({
    type_: "All",
    community_id: communityId,
    page: page,
  });
};

export const communityQueries = createQueryKeys("communities", {
  communities: (userId?: string) => ({
    queryKey: [{ userId, entity: "communities" }],
    queryFn: () => getCommunitiesForUser(userId),
  }),
  posts: (
    communityId?: number,
    communityType?: "All" | "Subscribed",
    userId?: string
  ) => ({
    queryKey: [{ communityId, communityType, userId, entity: "posts" }],
    queryFn: async ({
      pageParam = 1,
    }): Promise<{ nextPage: number; posts: PostView[] }> => {
      const res = await getPostsForCommunity(pageParam, communityId, userId);
      return {
        ...res,
        nextPage: pageParam + 1,
      };
    },
  }),
});
