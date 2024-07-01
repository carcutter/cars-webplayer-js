import { useMemo, useState } from "react";

import CategoryBar from "@/components/molecules/CategoryBar";
import GalleryButton from "@/components/molecules/GalleryButton";
import OptionsBar from "@/components/molecules/OptionsBar";
import WebPlayerElement from "@/components/molecules/WebPlayerElement";
import ScrollableSlider from "@/components/organisms/ScrollableSlider";
import { useComposition } from "@/hooks/useComposition";
import { useGlobalContext } from "@/providers/GlobalContext";
import { Composition, Item } from "@/types/composition";

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

const WebPlayerContainer: React.FC = () => {
  const { data, isSuccess, isError } = useComposition("/data.json");

  if (isError) {
    // TODO
    return <div>Error</div>;
  }

  if (!isSuccess) {
    // TODO
    return <div>Loading...</div>;
  }

  return <WebPlayerContent data={data} />;
};

export default WebPlayerContainer;
