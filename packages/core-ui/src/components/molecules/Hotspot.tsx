import type { Hotspot as HotspotType } from "@car-cutter/core";

import { useControlsContext } from "../../providers/ControlsContext";
import { useCustomizationContext } from "../../providers/CustomizationContext";
import { cn } from "../../utils/style";
import ImageIcon from "../icons/ImageIcon";

type HotspotProps = {
  hotspot: HotspotType;
};
type IconHotspotProps = HotspotProps;

const IconHotspot: React.FC<IconHotspotProps> = ({ hotspot }) => {
  const { title, icon, description, position, detail } = hotspot;

  const { getIconConfig } = useCustomizationContext();
  const hotspotConfig = icon ? getIconConfig(icon) : undefined;

  const { extendMode, setShownDetails } = useControlsContext();

  const clickable = !!detail;
  const withImage = detail?.type === "image";
  const withText = !!title || !!description;

  const DefaultIcon = withImage ? (
    <ImageIcon className="size-4" />
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
      title: title,
      text: description,
    });
  };

  return (
    <div
      className={cn(
        "group absolute z-hotspot -translate-x-1/2 -translate-y-1/2 hover:z-hotspot-hover",
        clickable ? "cursor-pointer" : "cursor-help"
      )}
      style={{
        top: `${100 * hotspot.position.y}%`,
        left: `${100 * hotspot.position.x}%`,
      }}
      onClick={onClick}
    >
      <div
        // Hoverable icon
        className="relative flex items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground"
      >
        <div
          // Ping animation
          className="pointer-events-none absolute -z-20 size-8 animate-hotspot-ping rounded-full border-2 border-background"
        />

        {/* Use the icon from the config if available. Else, replace it if needed */}
        <div className="p-1">
          {hotspotConfig?.Icon ? (
            <div className="size-4">{hotspotConfig.Icon}</div>
          ) : (
            DefaultIcon
          )}
        </div>
      </div>
      {!withImage && withText && (
        <div
          className={cn(
            "absolute -z-10 w-max max-w-40 text-pretty rounded-ui bg-background p-2 small:max-w-48",
            extendMode && "large:max-w-56",
            position.y < 0.55 ? "-top-1" : "-bottom-1",
            position.x < 0.55
              ? "-left-1 pl-6 small:pl-8"
              : "-right-1 pr-4 small:pr-6",
            "pointer-events-none opacity-0 transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100"
          )}
        >
          <div className="space-y-1 text-pretty">
            {title && (
              <div className="text-sm font-semibold small:text-base small:font-bold">
                {title}
              </div>
            )}
            {description && (
              <div className="text-xs text-foreground/65 small:text-sm">
                {description}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Hotspot: React.FC<HotspotProps> = ({ hotspot }) => {
  const { detail } = hotspot;

  const IconComp = <IconHotspot hotspot={hotspot} />;

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
