import { useControlsContext } from "@/providers/ControlsContext";
import { useCustomizationContext } from "@/providers/CustomizationContext";
import type { Hotspot as HotspotType } from "@/types/composition";

type HotspotProps = {
  hotspot: HotspotType;
};
type IconHotspotProps = HotspotProps;

const IconHotspot: React.FC<IconHotspotProps> = ({ hotspot }) => {
  const { feature, position, description, detail } = hotspot;

  const { getIconConfig } = useCustomizationContext();
  const hotspotConfig = getIconConfig(feature);

  const { setShownDetails } = useControlsContext();

  const clickable = !!detail;
  const withImage = detail?.type === "image";

  const DefaultIcon = withImage ? (
    <img
      className="h-4"
      src="https://cdn.car-cutter.com/libs/web-player/v3/assets/icons/ui/image.svg"
      alt="Image"
    />
  ) : (
    <div className="size-1" />
  );

  const onClick = () => {
    if (!withImage) {
      // Do nothing as the <a> tag will handle the click
      return;
    }

    setShownDetails({
      src: detail.src,
      title: description?.short,
      text: description?.long,
    });
  };

  return (
    <div
      className={`group absolute z-hotspot -translate-x-1/2 -translate-y-1/2 ${clickable ? "cursor-pointer" : "cursor-help"} hover:z-hotspot-hover`}
      style={{
        top: `${100 * hotspot.position.y}%`,
        left: `${100 * hotspot.position.x}%`,
      }}
      onClick={onClick}
    >
      <div
        // Hoverable icon
        className="relative flex items-center justify-center rounded-full border-2 border-background bg-primary text-background"
        // Override the background color with the one from the config if available
        style={{ backgroundColor: hotspotConfig?.color }}
      >
        <div
          // Ping animation
          className="pointer-events-none absolute -z-20 size-8 animate-hotspot-ping rounded-full border-2 border-background"
        />

        {/* Use the icon from the config if available. Else, replace it if needed */}
        {hotspotConfig?.Icon ? (
          <div className="size-5">{hotspotConfig.Icon}</div>
        ) : (
          <div className="p-1">{DefaultIcon}</div>
        )}
      </div>
      {!withImage && description && (
        <div
          className={`absolute -z-10 ${position.y < 0.6 ? "-top-0.5" : "-bottom-0.5"} ${position.x < 0.7 ? "-left-0.5" : "-right-0.5"} pointer-events-none w-max max-w-48 rounded-lg bg-background p-2 pl-8 opacity-0 transition-opacity duration-300 group-hover:pointer-events-auto group-hover:opacity-100`}
        >
          <div className="space-y-1">
            <div className="text-sm">{description.short}</div>
            {description.long && (
              <div className="text-xs">{description.long}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Hotspot: React.FC<HotspotProps> = ({ hotspot }) => {
  const { feature, detail } = hotspot;

  let IconComp: React.ReactNode;

  switch (feature) {
    case "WINDOW STICKER":
      IconComp = (
        <img
          className="h-10"
          src="https://cdn.car-cutter.com/libs/web-player/v2/assets/images/customers/autonation/window_sticker.png"
          alt="Window sticker"
        />
      );
      break;
    case "CARFAX":
      IconComp = (
        <img
          className="h-10"
          src="https://cdn.car-cutter.com/libs/web-player/v2/assets/images/customers/autonation/carfax.png"
          alt="Carfax"
        />
      );
      break;
    default:
      IconComp = <IconHotspot hotspot={hotspot} />;
      break;
  }

  switch (detail?.type) {
    case "link":
    case "pdf":
      return (
        <a href={detail.src} target="_blank" rel="noreferrer">
          {IconComp}
        </a>
      );
    default:
      return IconComp;
  }
};

export default Hotspot;
