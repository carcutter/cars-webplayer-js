import { useState } from "react";

import { useCompositionContext } from "../../providers/CompositionContext";
import { useControlsContext } from "../../providers/ControlsContext";
import {
  cn,
  positionToClassName,
  positionYToClassName,
} from "../../utils/style";
import BurgerIcon from "../icons/BurgerIcon";
import Button from "../ui/Button";

type Props = {
  sharedClassName?: string;
};

const CategorySelect: React.FC<Props> = ({ sharedClassName }) => {
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
      {/* Burger Selection (small screens) */}

      {isMenuOpen && (
        <div
          className={cn(sharedClassName, "inset-0 small:hidden")}
          onClick={closeMenu}
        />
      )}

      <div
        className={cn(
          sharedClassName,
          positionToClassName("top-left"),
          "flex gap-x-2 small:hidden"
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
          <div className="rounded-ui-md bg-background transition-radius">
            <ul className="space-y-0.5 p-1">
              {categories.map(({ id, title }) => (
                <li
                  key={id}
                  className={cn(
                    "cursor-pointer rounded-ui px-2 py-1 text-sm font-bold transition-all hover:bg-primary/30",
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

      {/* Select Bar for big screens */}
      <div
        className={cn(
          sharedClassName,
          positionYToClassName("top"),
          "w-full overflow-x-auto max-small:hidden"
        )}
      >
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
