import { useMemo, useState } from "react";

import WebPlayerElement from "@/components/molecules/WebPlayerElement";
import ScrollableSlider from "@/components/organisms/ScrollableSlider";
import { useComposition } from "@/hooks/useComposition";
import { useGlobalContext } from "@/providers/GlobalContext";
import { Composition, Item } from "@/types/composition";

import CategoryBar from "./CategoryBar";
import GalleryButton from "./GalleryButton";
import OptionsBar from "./OptionsBar";

type WebPlayerContentProps = { data: Composition };

const WebPlayerContent: React.FC<
  React.PropsWithChildren<WebPlayerContentProps>
> = ({ data }) => {
  const { flatten, maxItemsShown } = useGlobalContext();

  const [displayedCategory, setDisplayedCategory] = useState(data[0].category);

  const items: Item[] = useMemo(() => {
    if (!flatten) {
      const currrentCategoryRoot = data.find(
        ({ category }) => category === displayedCategory
      );
      if (!currrentCategoryRoot) {
        throw new Error(`Category ${displayedCategory} not found`);
      }

      return currrentCategoryRoot.items;
    }

    return data.flatMap(({ items }) => items);
  }, [flatten, data, displayedCategory]);

  const handleChangeCategory = (category: string) => {
    setDisplayedCategory(category);
  };

  return (
    <div className="relative size-full">
      <ScrollableSlider
        data={items}
        renderItem={(item, index, currentActiveIndex) => (
          <WebPlayerElement
            item={item}
            lazy={
              Math.abs(index - currentActiveIndex) > Math.ceil(maxItemsShown)
            }
          />
        )}
      />

      {/* Options overlay */}
      {!flatten && (
        <CategoryBar
          composition={data}
          selectedCategory={displayedCategory}
          onChangeSelectedCategory={handleChangeCategory}
        />
      )}
      <OptionsBar />
      <GalleryButton data={items} />
    </div>
  );
};

const WebPlayerContainer: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { data, isSuccess, isError } = useComposition("/data.json");

  if (isError) {
    // TODO
    return <div>Error</div>;
  }

  if (!isSuccess) {
    // TODO
    return <div>Loading...</div>;
  }

  return <WebPlayerContent data={data}>{children}</WebPlayerContent>;
};

export default WebPlayerContainer;
