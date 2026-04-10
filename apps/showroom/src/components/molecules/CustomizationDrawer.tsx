import {
  cloneElement,
  isValidElement,
  type MouseEventHandler,
  type ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAppContext } from "../../AppContext";
import {
  COLOR_LIST,
  colorToClassName,
  colorToHex,
  colorToPretty,
  isColor,
} from "../../const/color";
import { RADIUS_LIST, radiusToClassName } from "../../const/radius";
import {
  type CategoryFilterOption,
  DEFAULT_CATEGORIES_FILTER,
  EXTEND_BEHAVIOR_OPTIONS,
  getWebPlayerPropertyHref,
  MEDIA_LOAD_STRATEGY_OPTIONS,
  PROPERTY_LABELS,
  type WebPlayerPropertyAttribute,
} from "../../const/webplayer";
import { cn } from "../../utils/style";
import CopyLinkButton from "../atoms/CopyLinkButton";
import { Button, getButtonClassName } from "../ui/Button";
import { Checkbox } from "../ui/Checkbox";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Select } from "../ui/Select";

const getPropertyLabelId = (attribute: WebPlayerPropertyAttribute) =>
  `${attribute}-label`;

const getCategoriesFilterValues = (categoriesFilter: string) => {
  if (categoriesFilter === DEFAULT_CATEGORIES_FILTER) {
    return [];
  }

  return categoriesFilter.split("|").filter(Boolean);
};

const PropertyLink: React.FC<{ attribute: WebPlayerPropertyAttribute }> = ({
  attribute,
}) => {
  return (
    <a
      id={getPropertyLabelId(attribute)}
      href={getWebPlayerPropertyHref(attribute)}
      target="_blank"
      rel="noreferrer"
      className="text-sm font-medium underline decoration-border underline-offset-4 transition-colors hover:text-primary"
    >
      {PROPERTY_LABELS[attribute]}
    </a>
  );
};

type Props = React.PropsWithChildren<{
  categoryFilterOptions: CategoryFilterOption[];
}>;

const CustomizationDrawer: React.FC<Props> = ({
  children,
  categoryFilterOptions,
}) => {
  const [drawerState, setDrawerState] = useState<"closed" | "open" | "closing">(
    "closed"
  );
  const isVisible = drawerState !== "closed";
  const isClosing = drawerState === "closing";

  const openDrawer = useCallback(() => setDrawerState("open"), []);
  const closeDrawer = useCallback(() => setDrawerState("closing"), []);
  const onAnimationEnd = useCallback(() => {
    if (isClosing) {
      setDrawerState("closed");
    }
  }, [isClosing]);

  const {
    autoLoad360,
    setAutoLoad360,
    autoLoadInterior360,
    setAutoLoadInterior360,
    categoriesFilter,
    setCategoriesFilter,
    dealer,
    setDealer,
    demoSpin,
    setDemoSpin,
    extendBehavior,
    setExtendBehavior,
    hideCategoriesNav,
    setHideCategoriesNav,
    infiniteCarrousel,
    setInfiniteCarrousel,
    integration,
    setIntegration,
    mediaLoadStrategy,
    setMediaLoadStrategy,
    product,
    setProduct,
    permanentGallery,
    setPermanentGallery,
    resetWebPlayerProps,
    withCustomMedias,
    setWithCustomMedias,
    withCustomIcons,
    setWithCustomIcons,
    color,
    setColor,
    customColorStyle,
    radius,
    setRadius,
  } = useAppContext();

  const isCustomColor = !!customColorStyle;
  const selectedCategoryFilters = getCategoriesFilterValues(categoriesFilter);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDrawer();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isVisible, closeDrawer]);

  const trigger = useMemo(() => {
    if (!isValidElement(children)) {
      return (
        <span className="inline-flex" onClick={openDrawer}>
          {children}
        </span>
      );
    }

    const child = children as ReactElement<{
      onClick?: MouseEventHandler;
    }>;
    const childProps = child.props;

    return cloneElement(child, {
      onClick: (event) => {
        childProps.onClick?.(event);

        if (!event.defaultPrevented) {
          openDrawer();
        }
      },
    });
  }, [children, openDrawer]);

  const toggleCategoryFilter = (
    categoryFilter: string,
    checked: boolean | "indeterminate"
  ) => {
    const nextCategoryFilters = new Set(selectedCategoryFilters);

    if (checked === true) {
      nextCategoryFilters.add(categoryFilter);
    } else {
      nextCategoryFilters.delete(categoryFilter);
    }

    setCategoriesFilter(
      nextCategoryFilters.size > 0
        ? Array.from(nextCategoryFilters).join("|")
        : DEFAULT_CATEGORIES_FILTER
    );
  };

  return (
    <>
      {trigger}

      {isVisible && (
        <div
          className={cn(
            "fixed inset-0 z-50 overscroll-none bg-foreground/40",
            isClosing && "animate-out fade-out fill-mode-forwards"
          )}
          onClick={closeDrawer}
        >
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Customization drawer"
            className={cn(
              "fixed inset-y-0 right-0 overflow-y-auto overscroll-y-none border-l border-border bg-background p-3 text-foreground shadow-2xl outline-none",
              "w-full max-w-[min(100vw,32rem)]",
              isClosing
                ? "animate-out slide-out-to-right fill-mode-forwards"
                : "animate-in slide-in-from-right"
            )}
            onClick={event => event.stopPropagation()}
            onAnimationEnd={onAnimationEnd}
          >
            <div className="mb-2 flex items-center justify-between gap-2 border-b border-border pb-2">
              <div>
                <h3 className="font-medium">Customization</h3>
                <p className="text-xs text-foreground/75">
                  Adjust showroom and WebPlayer settings.
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label="Close customization drawer"
                className="size-8 px-0"
                onClick={closeDrawer}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                >
                  <path d="M3.5 3.5 12.5 12.5" />
                  <path d="M12.5 3.5 3.5 12.5" />
                </svg>
              </Button>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <div className="space-y-0.5">
                  <h4 className="font-medium">Showroom</h4>
                  <p className="text-xs text-foreground/75">
                    Customize the Showroom page.
                  </p>
                </div>

                <div className="grid gap-2 sm:grid-cols-2 sm:items-start">
                  <div className="space-y-1.5">
                    <Label htmlFor="dealer">Dealer</Label>
                    <Input
                      id="dealer"
                      className="h-8"
                      placeholder="Enter the dealer name"
                      value={dealer}
                      onChange={e => setDealer(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="product">Product</Label>
                    <Input
                      id="product"
                      className="h-8"
                      placeholder="Enter the product name"
                      value={product}
                      onChange={e => setProduct(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="space-y-0.5">
                  <h4 className="font-medium">WebPlayer</h4>
                  <p className="text-xs text-foreground/75">
                    Customize documented WebPlayer props live.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 sm:items-start">
                  <div className="space-y-2">
                    <div className="grid grid-cols-[auto,1fr] items-center gap-2">
                      <Checkbox
                        id="permanentGallery"
                        checked={permanentGallery}
                        aria-labelledby={getPropertyLabelId(
                          "permanent-gallery"
                        )}
                        onCheckedChange={checked =>
                          setPermanentGallery(checked === true)
                        }
                      />
                      <PropertyLink attribute="permanent-gallery" />

                      <Checkbox
                        id="hideCategoriesNav"
                        checked={hideCategoriesNav}
                        aria-labelledby={getPropertyLabelId(
                          "hide-categories-nav"
                        )}
                        onCheckedChange={checked =>
                          setHideCategoriesNav(checked === true)
                        }
                      />
                      <PropertyLink attribute="hide-categories-nav" />

                      <Checkbox
                        id="integration"
                        checked={integration}
                        aria-labelledby={getPropertyLabelId("integration")}
                        onCheckedChange={checked =>
                          setIntegration(checked === true)
                        }
                      />
                      <PropertyLink attribute="integration" />

                      <Checkbox
                        id="infiniteCarrousel"
                        checked={infiniteCarrousel}
                        aria-labelledby={getPropertyLabelId(
                          "infinite-carrousel"
                        )}
                        onCheckedChange={checked =>
                          setInfiniteCarrousel(checked === true)
                        }
                      />
                      <PropertyLink attribute="infinite-carrousel" />

                      <Checkbox
                        id="autoLoad360"
                        checked={autoLoad360}
                        aria-labelledby={getPropertyLabelId("auto-load360")}
                        onCheckedChange={checked =>
                          setAutoLoad360(checked === true)
                        }
                      />
                      <PropertyLink attribute="auto-load360" />

                      <Checkbox
                        id="autoLoadInterior360"
                        checked={autoLoadInterior360}
                        aria-labelledby={getPropertyLabelId(
                          "auto-load-interior360"
                        )}
                        onCheckedChange={checked =>
                          setAutoLoadInterior360(checked === true)
                        }
                      />
                      <PropertyLink attribute="auto-load-interior360" />

                      <Checkbox
                        id="demoSpin"
                        checked={demoSpin}
                        aria-labelledby={getPropertyLabelId("demo-spin")}
                        onCheckedChange={checked =>
                          setDemoSpin(checked === true)
                        }
                      />
                      <PropertyLink attribute="demo-spin" />
                    </div>

                    <div className="grid gap-1">
                      <PropertyLink attribute="media-load-strategy" />
                      <Select
                        id="mediaLoadStrategy"
                        value={mediaLoadStrategy}
                        aria-labelledby={getPropertyLabelId(
                          "media-load-strategy"
                        )}
                        onChange={e =>
                          setMediaLoadStrategy(
                            e.target.value as typeof mediaLoadStrategy
                          )
                        }
                      >
                        {MEDIA_LOAD_STRATEGY_OPTIONS.map(({ value, label }) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </Select>
                    </div>

                    <div className="grid gap-1">
                      <PropertyLink attribute="extend-behavior" />
                      <Select
                        id="extendBehavior"
                        value={extendBehavior}
                        aria-labelledby={getPropertyLabelId("extend-behavior")}
                        onChange={e =>
                          setExtendBehavior(
                            e.target.value as typeof extendBehavior
                          )
                        }
                      >
                        {EXTEND_BEHAVIOR_OPTIONS.map(({ value, label }) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="grid gap-1">
                      <PropertyLink attribute="categories-filter" />
                      <div className="grid grid-cols-2 gap-1.5 rounded-md border border-border p-2">
                        {categoryFilterOptions.map(({ value, label }) => (
                          <div
                            key={value}
                            className="flex items-center gap-1.5"
                          >
                            <Checkbox
                              id={`categoriesFilter-${value}`}
                              checked={selectedCategoryFilters.includes(value)}
                              aria-labelledby={getPropertyLabelId(
                                "categories-filter"
                              )}
                              onCheckedChange={checked =>
                                toggleCategoryFilter(value, checked)
                              }
                            />
                            <Label
                              htmlFor={`categoriesFilter-${value}`}
                              className="text-[11px]"
                            >
                              {label}
                            </Label>
                          </div>
                        ))}
                      </div>
                      {categoryFilterOptions.length === 0 && (
                        <p className="text-xs text-foreground/75">
                          No categories available for this composition.
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5 pt-1.5">
                      <h5 className="text-sm font-semibold">Extras</h5>
                      <div className="grid grid-cols-[auto,1fr] items-center gap-2">
                        <Checkbox
                          id="withCustomMedias"
                          checked={withCustomMedias}
                          onCheckedChange={checked =>
                            setWithCustomMedias(checked === true)
                          }
                        />
                        <a
                          href="https://carcutter.github.io/cars-webplayer-js/docs/advanced_customisation/custom_medias/"
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-medium underline decoration-border underline-offset-4 transition-colors hover:text-primary"
                        >
                          Custom medias
                        </a>

                        <Checkbox
                          id="withCustomIcons"
                          checked={withCustomIcons}
                          onCheckedChange={checked =>
                            setWithCustomIcons(checked === true)
                          }
                        />
                        <a
                          href="https://carcutter.github.io/cars-webplayer-js/docs/advanced_customisation/icons/"
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-medium underline decoration-border underline-offset-4 transition-colors hover:text-primary"
                        >
                          Custom icons
                        </a>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-semibold">Color</p>
                      <div className="grid grid-cols-3 items-center gap-1.5">
                        {COLOR_LIST.map(btnColor => (
                          <Button
                            key={btnColor}
                            className={cn(
                              "border-border",
                              btnColor === color &&
                                "border-foreground ring-1 ring-foreground"
                            )}
                            variant="outline"
                            color="foreground"
                            size="sm"
                            onClick={() => setColor(btnColor)}
                          >
                            <div
                              className={cn(
                                "size-3 rounded-full bg-primary",
                                colorToClassName(btnColor)
                              )}
                            />
                            <span>{colorToPretty(btnColor)}</span>
                          </Button>
                        ))}

                        <label
                          className={cn(
                            getButtonClassName({
                              variant: "outline",
                              color: "foreground",
                              size: "sm",
                            }),
                            "border-border",
                            "w-full cursor-pointer",
                            isCustomColor &&
                              "border-foreground ring-1 ring-foreground"
                          )}
                        >
                          <input
                            className="sr-only"
                            type="color"
                            value={
                              isCustomColor
                                ? color
                                : colorToHex(isColor(color) ? color : "blue")
                            }
                            onChange={e => setColor(e.target.value)}
                          />

                          <div
                            className="size-3 rounded-full bg-primary"
                            style={customColorStyle}
                          />
                          <span> Custom </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <p className="text-sm font-semibold">Radius</p>
                    <div className="grid grid-flow-col gap-1">
                      {RADIUS_LIST.map(btnRadius => (
                        <Button
                          key={btnRadius}
                          className={cn(
                            "border-border",
                            btnRadius === radius &&
                              "border-foreground ring-1 ring-foreground",
                            radiusToClassName(btnRadius)
                          )}
                          variant="outline"
                          color="foreground"
                          size="sm"
                          onClick={() => setRadius(btnRadius)}
                        >
                          {btnRadius}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5 border-t border-border pt-1.5 sm:col-span-2">
                    <h4 className="font-medium">Share</h4>
                    <div className="flex items-center justify-between gap-4">
                      <CopyLinkButton size="sm" />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={resetWebPlayerProps}
                      >
                        Reset to defaults
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default CustomizationDrawer;
