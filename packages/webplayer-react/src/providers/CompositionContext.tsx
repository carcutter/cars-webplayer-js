import { createContext, useContext } from "react";

import type { Composition } from "@car-cutter/core-webplayer";

type ContextType = Pick<
  Composition,
  "categories" | "aspectRatio" | "imageHdWidth" | "imageSubWidths"
> & {
  aspectRatioClass: string;
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
  const { aspectRatio } = composition;

  // Compute aspectRatioClass based on aspectRatio
  const aspectRatioClass = aspectRatio === "4:3" ? "aspect-4/3" : "aspect-16/9";

  return (
    <CompositionContext.Provider
      value={{
        ...composition,

        aspectRatioClass,
      }}
    >
      {children}
    </CompositionContext.Provider>
  );
};

export default CompositionContextProvider;
