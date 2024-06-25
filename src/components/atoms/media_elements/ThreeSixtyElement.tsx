import { Item } from "@/types/composition";
import { useRef, useState } from "react";
import ImageElement from "./ImageElement";

type Props = { item: Extract<Item, { type: "360" }> };

const ThreeSixtyElement: React.FC<Props> = ({ item: { images, hotspots } }) => {
  const slider = useRef<HTMLDivElement>(null);

  const [imageIndex, setImageIndex] = useState(0);
  const length = images.length;

  return (
    <div ref={slider} className="cursor-crosshair">
      <ImageElement
        item={{
          type: "image",
          src: images[imageIndex],
          hotspots: hotspots[imageIndex],
        }}
      />
    </div>
  );
};

export default ThreeSixtyElement;
