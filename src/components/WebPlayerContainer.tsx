import { useState } from "react";

import { useComposition } from "@/hooks/useComposition";
import { Composition } from "@/types/composition";
import CategorySelect from "./CategorySelect";
import NextPrevButtons from "./NextPrevButtons";

type WebPlayerContentProps = { data: Composition };

const WebPlayerContent: React.FC<
  React.PropsWithChildren<WebPlayerContentProps>
> = ({ data }) => {
  const [displayedCategory, setDisplayedCategory] = useState(data[0].category);

  const [imageIndex, setImageIndex] = useState(0);

  const currrentCategoryRoot = data.find(
    ({ category }) => category === displayedCategory
  );
  if (!currrentCategoryRoot) {
    throw new Error(`Category ${displayedCategory} not found`);
  }

  const { items } = currrentCategoryRoot;

  const handleChangeCategory = (category: string) => {
    setDisplayedCategory(category);
    setImageIndex(0);
  };

  const prevImage = () => {
    if (imageIndex <= 0) {
      return;
    }
    setImageIndex((v) => v - 1);
  };

  const nextImage = () => {
    if (imageIndex >= items.length - 1) {
      return;
    }
    setImageIndex((v) => v + 1);
  };

  return (
    <div className="relative size-full overflow-hidden aspect-[4/3]">
      <div
        className="h-full flex transition-transform"
        style={{ transform: `translateX(${-imageIndex * 100}%)` }}
      >
        {items.map(({ image }) => (
          <img key={image} className="h-full" src={image} alt="" />
        ))}
      </div>

      <CategorySelect
        composition={data}
        selectedCategory={displayedCategory}
        onChangeSelectedCategory={handleChangeCategory}
      />

      {/* Previous/Next buttons */}
      <NextPrevButtons onPrev={prevImage} onNext={nextImage} />
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
