import ZoomableCdnImage, {
  ZoomableCdnImageProps,
} from "@/components/atoms/ZoomableCdnImage";
import Hotspot from "@/components/molecules/Hotspot";
import { useControlsContext } from "@/providers/ControlsContext";
import type { Item } from "@/types/composition";

type Props = Omit<ZoomableCdnImageProps, "className"> &
  Omit<Extract<Item, { type: "image" }>, "type">;

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
