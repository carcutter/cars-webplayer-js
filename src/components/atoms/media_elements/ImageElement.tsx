import ZoomableCdnImage from "@/components/atoms/ZoomableCdnImage";
import Hotspot from "@/components/molecules/Hotspot";
import { useControlsContext } from "@/providers/ControlsContext";
import type { Item } from "@/types/composition";

type Props = Omit<Extract<Item, { type: "image" }>, "type"> & {
  zoom?: number;
  onLoad?: () => void;
};

const ImageElement: React.FC<Props> = ({ src, hotspots, onLoad }) => {
  const { setShownDetailImage, showHotspots } = useControlsContext();

  const handleShowDetailImageClick = (detailImage: string) => {
    setShownDetailImage(detailImage);
  };

  return (
    <div className="relative size-full overflow-hidden">
      <ZoomableCdnImage src={src} onLoad={onLoad} />
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
