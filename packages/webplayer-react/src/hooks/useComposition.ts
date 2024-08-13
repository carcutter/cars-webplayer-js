import { useQuery } from "@tanstack/react-query";
import { ZodError } from "zod";

import { getComposition } from "@/utils/car-cutter";

export const useComposition = (url: string) => {
  return useQuery({
    queryKey: ["composition", url],
    queryFn: () => getComposition(url),

    retry: (failureCount, error) => {
      // Do not retry if the error is a ZodError
      if (error instanceof ZodError) {
        return false;
      }

      return failureCount < 3;
    },
  });
};
