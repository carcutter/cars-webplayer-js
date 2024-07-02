import Hotspot from "@/components/molecules/Hotspot";
import { useGlobalContext } from "@/providers/GlobalContext";
import { Item } from "@/types/composition";
import { HD_WIDTH } from "@/types/props";

// NOTE : we can do better for width typing
function urlForWidth(src: string, width: string): string {
  if (width === HD_WIDTH) {
    return src;
  }

  // Extract the file name
  const split = src.split("/");
  const fileName = split.pop();
  const directoryName = split.join("/");

  return [directoryName, width, fileName].join("/");
}

type Props = { item: Extract<Item, { type: "image" }>; withSrcSet?: boolean };

const ImageElement: React.FC<Props> = ({
  item: { src, hotspots },
  withSrcSet,
}) => {
  const { imageWidths, showHotspots } = useGlobalContext();

  const getUrlForWidth = (width: string) => urlForWidth(src, width);

  // Extract used widths
  const imageWidthList = (withSrcSet ? imageWidths : HD_WIDTH)
    .split("|")
    .sort((widthA, widthB) => {
      if (widthA === HD_WIDTH) {
        return 1;
      } else if (widthB === HD_WIDTH) {
        return -1;
      } else {
        return parseInt(widthA) - parseInt(widthB);
      }
    });
  const higherWidth = imageWidthList.pop()!;

  // Genereate srcSet
  const srcSet = imageWidthList
    .map(width => {
      const url = getUrlForWidth(width);
      return `${url} ${width}w`;
    })
    .join(", ");

  return (
    <div className="relative size-full">
      <img
        className="size-full"
        src={getUrlForWidth(higherWidth)}
        srcSet={srcSet}
        alt=""
      />
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
