/**
 * This file implements a simplified version of the library react-query.
 * Unexpected behavior may occur
 */

import { useEffect, useState } from "react";

import { type Composition } from "@car-cutter/core";

async function getComposition(url: string): Promise<Composition> {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch composition: ${res.statusText}`);
  }

  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("json")) {
    throw new Error(
      `Unexpected response content-type "${contentType}" for composition URL: ${url}`
    );
  }

  const data = (await res.json()) as Composition;

  return data;
}

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
    if (!url) {
      setState({
        status: "error",
        isSuccess: false,
        error: new Error("No composition URL provided"),
      });
      return;
    }

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
          try {
            data = await cachedValue;
          } catch (fetchErr) {
            cache.delete(url);
            throw fetchErr;
          }
        } else {
          const promise = getComposition(url);
          cache.set(url, promise);

          try {
            data = await promise;
          } catch (fetchErr) {
            // Remove the rejected promise from cache so future
            // renders/navigations can retry instead of permanently failing.
            cache.delete(url);
            throw fetchErr;
          }
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
