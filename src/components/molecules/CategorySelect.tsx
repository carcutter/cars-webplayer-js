import Button from "@/components/ui/Button";
import { useCompositionContext } from "@/providers/CompositionContext";
import { useControlsContext } from "@/providers/ControlsContext";

type Props = {
  className?: string;
};

const CategorySelect: React.FC<Props> = ({ className = "" }) => {
  const { categories } = useCompositionContext();
  const { displayedCategoryId, changeCategory } = useControlsContext();

  return (
    <div className={`${className} w-full overflow-x-auto`}>
      <div className="mx-auto flex w-fit gap-x-1 rounded-ui-lg bg-background p-1 shadow sm:gap-x-2 sm:p-2">
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
