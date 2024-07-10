import Button from "@/components/ui/Button";
import { useGlobalContext } from "@/providers/GlobalContext";
import type { Composition } from "@/types/composition";
import { positionsToClassName } from "@/utils/style";

type CategoryBarProps = {
  composition: Composition;
  selectedCategory: string;
  onChangeSelectedCategory: (category: string) => void;
};

const CategoryBar: React.FC<CategoryBarProps> = ({
  composition,
  selectedCategory,
  onChangeSelectedCategory,
}) => {
  const { categoryPosition: positionY } = useGlobalContext();

  const positionClassName = positionsToClassName({
    positionY,
    positionX: "center",
  });

  const handleCategoryClick = (category: string) => {
    if (category === selectedCategory) {
      return;
    }
    onChangeSelectedCategory(category);
  };

  return (
    <div
      className={`absolute ${positionClassName} flex gap-x-2 rounded bg-background p-2 shadow`}
    >
      {/* Category selection */}
      <div className="flex gap-x-2">
        {composition.elements.map(({ category, title }) => (
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
