import { useQuery } from "@tanstack/react-query";
import { searchQueries } from "../queries/search";
import { useThrottle } from "@uidotdev/usehooks";

export const useSearchCommunities = ({ query }: { query: string }) => {
  if (query.length < 2)
    return { data: undefined, error: undefined, isLoading: false };
  const queryString = useThrottle(query);
  const { data, error, isLoading } = useQuery({
    ...searchQueries.searchCommunities({ query: queryString }),
  });

  return { data, error, isLoading };
};
