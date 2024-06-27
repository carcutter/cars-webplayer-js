import HotspotIcon from "@/components/atoms/HotspotIcon";
import Button from "@/components/ui/Button";
import { Hotspot as HotspotType } from "@/types/composition";

type Props = { hotspot: HotspotType };

const Hotspot: React.FC<Props> = ({ hotspot: { feature } }) => {
  switch (feature) {
    case "WINDOW STICKER":
      return <Button>WINDOW STICKER</Button>;
    case "CARFAX":
      return <Button>CARFAX</Button>;
    default:
      return (
        <HotspotIcon>
          <img
            className="size-full"
            src="https://cdn.car-cutter.com/libs/web-player/v2/assets/icons/ui/add.svg"
            alt="Plus"
          />
        </HotspotIcon>
      );
  }
};

export default Hotspot;
