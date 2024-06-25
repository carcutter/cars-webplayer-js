import { Item } from "@/types/composition";
import Hotspot from "../../molecules/Hotspot";

type Props = { item: Extract<Item, { type: "image" }> };

const ImageElement: React.FC<Props> = ({ item: { src, hotspots } }) => {
  return (
    <>
      <img key={src} className="size-full" src={src} alt="" />
      {hotspots?.map((hotspot, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            top: `${100 * hotspot.position.y}%`,
            left: `${100 * hotspot.position.x}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <Hotspot hotspot={hotspot} />
        </div>
      ))}
    </>
  );
};

export default ImageElement;
