import { createContext, useContext } from "react";

import type { Composition } from "@car-cutter/core";

type ContextType = Pick<
  Composition,
  "categories" | "aspectRatio" | "imageHdWidth" | "imageSubWidths"
> & {
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
  const { aspectRatio } = composition;

  const aspectRatioStyle: React.CSSProperties = {
    aspectRatio: aspectRatio.replace(":", " / "),
  };

  return (
    <CompositionContext.Provider
      value={{
        ...composition,

        aspectRatioStyle,
      }}
    >
      {children}
    </CompositionContext.Provider>
  );
};

export default CompositionContextProvider;
