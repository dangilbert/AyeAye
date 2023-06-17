import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useLemmyHttp } from "../host/useLemmyHttp";
import { getCurrentUserSessionToken } from "../auth/queries";
import { PrivateMessageView } from "lemmy-js-client";

const getInboxForUser = async ({ page }: { page: number }) => {
  return await useLemmyHttp().getPrivateMessages({
    auth: await getCurrentUserSessionToken(),
    page: page,
  });
};

export const messagingQueries = createQueryKeys("messaging", {
  inbox: () => ({
    queryKey: [{ entity: "inbox" }],
    queryFn: async ({
      pageParam = 1,
    }): Promise<{
      nextPage: number;
      hasNextPage: Boolean;
      private_messages: PrivateMessageView[];
    }> => {
      const res = await getInboxForUser({ page: pageParam });
      return {
        ...res,
        nextPage: pageParam + 1,
        hasNextPage: res.private_messages.length > 0,
      };
    },
  }),
});
