import { useState } from "react";

import { useCustomizationContext } from "@/providers/CustomizationContext";
import { Hotspot as HotspotType } from "@/types/composition";

type HotspotProps = {
  hotspot: HotspotType;
  onShowDetailImageClick: (shownDetailImage: string) => void;
};
type IconHotspotProps = HotspotProps;

const IconHotspot: React.FC<IconHotspotProps> = ({
  hotspot,
  onShowDetailImageClick,
}) => {
  const {
    feature,
    position,
    description: { short: descriptionShort, long: descriptionLong },
    detail,
  } = hotspot;

  const { getHotspotConfig } = useCustomizationContext();
  const hotspotConfig = getHotspotConfig(feature);

  const [showDescription, setShowDescription] = useState(false);

  const handleOnClick = () => {
    if (!detail) {
      return;
    }

    onShowDetailImageClick(detail);
  };

  return (
    <div
      className={`absolute ${showDescription ? "z-20" : "z-10"} -translate-x-1/2 -translate-y-1/2 cursor-help`}
      onClick={handleOnClick}
      onMouseEnter={() => setShowDescription(true)}
      onMouseLeave={() => setShowDescription(false)}
      style={{
        top: `${100 * hotspot.position.y}%`,
        left: `${100 * hotspot.position.x}%`,
      }}
    >
      <div
        // Hoverable icon
        className="relative flex size-6 items-center justify-center rounded-full bg-primary text-background"
        // Override the background color with the one from the config if available
        style={{ backgroundColor: hotspotConfig?.color }}
      >
        <div
          // Ping animation
          className="absolute inset-0 -z-10 animate-hotspot-ping rounded-full bg-inherit"
        />

        {/* Use the icon from the config if available. Else, replace it if needed */}
        {hotspotConfig?.Icon ?? (
          <img
            className="size-full invert"
            src="https://cdn.car-cutter.com/libs/web-player/v2/assets/icons/ui/add.svg"
            alt="Plus"
          />
        )}
      </div>
      {showDescription && descriptionShort && (
        <div
          className={`absolute top-1/3 ${position.x < 0.7 ? "left-full" : "right-full"} w-max max-w-48 px-2`}
        >
          <div className="rounded bg-background px-2 py-1">
            <div className="text-sm">{descriptionShort}</div>
            {descriptionLong && (
              <div className="text-xs">{descriptionLong}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Hotspot: React.FC<HotspotProps> = props => {
  const {
    hotspot: {
      feature,
      description: { long: descriptionLong },
    },
  } = props;

  // TODO: Add more cases
  switch (feature) {
    case "WINDOW STICKER":
      return (
        <a href={descriptionLong} target="_blank" rel="noreferrer">
          <img
            className="h-10"
            src="https://cdn.car-cutter.com/libs/web-player/v2/assets/images/customers/autonation/window_sticker.png"
            alt="Window sticker"
          />
        </a>
      );
    case "CARFAX":
      return (
        <a href={descriptionLong} target="_blank" rel="noreferrer">
          <img
            className="h-10"
            src="https://cdn.car-cutter.com/libs/web-player/v2/assets/images/customers/autonation/carfax.png"
            alt="Carfax"
          />
        </a>
      );
    default:
      return <IconHotspot {...props} />;
  }
};

export default Hotspot;
