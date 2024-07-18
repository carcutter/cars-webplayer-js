import { useState } from "react";

import CdnImage from "@/components/atoms/CdnImage";
import CloseButton from "@/components/atoms/CloseButton";
import ZoomableCdnImage from "@/components/atoms/ZoomableCdnImage";
import Hotspot from "@/components/molecules/Hotspot";
import { useControlsContext } from "@/providers/ControlsContext";
import type { Item } from "@/types/composition";

type Props = Omit<Extract<Item, { type: "image" }>, "type"> & {
  zoom?: number | null;
  onShownDetailImageChange?: (shownDetailImage: string | null) => void;
  onLoad?: () => void;
};

const ImageElement: React.FC<Props> = ({
  src,
  hotspots,
  onShownDetailImageChange, // TODO
  onLoad,
}) => {
  const { isZoomed, showHotspots } = useControlsContext();

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
      <ZoomableCdnImage src={src} onLoad={onLoad} />
      {showHotspots &&
        !isZoomed && // Hotspots are not shown when zoomed in to avoid hiding anything
        !detailImageShown && // Hotspots have a z-index to stay over the scrollArea, but we don't want them to be visible when the detail image is shown
        hotspots?.map((hotspot, index) => (
          <Hotspot
            key={index}
            hotspot={hotspot}
            onShowDetailImageClick={handleShowDetailImageClick}
          />
        ))}

      {/* TODO: Zoom should be also available for the details */}
      {detailImageShown && (
        <div className="absolute inset-0 z-detailImage cursor-auto">
          <CdnImage className="size-full" src={detailImageShown} />
          <CloseButton onClick={handleCloseDetailImageClick} />
        </div>
      )}
    </div>
  );
};

export default ImageElement;
