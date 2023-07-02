import { authQueries } from "@rn-app/pods/auth/queries";
import { useQuery, useQueryClient } from "@tanstack/react-query";

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
