import { useCompositionContext } from "../../providers/CompositionContext";
import { useControlsContext } from "../../providers/ControlsContext";
import { useGlobalContext } from "../../providers/GlobalContext";
import { CustomizableItem } from "../../types/customizable_item";
import { cn } from "../../utils/style";
import CdnImage from "../atoms/CdnImage";
import ImageIcon from "../icons/ImageIcon";
import InteriorThreeSixtyIcon from "../icons/InteriorThreeSixtyIcon";
import PlayIcon from "../icons/PlayIcon";
import ThreeSixtyIcon from "../icons/ThreeSixtyIcon";

const GalleryImage: React.FC<{ src: string | undefined; withCdn: boolean }> = ({
  src,
  withCdn,
}) => {
  const { permanentGallery } = useGlobalContext();

  if (!src) {
    return null;
  }

  const className = "size-full object-cover";

  if (!withCdn) {
    return <img className={className} src={src} />;
  }

  return (
    <CdnImage
      className={className}
      src={src}
      onlyThumbnail
      fadeIn={!permanentGallery}
    />
  );
};

const GalleryIconWrapper: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { extendMode } = useControlsContext();

  return (
    <div
      className={cn(
        "flex aspect-square h-3/4 items-center justify-center rounded-full bg-foreground/50 p-1",
        extendMode && "large:h-3/5 large:p-2"
      )}
    >
      {children}
    </div>
  );
};

type GalleryElementProps = { item: CustomizableItem };

const GalleryElement: React.FC<GalleryElementProps> = ({ item }) => {
  const { aspectRatioStyle } = useCompositionContext();

  const { type } = item;

  let imgSrc: string | undefined;
  let withCdn: boolean;

  switch (type) {
    case "360":
      imgSrc = item.images[0].src;
      withCdn = true;
      break;
    case "interior-360":
      imgSrc = item.thumbnailSrc;
      withCdn = true;
      break;
    case "image":
      imgSrc = item.src;
      withCdn = true;
      break;
    case "video":
      imgSrc = item.poster;
      withCdn = true;
      break;
    case "custom":
      imgSrc = item.thumbnailSrc;
      withCdn = false;
      break;
    default:
      withCdn = false;
  }

  const imgNode = <GalleryImage src={imgSrc} withCdn={withCdn} />;

  let overlayIcon: React.ReactNode;

  switch (type) {
    case "360":
      overlayIcon = (
        <GalleryIconWrapper>
          <ThreeSixtyIcon className="size-full text-primary-light" />
        </GalleryIconWrapper>
      );
      break;
    case "interior-360":
      overlayIcon = (
        <GalleryIconWrapper>
          <InteriorThreeSixtyIcon className="size-full text-primary-light" />
        </GalleryIconWrapper>
      );
      break;
    case "video":
      overlayIcon = (
        <GalleryIconWrapper>
          <PlayIcon className="size-full p-0.5 text-background" />
        </GalleryIconWrapper>
      );
      break;
    case "custom":
      overlayIcon = !imgSrc ? (
        <GalleryIconWrapper>
          <ImageIcon className="size-full p-0.5 text-background" />
        </GalleryIconWrapper>
      ) : null;
      break;
  }

  return (
    <div className="relative bg-foreground/30" style={aspectRatioStyle}>
      {imgNode}
      {overlayIcon && (
        <div className="absolute inset-0 flex items-center justify-center bg-foreground/25">
          {overlayIcon}
        </div>
      )}
    </div>
  );
};

export default GalleryElement;
