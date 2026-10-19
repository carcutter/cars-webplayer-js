import { useCallback, useLayoutEffect, useRef, useState } from "react";

import { useCompositionContext } from "../../providers/CompositionContext";
import { useControlsContext } from "../../providers/ControlsContext";
import { useGlobalContext } from "../../providers/GlobalContext";
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

type ForcedTopNavProps = Props & {
  // Index indicator (top-right) the forced top nav must not overlap
  indicatorElement?: HTMLElement | null;
};

// Centers `item` inside the horizontal `scroller`. Only the scroller moves:
// `scrollIntoView` would also scroll the host page (or the iframe's parent).
const scrollItemIntoView = (
  scroller: HTMLElement,
  item: HTMLElement,
  behavior: ScrollBehavior
) => {
  scroller.scrollTo({
    left: item.offsetLeft - (scroller.clientWidth - item.offsetWidth) / 2,
    behavior,
  });
};

// Gap kept between the forced top nav and the container edge (or the index
// indicator), mirroring the `top-1` offset of the other overlay controls.
const FORCED_NAV_SIDE_GAP = 4;

// Top navigation rendered at any width (`forceTopNav`): never falls back to
// the burger, scrolls horizontally when the categories don't fit.
const ForcedTopNav: React.FC<ForcedTopNavProps> = ({
  sharedClassName,
  indicatorElement = null,
}) => {
  const { categories } = useCompositionContext();
  const { displayedCategoryId, changeCategory } = useControlsContext();

  const scrollerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const getActiveItem = useCallback(() => {
    const index = categories.findIndex(({ id }) => id === displayedCategoryId);
    const item = listRef.current?.children[index];
    return item instanceof HTMLElement ? item : null;
  }, [categories, displayedCategoryId]);

  // Keep the active category visible when it changes (smoothly)
  const isFirstScrollRef = useRef(true);
  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    const item = getActiveItem();
    if (!scroller || !item) return;

    scrollItemIntoView(scroller, item, isFirstScrollRef.current ? "auto" : "smooth");
    isFirstScrollRef.current = false;
  }, [getActiveItem]);

  // Size the nav so it never runs under the index indicator (top-right), and
  // re-center the active category whenever the layout changes (resize,
  // rotation, fullscreen, fonts loaded, player shown after being hidden…)
  const getActiveItemRef = useRef(getActiveItem);
  getActiveItemRef.current = getActiveItem;
  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    const list = listRef.current;
    const container = scroller?.parentElement;
    if (!scroller || !list || !container) return;

    const update = () => {
      const containerRect = container.getBoundingClientRect();
      const indicatorWidth = indicatorElement
        ? containerRect.right - indicatorElement.getBoundingClientRect().left
        : 0;
      const sideReserve = Math.max(indicatorWidth, 0) + FORCED_NAV_SIDE_GAP;
      scroller.style.maxWidth = `calc(100% - ${2 * sideReserve}px)`;

      const item = getActiveItemRef.current();
      if (item) scrollItemIntoView(scroller, item, "auto");
    };

    update();

    if (typeof ResizeObserver === "undefined") return;
    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(container);
    resizeObserver.observe(list);
    if (indicatorElement) resizeObserver.observe(indicatorElement);
    return () => resizeObserver.disconnect();
  }, [indicatorElement]);

  return (
    <div
      ref={scrollerRef}
      className={cn(
        sharedClassName,
        positionToClassName("top-center"),
        "w-max max-w-full overflow-x-auto overscroll-x-contain rounded-ui-md bg-background shadow no-scrollbar"
      )}
      data-hotspot-top-inset
    >
      <div ref={listRef} className="flex w-max gap-x-1 p-1">
        {categories.map(({ id, title }) => (
          <Button
            key={id}
            className="shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-foreground"
            variant={id === displayedCategoryId ? "fill" : "ghost"}
            aria-current={id === displayedCategoryId ? "true" : undefined}
            onClick={() => changeCategory(id)}
            onFocus={event => {
              if (scrollerRef.current) {
                scrollItemIntoView(
                  scrollerRef.current,
                  event.currentTarget,
                  "smooth"
                );
              }
            }}
          >
            {title}
          </Button>
        ))}
      </div>
    </div>
  );
};

const CategorySelect: React.FC<ForcedTopNavProps> = ({
  sharedClassName,
  indicatorElement,
}) => {
  const { forceTopNav } = useGlobalContext();

  if (forceTopNav) {
    return (
      <ForcedTopNav
        sharedClassName={sharedClassName}
        indicatorElement={indicatorElement}
      />
    );
  }

  return <ResponsiveCategorySelect sharedClassName={sharedClassName} />;
};

// Burger on small screens, top bar on big screens (default behaviour)
const ResponsiveCategorySelect: React.FC<Props> = ({ sharedClassName }) => {
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
        data-hotspot-top-inset
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
        <div
          className="mx-auto flex w-fit gap-x-1 rounded-ui-md bg-background p-1 shadow"
          data-hotspot-top-inset
        >
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
