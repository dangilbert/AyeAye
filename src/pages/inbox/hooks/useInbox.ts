import { useCurrentUser } from "@rn-app/pages/account/hooks/useAccount";
import { messagingQueries } from "@rn-app/pods/messaging/queries";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

export const useInbox = () => {
  const currentUser = useCurrentUser({ enabled: true });

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      ...messagingQueries.inbox(),
      getNextPageParam: (lastPage) => lastPage.hasNextPage && lastPage.nextPage,
      enabled: !!currentUser,
    });

  const queryClient = useQueryClient();

  return {
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    data,
    invalidate: () => {
      queryClient.invalidateQueries({
        queryKey: messagingQueries.inbox().queryKey,
      });
    },
  };
};
