import { useMemo, useState } from "react";

import CategoryBar from "@/components/molecules/CategoryBar";
import OptionsBar from "@/components/molecules/OptionsBar";
import WebPlayerElement from "@/components/molecules/WebPlayerElement";
import ScrollableSlider from "@/components/organisms/ScrollableSlider";
import ErrorTemplate from "@/components/template/ErrorTemplate";
import { useComposition } from "@/hooks/useComposition";
import CompositionContextProvider from "@/providers/CompositionContext";
import { useGlobalContext } from "@/providers/GlobalContext";
import { Composition, Item } from "@/types/composition";

type WebPlayerContentProps = { composition: Composition };

const WebPlayerContent: React.FC<
  React.PropsWithChildren<WebPlayerContentProps>
> = ({ composition }) => {
  const { elements: compositionElements } = composition;

  const { flatten, itemsShown } = useGlobalContext();

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

  return (
    <CompositionContextProvider composition={composition}>
      <div className="relative size-full">
        <ScrollableSlider
          data={items}
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
        <OptionsBar length={items.length} />
      </div>
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
    return <ErrorTemplate title="Failed to fetch composition" error={error} />;
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
