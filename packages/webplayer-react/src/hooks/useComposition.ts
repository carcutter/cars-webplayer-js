/**
 * This file implements a simplified version of the library react-query.
 * Unexpected behavior may occur
 */

import { useEffect, useState } from "react";

import { getComposition, type Composition } from "@car-cutter/core-webplayer";

const cache = new Map<string, Composition | Promise<Composition>>();

type State =
  | {
      status: "pending" | "fetching";
      data?: never;
      isSuccess: false;
      error?: never;
    }
  | {
      status: "success";
      data: Composition;
      isSuccess: true;
      error?: never;
    }
  | {
      status: "error";
      data?: never;
      isSuccess: false;
      error: unknown;
    };

export const useComposition = (url: string) => {
  const [state, setState] = useState<State>({
    status: "pending",
    isSuccess: false,
  });

  useEffect(() => {
    const setSuccess = (data: Composition) =>
      setState({ status: "success", data, isSuccess: true });

    const cachedValue = cache.get(url);

    // If the cached value is already resolved, set it directly
    if (cachedValue && !(cachedValue instanceof Promise)) {
      setSuccess(cachedValue);
      return;
    }

    setState({
      status: "fetching",
      isSuccess: false,
    });

    // Run the query
    (async function () {
      try {
        let data: Composition;

        // using cached promise
        if (cachedValue) {
          data = await cachedValue;
        } else {
          const promise = getComposition(url);
          cache.set(url, promise);

          data = await promise;
          cache.set(url, data);
        }

        setSuccess(data);
      } catch (err) {
        setState({
          status: "error",
          isSuccess: false,
          error: err,
        });
      }
    })();
  }, [url]);

  return state;
};
