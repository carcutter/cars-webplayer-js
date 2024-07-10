import { createContext, useContext } from "react";

import type { Composition } from "@/types/composition";
import type { ImageWidth } from "@/types/misc";

type ContextType = {
  imageHdWidth: ImageWidth;
  imageSubWidths: ImageWidth[];
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
> = ({ composition: { imageHdWidth, imageSubWidths }, children }) => {
  return (
    <CompositionContext.Provider
      value={{
        imageHdWidth,
        imageSubWidths,
      }}
    >
      {children}
    </CompositionContext.Provider>
  );
};

export default CompositionContextProvider;
