import ZoomableCdnImage, {
  ZoomableCdnImageProps,
} from "@/components/atoms/ZoomableCdnImage";
import Hotspot from "@/components/molecules/Hotspot";
import { useControlsContext } from "@/providers/ControlsContext";
import type { Item } from "@/types/composition";

type Props = ZoomableCdnImageProps &
  Omit<Extract<Item, { type: "image" }>, "type">;

const ImageElement: React.FC<Props> = ({ hotspots, ...props }) => {
  const { setShownDetailImage, showHotspots } = useControlsContext();

  const handleShowDetailImageClick = (detailImage: string) => {
    setShownDetailImage(detailImage);
  };

  return (
    <div className="relative size-full overflow-hidden">
      <ZoomableCdnImage {...props} />
      {showHotspots &&
        hotspots?.map((hotspot, index) => (
          <Hotspot
            key={index}
            hotspot={hotspot}
            onShowDetailImageClick={handleShowDetailImageClick}
          />
        ))}
    </div>
  );
};

export default ImageElement;
