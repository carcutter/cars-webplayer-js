import { useAppContext } from "../../AppContext";
import { COLOR_LIST, colorToClassName, colorToPretty } from "../../const/color";
import { RADIUS_LIST } from "../../const/radius";
import { cn } from "../../utils/style";
import { Button } from "../ui/Button";
import { Checkbox } from "../ui/Checkbox";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";

const CustomisationPopover: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const {
    dealer,
    setDealer,
    product,
    setProduct,

    permanentGallery,
    setPermanentGallery,
    flatten,
    setFlatten,

    color,
    setColor,
    radius,
    setRadius,
  } = useAppContext();

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-0.5">
              <h4 className="font-medium">Showroom</h4>
              <p className="text-sm text-foreground/75">
                Customise how the Showroom page looks.
              </p>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="dealer">Dealer</Label>
                <Input
                  id="dealer"
                  value={dealer}
                  onChange={e => setDealer(e.target.value)}
                  className="col-span-2 h-8"
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="product">Product</Label>
                <Input
                  id="product"
                  value={product}
                  onChange={e => setProduct(e.target.value)}
                  className="col-span-2 h-8"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-0.5">
              <h4 className="font-medium">WebPlayer</h4>
              <p className="text-sm text-foreground/75">
                Customise how the WebPlayer looks.
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

                {/* Flatten */}
                <Checkbox
                  id="flatten"
                  checked={!flatten}
                  onCheckedChange={checked => setFlatten(checked !== true)}
                />
                <Label htmlFor="flatten">Categories</Label>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-semibold">Color</p>
              <div className="grid grid-cols-3 items-center gap-2">
                {COLOR_LIST.map(btnColor => (
                  <Button
                    key={btnColor}
                    className={cn(
                      "gap-x-2",
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
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-semibold">Radius</p>
              <div className="grid grid-flow-col gap-1">
                {RADIUS_LIST.map(btnRadius => (
                  <Button
                    key={btnRadius}
                    className={cn(
                      "border-border",
                      btnRadius === radius &&
                        "border-foreground ring-1 ring-foreground"
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
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CustomisationPopover;
