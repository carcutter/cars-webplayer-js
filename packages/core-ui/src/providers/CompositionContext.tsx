import { createContext, useContext, useMemo } from "react";

import type { Composition, Item, MediaWidth } from "@car-cutter/core";

import { useGlobalContext } from "./GlobalContext";

type ContextType = Pick<Composition, "categories" | "imageHdWidth"> & {
  items: Item[];

  aspectRatioStyle: React.CSSProperties;
  usedMediaWidths: MediaWidth[];
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
  const {
    aspectRatio,
    categories,
    imageHdWidth: mediaHdWidth,
    imageSubWidths: mediaSubWidths,
  } = composition;

  const { minMediaWidth, maxMediaWidth } = useGlobalContext();

  const items: Item[] = useMemo(
    () => categories.flatMap(({ items }) => items),
    [categories]
  );

  const aspectRatioStyle: React.CSSProperties = {
    aspectRatio: aspectRatio.replace(":", " / "),
  };

  const usedMediaWidths = useMemo(() => {
    const allWidths = mediaSubWidths.concat(mediaHdWidth);
    const sortedWidths = allWidths.sort((a, b) => a - b);

    // Filter out composition' widths that are not within the attribute constraints
    const fiteredWidths = sortedWidths.filter(
      width => width >= minMediaWidth && width <= maxMediaWidth
    );

    if (fiteredWidths.length === 0) {
      // Return the closer width from the constraints. Use mediaHdWidth to initialize the closestWidth in order to handle "Infinity"
      const contraintMean = (minMediaWidth + maxMediaWidth) / 2;
      const closestWidth = allWidths.reduce(
        (best, width) =>
          Math.abs(width - contraintMean) < Math.abs(best - contraintMean)
            ? width
            : best,
        mediaHdWidth
      );

      // eslint-disable-next-line no-console
      console.warn(
        `None of available media widths (${sortedWidths.join("|")}) match the given constraints (${minMediaWidth > 0 ? `${minMediaWidth} ≤ ` : ""}width${maxMediaWidth < Infinity ? ` ≤ ${maxMediaWidth}` : ""}).`,
        `Using the closest width instead (${closestWidth}).`
      );
      return [closestWidth];
    }

    return fiteredWidths;
  }, [mediaSubWidths, mediaHdWidth, minMediaWidth, maxMediaWidth]);

  return (
    <CompositionContext.Provider
      value={{
        ...composition,

        items,

        aspectRatioStyle,
        usedMediaWidths,
      }}
    >
      {children}
    </CompositionContext.Provider>
  );
};

export default CompositionContextProvider;
