import { useQuery } from "@tanstack/react-query";
import { ZodError } from "zod";

import apiService from "@/utils/apiService";

export const useComposition = (url: string) => {
  return useQuery({
    queryKey: ["composition", url],
    queryFn: () => apiService.getComposition(url),

    retry: (failureCount, error) => {
      // Do not retry if the error is a ZodError
      if (error instanceof ZodError) {
        return false;
      }

      return failureCount < 3;
    },
  });
};
