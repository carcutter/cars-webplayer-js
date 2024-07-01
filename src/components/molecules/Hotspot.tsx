import { useState } from "react";

import Button from "@/components/ui/Button";
import { useCustomizationContext } from "@/providers/CustomizationContext";
import { Hotspot as HotspotType } from "@/types/composition";

type HotspotIconProps = {
  colorCss?: string;
};

const HotspotIcon: React.FC<React.PropsWithChildren<HotspotIconProps>> = ({
  colorCss,
  children,
}) => {
  return (
    <div
      className="flex size-6 items-center justify-center rounded-full bg-primary text-background"
      style={{ backgroundColor: colorCss }}
    >
      {children}
    </div>
  );
};

type HotspotProps = { hotspot: HotspotType };

const Hotspot: React.FC<HotspotProps> = ({
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

  let Content: React.ReactNode;

  // TODO: Add more cases
  switch (feature) {
    case "WINDOW STICKER":
      Content = <Button>WINDOW STICKER</Button>;
      break;
    case "CARFAX":
      Content = <Button>CARFAX</Button>;
      break;
    default:
      Content = (
        <HotspotIcon colorCss={hotspotConfig?.color}>
          {hotspotConfig?.Icon ?? (
            <img
              className="size-full invert"
              src="https://cdn.car-cutter.com/libs/web-player/v2/assets/icons/ui/add.svg"
              alt="Plus"
            />
          )}
        </HotspotIcon>
      );
  }

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
      {Content}
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

export default Hotspot;
