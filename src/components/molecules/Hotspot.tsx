import { useState } from "react";

import { useCustomizationContext } from "@/providers/CustomizationContext";
import { Hotspot as HotspotType } from "@/types/composition";

type IconHotspotProps = {
  hotspot: HotspotType;
};

const IconHotspot: React.FC<IconHotspotProps> = ({
  hotspot: {
    feature,
    position,
    description: { short: descriptionShort, long: descriptionLong },
    detail,
  },
}) => {
  const { getHotspotConfig } = useCustomizationContext();
  const hotspotConfig = getHotspotConfig(feature);

  const longDescriptionIsLink = !!descriptionLong?.startsWith("http");

  const [showDetails, setShowDetails] = useState(false);

  const handleOnClick = () => {
    let link: string | undefined;
    if (longDescriptionIsLink) {
      link = descriptionLong as string;
    } else if (detail) {
      link = detail;
    }

    if (!link) {
      return;
    }

    window.open(link, "_blank");
  };

  return (
    <div
      className="relative cursor-help"
      onClick={handleOnClick}
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      {/* Hoverable icon */}
      <div
        className="relative flex size-6 items-center justify-center rounded-full bg-primary text-background"
        // Override the background color with the one from the config if available
        style={{ backgroundColor: hotspotConfig?.color }}
      >
        <div className="absolute inset-0 -z-10 animate-hotspot-ping rounded-full bg-inherit" />

        {/* Use the icon from the config if available. Else, replace it if needed */}
        {hotspotConfig?.Icon ?? (
          <img
            className="size-full invert"
            src="https://cdn.car-cutter.com/libs/web-player/v2/assets/icons/ui/add.svg"
            alt="Plus"
          />
        )}
      </div>
      {showDetails && (
        <div
          className={`absolute top-1/3 ${position.x < 0.7 ? "left-full" : "right-full"} mx-2 w-max max-w-48 rounded bg-background px-2 py-1`}
        >
          <div className="text-sm">{descriptionShort}</div>
          {descriptionLong && !longDescriptionIsLink && (
            <div className="text-xs">{descriptionLong}</div>
          )}
        </div>
      )}
    </div>
  );
};

type HotspotProps = { hotspot: HotspotType };

const Hotspot: React.FC<HotspotProps> = ({ hotspot }) => {
  const {
    feature,
    description: { long: descriptionLong },
  } = hotspot;

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
      return <IconHotspot hotspot={hotspot} />;
  }
};

export default Hotspot;
