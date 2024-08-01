import Button from "@/components/ui/Button";
import { useCompositionContext } from "@/providers/CompositionContext";
import { useControlsContext } from "@/providers/ControlsContext";

const CategorySelect: React.FC = () => {
  const { categories } = useCompositionContext();
  const { displayedCategoryId, changeCategory } = useControlsContext();

  return (
    <div className="flex gap-x-2 rounded bg-background p-2 shadow">
      <div className="flex gap-x-2">
        {categories.map(({ id, title }) => (
          <Button
            key={id}
            variant={id === displayedCategoryId ? "fill" : "ghost"}
            onClick={() => changeCategory(id)}
          >
            {title}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelect;
