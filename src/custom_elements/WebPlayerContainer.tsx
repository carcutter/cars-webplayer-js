import { useComposition } from "@/hooks/useComposition";
import { Composition } from "@/types/composition";
import OptionsBar from "./OptionsBar";
import GalleryButton from "./GalleryButton";
import WebPlayerElement from "@/components/molecules/WebPlayerElement";
import { useGlobalContext } from "@/providers/GlobalContext";
import ScrollableSlider from "@/components/organisms/ScrollableSlider";
import { useState } from "react";

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
    <div className={`relative size-full ${aspectRatioClass}`}>
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
    return <div>Error</div>;
  }

  if (!isSuccess) {
    return <div>Loading...</div>;
  }

  return <WebPlayerContent data={data}>{children}</WebPlayerContent>;
};

export default WebPlayerContainer;
