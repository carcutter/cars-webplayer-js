import { useAppContext } from "../../AppContext";
import { COLOR_LIST, colorToClassName, colorToPretty } from "../../const/color";
import { RADIUS_LIST, radiusToClassName } from "../../const/radius";
import { cn } from "../../utils/style";
import CopyLinkButton from "../atoms/CopyLinkButton";
import { Button, getButtonClassName } from "../ui/Button";
import { Checkbox } from "../ui/Checkbox";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";

const CustomizationPopover: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const {
    dealer,
    setDealer,
    product,
    setProduct,

    permanentGallery,
    setPermanentGallery,
    hideCategoriesNav,
    setHideCategoriesNav,
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

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className={cn("w-72", "sm:w-80")}
        side="right"
        sideOffset={16}
        align="start"
        onOpenAutoFocus={e => e.preventDefault()}
      >
        <div className="space-y-6">
          <div
            // Showroom
            className="space-y-4"
          >
            <div className="space-y-0.5">
              <h4 className="font-medium">Showroom</h4>
              <p className="text-sm text-foreground/75">
                Customize the Showroom page.
              </p>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="dealer">Dealer</Label>
                <Input
                  id="dealer"
                  className="col-span-2 h-8"
                  placeholder="Enter the dealer name"
                  value={dealer}
                  onChange={e => setDealer(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="product">Product</Label>
                <Input
                  id="product"
                  className="col-span-2 h-8"
                  placeholder="Enter the product name"
                  value={product}
                  onChange={e => setProduct(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div
            // WebPlayer
            className="space-y-4"
          >
            <div className="space-y-0.5">
              <h4 className="font-medium">WebPlayer</h4>
              <p className="text-sm text-foreground/75">
                Customize the WebPlayer looks.
              </p>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-[auto,1fr,auto,1fr] items-center gap-2">
                {/* Permanent Gallery */}
                <Checkbox
                  id="permanentGallery"
                  checked={permanentGallery}
                  onCheckedChange={checked =>
                    setPermanentGallery(checked === true)
                  }
                />
                <Label htmlFor="permanentGallery" className="text-sm">
                  Fixed Gallery
                </Label>

                {/* Hide Categories */}
                <Checkbox
                  id="hideCategoriesNav"
                  checked={!hideCategoriesNav}
                  onCheckedChange={checked =>
                    setHideCategoriesNav(checked !== true)
                  }
                />
                <Label htmlFor="hideCategoriesNav">Categories</Label>

                {/* Custom Medias */}
                <Checkbox
                  id="withCustomMedias"
                  checked={withCustomMedias}
                  onCheckedChange={checked =>
                    setWithCustomMedias(checked === true)
                  }
                />
                <Label htmlFor="withCustomMedias">Custom Medias</Label>

                {/* Custom Icons */}
                <Checkbox
                  id="withCustomIcons"
                  checked={withCustomIcons}
                  onCheckedChange={checked =>
                    setWithCustomIcons(checked === true)
                  }
                />
                <Label htmlFor="withCustomIcons">Custom Icons</Label>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-semibold">Color</p>
              <div className="grid grid-cols-3 items-center gap-2">
                {COLOR_LIST.map(btnColor => (
                  <Button
                    key={btnColor}
                    // eslint-disable-next-line tailwindcss/no-custom-classname
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
                  // eslint-disable-next-line tailwindcss/no-custom-classname
                  className={cn(
                    getButtonClassName({
                      variant: "outline",
                      color: "foreground",
                      size: "sm",
                    }),
                    "border-border",
                    "w-full cursor-pointer",
                    isCustomColor && "border-foreground ring-1 ring-foreground"
                  )}
                >
                  <input
                    className="sr-only"
                    type="color"
                    value={color}
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

            <div className="space-y-1">
              <p className="text-sm font-semibold">Radius</p>
              <div className="grid grid-flow-col gap-1">
                {RADIUS_LIST.map(btnRadius => (
                  <Button
                    key={btnRadius}
                    // eslint-disable-next-line tailwindcss/no-custom-classname
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
          </div>

          <div
            // Misc
            className="space-y-2"
          >
            <h4 className="font-medium">Share</h4>
            <CopyLinkButton size="sm" />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CustomizationPopover;
