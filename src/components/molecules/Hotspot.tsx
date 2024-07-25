import { useState } from "react";

import { useControlsContext } from "@/providers/ControlsContext";
import { useCustomizationContext } from "@/providers/CustomizationContext";
import type { Hotspot as HotspotType } from "@/types/composition";

type HotspotProps = {
  hotspot: HotspotType;
};
type IconHotspotProps = HotspotProps;

const IconHotspot: React.FC<IconHotspotProps> = ({ hotspot }) => {
  const {
    feature,
    position,
    description: { short: descriptionShort, long: descriptionLong },
    detail,
  } = hotspot;

  const { getIconConfig } = useCustomizationContext();
  const hotspotConfig = getIconConfig(feature);

  const { setShownDetails } = useControlsContext();

  const [showDescription, setShowDescription] = useState(false);

  const clickable = !!detail;

  const onClick = () => {
    if (!detail) {
      return;
    }

    setShownDetails({
      src: detail,
      title: hotspot.description.short,
      text: hotspot.description.long,
    });
  };

  return (
    <div
      className={`absolute ${showDescription ? "z-hotspot-hover" : "z-hotspot"} -translate-x-1/2 -translate-y-1/2 ${clickable ? "cursor-pointer" : "cursor-help"}`}
      onClick={onClick}
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
          className="pointer-events-none absolute inset-0 -z-20 animate-hotspot-ping rounded-full border-2 border-background"
        />

        {/* Use the icon from the config if available. Else, replace it if needed */}
        {hotspotConfig?.Icon ?? (
          <img
            className="invert"
            src="https://cdn.car-cutter.com/libs/web-player/v2/assets/icons/ui/add.svg"
            alt="Plus"
          />
        )}
      </div>
      {showDescription && descriptionShort && (
        <div
          className={`absolute -z-10 ${position.y < 0.6 ? "-top-0.5" : "-bottom-0.5"} ${position.x < 0.7 ? "-left-0.5" : "-right-0.5"} w-max max-w-48 rounded-lg bg-background p-2 pl-8`}
        >
          <div className="space-y-1">
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
