import { useState } from "react";

import CdnImage from "@/components/atoms/CdnImage";
import CloseButton from "@/components/atoms/CloseButton";
import Hotspot from "@/components/molecules/Hotspot";
import { useGlobalContext } from "@/providers/GlobalContext";
import { Item } from "@/types/composition";

type Props = Omit<Extract<Item, { type: "image" }>, "type"> & {
  zoom?: number | null;
  onShownDetailImageChange?: (shownDetailImage: string | null) => void;
  onLoad?: () => void;
};

const ImageElement: React.FC<Props> = ({
  src,
  hotspots,
  zoom,
  onShownDetailImageChange,
  onLoad,
}) => {
  const { showHotspots } = useGlobalContext();

  const [detailImageShown, setDetailImageShown] = useState<string | null>(null);

  const handleShowDetailImageClick = (shownDetailImage: string) => {
    setDetailImageShown(shownDetailImage);
    onShownDetailImageChange?.(shownDetailImage);
  };
  const handleCloseDetailImageClick = () => {
    setDetailImageShown(null);
    onShownDetailImageChange?.(null);
  };

  return (
    <div className="relative size-full overflow-hidden">
      <CdnImage className="size-full" src={src} onLoad={onLoad} />
      {showHotspots &&
        !zoom && // Hotspots are not shown when zoomed in to avoid hiding anything
        !detailImageShown && // Hotspots have a z-index to stay over the scrollArea, but we don't want them to be clickable when the detail image is shown
        hotspots?.map((hotspot, index) => (
          <Hotspot
            key={index}
            hotspot={hotspot}
            onShowDetailImageClick={handleShowDetailImageClick}
          />
        ))}

      {detailImageShown && (
        <div
          className="absolute inset-0 z-10 cursor-auto"
          onMouseDown={e => e.stopPropagation()}
        >
          <CdnImage className="size-full" src={detailImageShown} />
          <CloseButton onClick={handleCloseDetailImageClick} />
        </div>
      )}
    </div>
  );
};

export default ImageElement;
