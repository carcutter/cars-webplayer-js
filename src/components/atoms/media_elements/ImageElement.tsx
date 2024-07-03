import { useMemo } from "react";

import Hotspot from "@/components/molecules/Hotspot";
import { useCompositionContext } from "@/providers/CompositionContext";
import { useGlobalContext } from "@/providers/GlobalContext";
import { ImageWidth, Item } from "@/types/composition";

function urlForWidth(src: string, width: ImageWidth): string {
  // Extract the file name
  const split = src.split("/");
  const fileName = split.pop();
  const directoryName = split.join("/");

  return [directoryName, width, fileName].join("/");
}

type Props = { item: Extract<Item, { type: "image" }>; withSrcSet?: boolean };

// TODO: Add a way to use a max width
const ImageElement: React.FC<Props> = ({
  item: { src, hotspots },
  withSrcSet,
}) => {
  const { showHotspots } = useGlobalContext();
  const { imageWidths } = useCompositionContext();

  // Genereate srcSet
  const srcSet = useMemo(() => {
    if (!withSrcSet) {
      return;
    }

    const getUrlForWidth = (width: ImageWidth) => urlForWidth(src, width);
    return imageWidths
      .map(width => {
        const url = getUrlForWidth(width);
        return `${url} ${width}w`;
      })
      .join(", ");
  }, [imageWidths, src, withSrcSet]);

  return (
    <div className="relative size-full">
      <img className="size-full" src={src} srcSet={srcSet} alt="" />
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
