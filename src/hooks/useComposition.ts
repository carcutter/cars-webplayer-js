import { useQuery } from "@tanstack/react-query";

import apiService from "@/utils/apiService";

export const useComposition = (url: string) => {
  return useQuery({
    queryKey: ["composition", url],
    queryFn: () => apiService.getComposition(url),
  });
};
