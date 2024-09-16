import { useCallback, useState } from "react";

export function useSearchParam<T extends string | boolean = string>(
  key: string,
  defaultValue: T = "" as T
): [T, (v: T) => void] {
  const queryParameters = new URLSearchParams(window.location.search);

  const [value, setValue] = useState<T>(() => {
    const v = queryParameters.get(key);

    if (!v) {
      return defaultValue;
    }

    if (typeof defaultValue === "boolean") {
      return (v === "true") as T;
    }

    return v as T;
  });

  const set = useCallback(
    (v: T) => {
      setValue(v);
      const newParams = new URLSearchParams(window.location.search);
      newParams.set(key, v.toString());
      // FUTURE: use pushState & subscribe to update params (especially for back/forward)
      window.history.replaceState(
        {},
        "",
        `${window.location.pathname}?${newParams}`
      );
    },
    [key]
  );

  return [value, set];
}
