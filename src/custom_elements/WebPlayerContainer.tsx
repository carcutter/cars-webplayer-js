import { useState } from "react";

import WebPlayerElement from "@/components/molecules/WebPlayerElement";
import ScrollableSlider from "@/components/organisms/ScrollableSlider";
import { useComposition } from "@/hooks/useComposition";
import { useGlobalContext } from "@/providers/GlobalContext";
import { Composition } from "@/types/composition";

import GalleryButton from "./GalleryButton";
import OptionsBar from "./OptionsBar";

type WebPlayerContentProps = { data: Composition };

const WebPlayerContent: React.FC<
  React.PropsWithChildren<WebPlayerContentProps>
> = ({ data }) => {
  const { aspectRatioClass } = useGlobalContext();

  const [displayedCategory, setDisplayedCategory] = useState(data[0].category);

  const currrentCategoryRoot = data.find(
    ({ category }) => category === displayedCategory
  );
  if (!currrentCategoryRoot) {
    throw new Error(`Category ${displayedCategory} not found`);
  }

  const { items } = currrentCategoryRoot;

  const handleChangeCategory = (category: string) => {
    setDisplayedCategory(category);
  };

  return (
    // TODO: Implement multiple items shown
    <div className={`relative w-full ${aspectRatioClass}`}>
      <ScrollableSlider
        data={items}
        renderItem={(item, index, currentIndex) => (
          <WebPlayerElement
            key={index}
            item={item}
            lazy={Math.abs(index - currentIndex) > 1}
          />
        )}
      />

      <OptionsBar
        composition={data}
        selectedCategory={displayedCategory}
        onChangeSelectedCategory={handleChangeCategory}
      />
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
