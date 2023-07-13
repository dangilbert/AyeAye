import { getDataForUrl, isImgurUrl } from "@rn-app/utils/imgurUtils";
import { useQuery } from "@tanstack/react-query";

export const useImgurMedia = (url: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ["imgur", url],
    queryFn: async () => {
      if (!isImgurUrl(url)) return [{ link: url }];
      return await getDataForUrl(url);
    },
    staleTime: 1,
  });

  return {
    data,
    isLoading,
  };
};
