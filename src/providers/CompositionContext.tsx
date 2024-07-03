import { createContext, useContext } from "react";

import { Composition, ImageWidth } from "@/types/composition";

type ContextType = {
  imageWidths: ImageWidth[];
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
> = ({ composition: { imageWidths }, children }) => {
  return (
    <CompositionContext.Provider
      value={{
        imageWidths,
      }}
    >
      {children}
    </CompositionContext.Provider>
  );
};

export default CompositionContextProvider;
