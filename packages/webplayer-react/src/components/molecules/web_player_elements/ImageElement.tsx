import { useControlsContext } from "../../../providers/ControlsContext";
import type { ImageWithHotspots } from "../../../types/composition";
import ZoomableCdnImage, {
  type ZoomableCdnImageProps,
} from "../../atoms/ZoomableCdnImage";
import Hotspot from "../Hotspot";

type Props = Omit<ZoomableCdnImageProps, "className"> & ImageWithHotspots;

/**
 * ImageElement component renders a carrousel's image with hotspots
 */
const ImageElement: React.FC<Props> = ({ hotspots, ...props }) => {
  const { isShowingDetails, showHotspots } = useControlsContext();

  return (
    <div className="relative size-full overflow-hidden">
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
