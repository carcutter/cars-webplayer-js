import { createContext, useContext, useMemo } from "react";

import type { Composition } from "@/types/composition";
import type { ImageWidth } from "@/types/misc";

import { useGlobalContext } from "./GlobalContext";

type ContextType = {
  compositionCategories: Composition["categories"];

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
> = ({ composition, children }) => {
  const { categoriesOrder } = useGlobalContext();

  const {
    categories: compositionUnsortedCategories,
    imageHdWidth,
    imageSubWidths,
  } = composition;

  // Sort categories based on categoriesOrder
  const compositionCategories = useMemo(() => {
    if (!categoriesOrder) {
      return compositionUnsortedCategories;
    }

    const categoriesOrderList = categoriesOrder.split("|");

    return compositionUnsortedCategories.sort((elemA, elemB) => {
      const indexA = categoriesOrderList.findIndex(cat => cat === elemA.id);
      const indexB = categoriesOrderList.findIndex(cat => cat === elemB.id);

      if (indexA === -1 && indexB !== -1) {
        return 1;
      } else if (indexA !== -1 && indexB === -1) {
        return -1;
      } else {
        return 0;
      }
    });
  }, [categoriesOrder, compositionUnsortedCategories]);

  return (
    <CompositionContext.Provider
      value={{
        compositionCategories: compositionCategories,

        imageHdWidth,
        imageSubWidths,
      }}
    >
      {children}
    </CompositionContext.Provider>
  );
};

export default CompositionContextProvider;
