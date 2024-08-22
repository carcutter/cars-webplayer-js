import type { ImageWithHotspots } from "@car-cutter/core-webplayer";

import { useControlsContext } from "../../../providers/ControlsContext";
import { cn } from "../../../utils/style";
import ZoomableCdnImage, {
  type ZoomableCdnImageProps,
} from "../../atoms/ZoomableCdnImage";
import Hotspot from "../Hotspot";

type Props = ZoomableCdnImageProps & ImageWithHotspots;

/**
 * ImageElement component renders a carrousel's image with hotspots
 */
const ImageElement: React.FC<Props> = ({ className, hotspots, ...props }) => {
  const { isShowingDetails, showHotspots } = useControlsContext();

  return (
    <div className={cn("relative size-full overflow-hidden", className)}>
      <div
        // Scale effect on show details
        className={`size-full duration-details ${isShowingDetails ? "scale-105" : "scale-100"}`}
      >
        <ZoomableCdnImage className="size-full" {...props} />
        {showHotspots &&
          hotspots?.map((hotspot, index) => (
            <Hotspot key={index} hotspot={hotspot} />
          ))}
      </div>
    </div>
  );
};

export default ImageElement;
