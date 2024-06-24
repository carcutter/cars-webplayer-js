import { Composition } from "@/types/composition";
import Button from "./atoms/Button";
import { positionToClassName } from "@/utils/style";
import { Position } from "@/types/position";

type Props = {
  composition: Composition;
  selectedCategory: string;
  onChangeSelectedCategory: (category: string) => void;
  position?: Position;
};

const CategorySelect: React.FC<Props> = ({
  composition,
  selectedCategory,
  onChangeSelectedCategory,
  position = "top-center",
}) => {
  const positionYClassName = positionToClassName(position);

  const handleCategoryClick = (category: string) => {
    if (category === selectedCategory) {
      return;
    }
    onChangeSelectedCategory(category);
  };

  return (
    <div className={`absolute ${positionYClassName} flex gap-x-2`}>
      {composition.map(({ category, title }) => (
        <Button
          key={category}
          className={category === selectedCategory ? "!bg-slate-300" : ""}
          onClick={() => handleCategoryClick(category)}
        >
          {title}
        </Button>
      ))}
    </div>
  );
};

export default CategorySelect;
