import { useQuery } from "@tanstack/react-query";

import { getComposition } from "@car-cutter/core-webplayer";

export const useComposition = (url: string) => {
  return useQuery({
    queryKey: ["composition", url],
    queryFn: () => getComposition(url),

    retry: failureCount => failureCount < 3,
  });
};
