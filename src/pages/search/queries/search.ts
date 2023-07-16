import { createQueryKeys } from "@lukemorales/query-key-factory";
import { getCurrentUserSessionToken } from "@rn-app/pods/auth/queries";
import { useLemmyHttp } from "@rn-app/pods/host/useLemmyHttp";

export const searchQueries = createQueryKeys("search", {
  searchCommunities: ({ query }: { query: string }) => ({
    queryKey: [{ query, entity: "communities" }],
    queryFn: async () => {
      const res = await useLemmyHttp().search({
        q: query,
        limit: 20,
        page: 1,
        type_: "Communities",
        auth: await getCurrentUserSessionToken(),
      });
      return {
        communities: res.communities,
      };
    },
  }),
});
