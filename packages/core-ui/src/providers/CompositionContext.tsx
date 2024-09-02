import { createContext, useContext, useMemo } from "react";

import type { Composition, Item } from "@car-cutter/core";

type ContextType = Pick<
  Composition,
  "categories" | "aspectRatio" | "imageHdWidth" | "imageSubWidths"
> & {
  items: Item[];

  aspectRatioStyle: React.CSSProperties;
};

const CompositionContext = createContext<ContextType | null>(null);

export const useCompositionContext = () => {
  const ctx = useContext(CompositionContext);

  if (!ctx) {
    throw new Error(
      "useCompositionContext must be used within a CompositionContextProvider"
    );
  }

  return ctx;
};

type ProviderProps = {
  composition: Composition;
};

const CompositionContextProvider: React.FC<
  React.PropsWithChildren<ProviderProps>
> = ({ composition, children }) => {
  const { aspectRatio, categories } = composition;

  const items: Item[] = useMemo(
    () => categories.flatMap(({ items }) => items),
    [categories]
  );

  const aspectRatioStyle: React.CSSProperties = {
    aspectRatio: aspectRatio.replace(":", " / "),
  };

  return (
    <CompositionContext.Provider
      value={{
        ...composition,

        items,

        aspectRatioStyle,
      }}
    >
      {children}
    </CompositionContext.Provider>
  );
};

export default CompositionContextProvider;
