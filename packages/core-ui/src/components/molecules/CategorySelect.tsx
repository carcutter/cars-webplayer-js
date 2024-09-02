import { useState } from "react";

import { useCompositionContext } from "../../providers/CompositionContext";
import { useControlsContext } from "../../providers/ControlsContext";
import { cn, positionXToClassName } from "../../utils/style";
import BurgerIcon from "../icons/BurgerIcon";
import Button from "../ui/Button";

type Props = {
  className?: string;
};

const CategorySelect: React.FC<Props> = ({ className }) => {
  const { categories } = useCompositionContext();
  const { displayedCategoryId, changeCategory } = useControlsContext();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Burger */}

      {isMenuOpen && (
        <div
          className={"absolute inset-0 z-overlay sm:hidden"}
          onClick={closeMenu}
        />
      )}

      <div
        className={cn(
          "flex gap-x-2 sm:hidden",
          positionXToClassName("left"),
          className
        )}
      >
        <Button
          shape="icon"
          color={!isMenuOpen ? "neutral" : "primary"}
          onClick={toggleMenu}
        >
          <BurgerIcon />
        </Button>

        {isMenuOpen && (
          <div className="rounded-ui-md bg-background">
            <ul className="space-y-0.5 p-1">
              {categories.map(({ id, title }) => (
                <li
                  key={id}
                  className={cn(
                    "cursor-pointer rounded-ui px-2 py-1 text-sm font-bold transition-colors hover:bg-primary/30",
                    id === displayedCategoryId && "bg-primary/50"
                  )}
                  onClick={() => {
                    changeCategory(id);
                    setIsMenuOpen(false);
                  }}
                >
                  {title}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Non-mobile */}
      <div className={cn("w-full overflow-x-auto max-sm:hidden", className)}>
        <div className="mx-auto flex w-fit gap-x-1 rounded-ui-md bg-background p-1 shadow">
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
    </>
  );
};

export default CategorySelect;
