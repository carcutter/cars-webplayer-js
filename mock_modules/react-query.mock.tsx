import type { useQuery, QueryObserverResult } from "@tanstack/react-query";
import { useEffect, useState } from "react";

type MockQueryObserverResult<TData, TError> = Pick<
  QueryObserverResult<TData, TError>,
  "status" | "data" | "isSuccess" | "error"
>;

class QueryClient {
  constructor() {}
}

const QueryClientProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return children;
};

function useQueryMock<TData = unknown, TError = unknown>(
  options: Parameters<typeof useQuery<TData, TError>>[0]
): MockQueryObserverResult<TData, TError> {
  const { queryKey, queryFn } = options;

  const [state, setState] = useState<MockQueryObserverResult<TData, TError>>({
    status: "pending",
    data: undefined,
    isSuccess: false,
    error: null,
  });

  const queryKeyStr = JSON.stringify(queryKey);

  useEffect(() => {
    if (typeof queryFn !== "function") {
      return;
    }

    (async () => {
      setState({
        status: "pending",
        data: undefined,
        isSuccess: false,
        error: null,
      });

      try {
        const controller = new AbortController();

        const data = await queryFn({
          ...options,
          signal: controller.signal,
          meta: undefined,
        });
        setState({ status: "success", data, isSuccess: true, error: null });
      } catch (err) {
        setState({
          status: "error",
          data: undefined,
          isSuccess: false,
          error: err as TError,
        });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKeyStr]);

  return state;
}

export { QueryClient, QueryClientProvider, useQueryMock as useQuery };
