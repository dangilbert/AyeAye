import { authQueries } from "@rn-app/pods/auth/queries";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const useCurrentUserProfile = () => {
  const { data, isLoading } = useQuery({
    ...authQueries.currentUserProfile(),
  });

  const queryClient = useQueryClient();

  return {
    isLoading,
    data,
    invalidate: () => {
      queryClient.invalidateQueries({
        queryKey: authQueries.currentUserProfile().queryKey,
      });
    },
  };
};
