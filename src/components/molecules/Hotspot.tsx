import { useState } from "react";

import HotspotIcon from "@/components/atoms/HotspotIcon";
import Button from "@/components/ui/Button";
import { Hotspot as HotspotType } from "@/types/composition";

type Props = { hotspot: HotspotType };

const Hotspot: React.FC<Props> = ({
  hotspot: {
    feature,
    position,
    description: { short: descriptionShort, long: descriptionLong },
    detail,
  },
}) => {
  const longDescriptionIsLink = !!descriptionLong?.startsWith("http");

  const [showDetails, setShowDetails] = useState(false);

  let Content: React.ReactNode;

  // TODO: Add more cases / Open the detail link
  switch (feature) {
    case "WINDOW STICKER":
      Content = <Button>WINDOW STICKER</Button>;
      break;
    case "CARFAX":
      Content = <Button>CARFAX</Button>;
      break;
    default:
      Content = (
        <HotspotIcon>
          <img
            className="size-full invert"
            src="https://cdn.car-cutter.com/libs/web-player/v2/assets/icons/ui/add.svg"
            alt="Plus"
          />
        </HotspotIcon>
      );
  }

  const handleOnClick = () => {
    if (!detail) {
      return;
    }

    window.open(detail, "_blank");
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
