import {
  authQueries,
  getCurrentUserSessionToken,
} from "@rn-app/pods/auth/queries";
import { useLemmyHttp } from "@rn-app/pods/host/useLemmyHttp";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useUserProfile = (userId?: number) => {
  const { data, isLoading } = useQuery({
    ...authQueries.userProfile(userId),
  });

  const queryClient = useQueryClient();

  return {
    isLoading,
    data,
    invalidate: () => {
      queryClient.invalidateQueries({
        queryKey: authQueries.userProfile(userId).queryKey,
      });
    },
  };
};

export const useUserPosts = (userId: number) => {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      ...authQueries.userPosts(userId),
      getNextPageParam: (lastPage) => lastPage.hasNextPage && lastPage.nextPage,
    });

  const queryClient = useQueryClient();

  return {
    isLoading,
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    invalidate: () => {
      queryClient.invalidateQueries({
        queryKey: authQueries.userPosts(userId).queryKey,
      });
    },
  };
};

export const useUserComments = (userId: number) => {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      ...authQueries.userComments(userId),
      getNextPageParam: (lastPage) => lastPage.hasNextPage && lastPage.nextPage,
    });

  const queryClient = useQueryClient();

  return {
    isLoading,
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    invalidate: () => {
      queryClient.invalidateQueries({
        queryKey: authQueries.userComments(userId).queryKey,
      });
    },
  };
};

export const useBlockPerson = ({
  personId,
  onSuccess,
}: {
  personId: number;
  onSuccess: () => void;
}) => {
  const queryClient = useQueryClient();

  const { mutate, isLoading, error } = useMutation({
    mutationFn: async (block: boolean) => {
      const client = useLemmyHttp();
      const res = await client.blockPerson({
        person_id: personId,
        block: block,
        auth: await getCurrentUserSessionToken(),
      });

      return res;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        [...authQueries.userProfile(personId).queryKey],
        () => {
          return data;
        }
      );
      onSuccess();
    },
  });

  return {
    mutate,
    isLoading,
    error,
  };
};
