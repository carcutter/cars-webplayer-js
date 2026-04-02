import { useCallback, useState } from "react";

export function useSearchParam<T extends string | boolean = string>(
  key: string,
  defaultValue: T = "" as T
): [T, (v: T) => void, boolean] {
  const queryParameters = new URLSearchParams(window.location.search);
  const queryParam = queryParameters.get(key);

  const [value, setValue] = useState<T>(() => {
    if (!queryParam) {
      return defaultValue;
    }

    if (typeof defaultValue === "boolean") {
      return (queryParam === "true") as T;
    }

    return queryParam as T;
  });

  const [isDefault, setIsDefault] = useState(value === defaultValue);

  const set = useCallback(
    (v: T) => {
      const isNextDefault = v === defaultValue;

      setValue(v);
      setIsDefault(isNextDefault);

      const newParams = new URLSearchParams(window.location.search);

      const vString = v.toString();

      if (isNextDefault || !vString) {
        newParams.delete(key);
      } else {
        newParams.set(key, v.toString());
      }

      const urlSegments = [window.location.pathname];

      const newParamsString = newParams.toString();

      if (newParamsString) {
        urlSegments.push(newParamsString);
      }

      // FUTURE: use pushState & subscribe to update params (especially for back/forward)
      window.history.replaceState({}, "", urlSegments.join("?"));
    },
    [defaultValue, key]
  );

  return [value, set, isDefault];
}
