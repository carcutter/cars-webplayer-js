import { useEffect, useMemo, useState } from "react";
import { ZodError } from "zod";

import CloseButton from "@/components/atoms/CloseButton";
import CategoryBar from "@/components/molecules/CategoryBar";
import OptionsBar from "@/components/molecules/OptionsBar";
import WebPlayerElement from "@/components/molecules/WebPlayerElement";
import ScrollableSlider from "@/components/organisms/ScrollableSlider";
import ErrorTemplate from "@/components/template/ErrorTemplate";
import { useComposition } from "@/hooks/useComposition";
import CompositionContextProvider from "@/providers/CompositionContext";
import { useGlobalContext } from "@/providers/GlobalContext";
import type { Composition, Item } from "@/types/composition";

type WebPlayerContentProps = { composition: Composition };

const WebPlayerContent: React.FC<
  React.PropsWithChildren<WebPlayerContentProps>
> = ({ composition }) => {
  const {
    categoriesOrder,
    flatten,
    itemsShown,
    extendMode,
    disableExtendMode,
  } = useGlobalContext();

  const { elements: compositionUnsortedElements } = composition;

  // Sort elements based on categoriesOrder
  const compositionElements = useMemo(() => {
    if (!categoriesOrder) {
      return compositionUnsortedElements;
    }

    const categories = categoriesOrder.split("|");

    return compositionUnsortedElements.sort((elemA, elemB) => {
      const indexA = categories.findIndex(cat => cat === elemA.category);
      const indexB = categories.findIndex(cat => cat === elemB.category);

      if (indexA === -1 && indexB !== -1) {
        return 1;
      } else if (indexA !== -1 && indexB === -1) {
        return -1;
      } else {
        return 0;
      }
    });
  }, [categoriesOrder, compositionUnsortedElements]);

  // Handle escape key to disable extend mode
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        disableExtendMode();
      }
    };

    addEventListener("keydown", handleKeyDown);

    return () => {
      removeEventListener("keydown", handleKeyDown);
    };
  }, [disableExtendMode]);

  const [displayedCategory, setDisplayedCategory] = useState(
    compositionElements[0].category
  );

  const items: Item[] = useMemo(() => {
    if (!flatten) {
      const currrentElement = compositionElements.find(
        ({ category }) => category === displayedCategory
      );
      if (!currrentElement) {
        throw new Error(`Element ${displayedCategory} not found`);
      }

      return currrentElement.items;
    }

    return compositionElements.flatMap(({ items }) => items);
  }, [flatten, compositionElements, displayedCategory]);

  const handleChangeCategory = (category: string) => {
    setDisplayedCategory(category);
  };

  const ExtendWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
    if (!extendMode) {
      return children;
    }

    return (
      <div className="fixed inset-0 z-overlay flex flex-col items-center justify-center bg-foreground/85">
        {children}
        <CloseButton onClick={disableExtendMode} />
      </div>
    );
  };
  return (
    <CompositionContextProvider composition={composition}>
      <ExtendWrapper>
        <div className="relative h-fit">
          <ScrollableSlider
            items={items}
            renderItem={(item, index, currentActiveIndex) => (
              <WebPlayerElement
                item={item}
                lazy={
                  Math.abs(index - currentActiveIndex) > Math.ceil(itemsShown)
                }
              />
            )}
          />
          {/* Options overlay */}
          {!flatten && (
            <CategoryBar
              composition={composition}
              selectedCategory={displayedCategory}
              onChangeSelectedCategory={handleChangeCategory}
            />
          )}
          <OptionsBar dataLength={items.length} />
        </div>
      </ExtendWrapper>
    </CompositionContextProvider>
  );
};

type WebPlayerContainerProps = {
  compositionUrl: string;
};

const WebPlayerContainer: React.FC<WebPlayerContainerProps> = ({
  compositionUrl,
}) => {
  const {
    data: composition,
    isSuccess,
    error,
  } = useComposition(compositionUrl);

  if (error) {
    return (
      <ErrorTemplate
        title="Failed to fetch composition"
        error={error instanceof ZodError ? error.issues : error}
      />
    );
  }

  if (!isSuccess) {
    // TODO
    return (
      <div className="flex items-center justify-center">
        Loading WebPlayer...
      </div>
    );
  }

  return <WebPlayerContent composition={composition} />;
};

export default WebPlayerContainer;
