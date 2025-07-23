import type { ImageWithHotspots } from "@car-cutter/core";

import { useControlsContext } from "../../../providers/ControlsContext";
import { cn } from "../../../utils/style";
import ZoomableCdnImage, {
  type ZoomableCdnImageProps,
} from "../../atoms/ZoomableCdnImage";
import Hotspot from "../Hotspot";

type Props = ZoomableCdnImageProps &
  ImageWithHotspots & {
    itemIndex: number;
  };

/**
 * ImageElement component renders a carrousel's image with hotspots
 */
const ImageElement: React.FC<Props> = ({
  hotspots,
  itemIndex,
  className,
  onLoad,
  ...props
}) => {
  const { isShowingDetails, currentItemHotspotsVisible, setItemInteraction } =
    useControlsContext();

  return (
    <div className={cn("relative size-full overflow-hidden", className)}>
      <div
        // Scale effect on show details
        className={cn(
          "size-full duration-details",
          isShowingDetails ? "scale-105" : "scale-100"
        )}
      >
        <ZoomableCdnImage
          className="size-full object-cover"
          onLoad={e => {
            if (itemIndex !== undefined && itemIndex >= 0) {
              setItemInteraction(itemIndex, "ready");
            }

            onLoad?.(e);
          }}
          {...props}
        />
        {currentItemHotspotsVisible &&
          hotspots?.map((hotspot, index) => (
            <Hotspot
              key={index}
              hotspot={hotspot}
              item={{
                item_type: "image",
                item_position: itemIndex,
              }}
            />
          ))}
      </div>
    </div>
  );
};

export default ImageElement;
