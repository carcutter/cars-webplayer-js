import { useQuery } from "@tanstack/react-query";

import apiService from "../apiService";

export const useComposition = (url: string) => {
  return useQuery({
    queryKey: ["composition", url],
    queryFn: () => apiService.getComposition(url),
  });
};
