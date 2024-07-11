/**
 * This file mocks the react-query library to provide a simplified version of the library and reduce the bundle size.
 * Unexpected behavior may occur
 *
 * Not implemented:
 * - Cache invalidation (e.g. refetching/updating queries data). But as our data is static, we don't need it.
 */

import type { useQuery, QueryObserverResult } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useRef, useState } from "react";

class QueryClient {
  constructor() {}
}

type ContextType = {
  cache: Map<string, unknown | Promise<unknown>>;
};

const QueryClientContext = createContext<ContextType | null>(null);

export const useQueryClientContext = () => {
  const ctx = useContext(QueryClientContext);

  if (!ctx) {
    throw new Error(
      "useQueryClientContext must be used within a QueryClientProvider"
    );
  }

  return ctx;
};

const QueryClientProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const cacheRef = useRef(new Map<string, unknown | Promise<unknown>>());

  return (
    <QueryClientContext.Provider value={{ cache: cacheRef.current }}>
      {children}
    </QueryClientContext.Provider>
  );
};

// Extract the attributes we use from React-Query
type MockQueryObserverResult<TData, TError> = Pick<
  QueryObserverResult<TData, TError>,
  "status" | "data" | "isSuccess" | "error"
>;

function useQueryMock<TData = unknown, TError = unknown>(
  options: Parameters<typeof useQuery<TData, TError>>[0]
): MockQueryObserverResult<TData, TError> {
  const { queryKey, queryFn } = options;

  const { cache } = useQueryClientContext();

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

    const setSuccess = (data: TData) =>
      setState({ status: "success", data, isSuccess: true, error: null });

    const cachedValue = cache.get(queryKeyStr) as
      | TData
      | Promise<TData>
      | undefined;

    // If the cached value is already resolved, set it directly
    if (cachedValue && !(cachedValue instanceof Promise)) {
      setSuccess(cachedValue);
      return;
    }

    setState({
      status: "pending",
      data: undefined,
      isSuccess: false,
      error: null,
    });

    const controller = new AbortController();

    // Run the query
    (async function () {
      try {
        let data: TData;

        // using cached promise
        if (cachedValue) {
          data = await cachedValue;
        } else {
          const promise = queryFn({
            ...options,
            signal: controller.signal,
            meta: undefined,
          });
          cache.set(queryKeyStr, promise);

          data = await promise;
          cache.set(queryKeyStr, data);
        }

        setSuccess(data);
      } catch (err) {
        setState({
          status: "error",
          data: undefined,
          isSuccess: false,
          error: err as TError,
        });
      }
    })();

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKeyStr]);

  return state;
}

export { QueryClient, QueryClientProvider, useQueryMock as useQuery };
