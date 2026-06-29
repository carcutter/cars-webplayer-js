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
    /**
     * If true, hotspots will not be rendered by this component.
     * Useful when hotspots are rendered by an external overlay (e.g. NextGenThreeSixtyElement).
     */
    suppressHotspots?: boolean;
  };

/**
 * ImageElement component renders a carrousel's image with hotspots
 */
const ImageElement: React.FC<Props> = ({
  hotspots,
  itemIndex,
  className,
  onLoad,
  suppressHotspots,
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
        {currentItemHotspotsVisible && !suppressHotspots && hotspots?.length ? (
          // Establish the container-query context on an absolutely-positioned
          // overlay (not on the image's flow-path wrapper) so the hotspots'
          // `cqw`-based sizing still resolves against the player's content
          // width, WITHOUT applying inline-size containment to an ancestor of
          // the <img>. Inline-size containment zeroes the contained element's
          // intrinsic width, which collapses the whole player to 0×0 whenever
          // its host sits in a content-sized container (e.g. a Swiper slide
          // with `slidesPerView: "auto"`). An abs-positioned layer never
          // contributes to ancestor intrinsic width, so the image's natural
          // width keeps propagating up.
          <div
            // `pointer-events-none` so this full-size overlay does not swallow
            // the wheel/mouse/touch events that ZoomableCdnImage (painted
            // underneath) needs for zoom & pan; `[&>*]:pointer-events-auto`
            // re-enables input on the hotspots themselves so they stay
            // interactive.
            className="pointer-events-none absolute inset-0 [&>*]:pointer-events-auto"
            style={{ containerType: "inline-size" }}
          >
            {hotspots.map((hotspot, index) => (
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
        ) : null}
      </div>
    </div>
  );
};

export default ImageElement;
