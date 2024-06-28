import Button from "@/components/ui/Button";
import { Composition } from "@/types/composition";
import { PositionY } from "@/types/position";
import { positionXToClassName, positionYToClassName } from "@/utils/style";

type CategoryBarProps = {
  composition: Composition;
  selectedCategory: string;
  onChangeSelectedCategory: (category: string) => void;
  position?: Extract<PositionY, "top" | "bottom">;
};

// TODO: Split category selection into a separate component
const CategoryBar: React.FC<CategoryBarProps> = ({
  composition,
  selectedCategory,
  onChangeSelectedCategory,
  position = "top",
}) => {
  const positionYClassName = positionYToClassName(position);
  const positionXClassName = positionXToClassName("center");

  const handleCategoryClick = (category: string) => {
    if (category === selectedCategory) {
      return;
    }
    onChangeSelectedCategory(category);
  };

  return (
    <div
      className={`absolute ${positionYClassName} ${positionXClassName} flex gap-x-2 rounded bg-background p-2 shadow`}
    >
      {/* Category selection */}
      <div className="flex gap-x-2">
        {composition.map(({ category, title }) => (
          <Button
            key={category}
            variant={category === selectedCategory ? "fill" : "ghost"}
            onClick={() => handleCategoryClick(category)}
          >
            {title}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategoryBar;
