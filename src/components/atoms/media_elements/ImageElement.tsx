import Hotspot from "@/components/molecules/Hotspot";
import { useGlobalContext } from "@/providers/GlobalContext";
import { Item } from "@/types/composition";

type Props = { item: Extract<Item, { type: "image" }> };

const ImageElement: React.FC<Props> = ({ item: { src, hotspots } }) => {
  const { showHotspots } = useGlobalContext();

  return (
    <div className="relative size-full">
      <img key={src} className="size-full" src={src} alt="" />
      {showHotspots &&
        hotspots?.map((hotspot, index) => (
          <div
            key={index}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              top: `${100 * hotspot.position.y}%`,
              left: `${100 * hotspot.position.x}%`,
            }}
          >
            <Hotspot hotspot={hotspot} />
          </div>
        ))}
    </div>
  );
};

export default ImageElement;
