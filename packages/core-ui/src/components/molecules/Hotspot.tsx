import { useCallback, useMemo, useState } from "react";

import type { Hotspot as HotspotType } from "@car-cutter/core";

import { useControlsContext } from "../../providers/ControlsContext";
import { useCustomizationContext } from "../../providers/CustomizationContext";
import { useGlobalContext } from "../../providers/GlobalContext";
import { cn } from "../../utils/style";
import ArrowRightIcon from "../icons/ArrowRightIcon";
import ImageIcon from "../icons/ImageIcon";
import WarningIcon from "../icons/WarningIcon";

type HotspotProps = {
  hotspot: HotspotType;
  item: {
    item_type: "image";
    item_position: number;
  };
};
type IconHotspotProps = HotspotProps & {
  analyticsValue: object;
};

const IconHotspot: React.FC<IconHotspotProps> = ({
  hotspot,
  item,
  analyticsValue,
}) => {
  const { title, icon, description, detail, type } = hotspot;
  const { emitAnalyticsEvent } = useGlobalContext();
  const {
    extendMode,
    setShownDetails,
    displayedCategoryId,
    displayedCategoryName,
  } = useControlsContext();

  const emitAnalyticsEventHotspot = useCallback(
    (type: "click" | "hover") => {
      const actionName =
        type === "click" ? "Hotspot Clicked" : "Hotspot Hovered";
      const actionField =
        type === "click" ? "hotspot_clicked" : "hotspot_hovered";
      emitAnalyticsEvent({
        type: "interaction",
        current: {
          category_id: displayedCategoryId,
          category_name: displayedCategoryName,
          item_type: item.item_type,
          item_position: item.item_position,
        },
        action: {
          name: actionName,
          field: actionField,
          value: analyticsValue,
        },
      });
    },
    [
      emitAnalyticsEvent,
      displayedCategoryId,
      displayedCategoryName,
      item,
      analyticsValue,
    ]
  );
  const emitAnalyticsEventHotspotClicked = useCallback(() => {
    emitAnalyticsEventHotspot("click");
  }, [emitAnalyticsEventHotspot]);
  const emitAnalyticsEventHotspotHovered = useCallback(() => {
    emitAnalyticsEventHotspot("hover");
  }, [emitAnalyticsEventHotspot]);

  const { getIconConfig } = useCustomizationContext();
  const hotspotConfig = icon ? getIconConfig(icon) : undefined;

  const withImage = detail?.type === "image";
  const clickable = !!description || withImage;
  const withTitle = !!title;

  const DefaultIcon = withImage ? (
    type === "damage" ? (
      <WarningIcon className="size-4" />
    ) : (
      <ImageIcon className="size-4" />
    )
  ) : (
    <div className="size-1" />
  );

  const onClick = () => {
    if (!clickable) {
      return;
    }

    emitAnalyticsEventHotspotClicked();

    setShownDetails({
      src: withImage ? detail.src : undefined,
      title: title,
      text: description,
    });
  };

  const [over, setOver] = useState(false);
  const onMouseEnter = useCallback(() => {
    if (over) return;
    setOver(true);
    emitAnalyticsEventHotspotHovered();
  }, [over, setOver, emitAnalyticsEventHotspotHovered]);

  const onMouseLeave = useCallback(() => {
    if (!over) return;
    setOver(false);
  }, [over, setOver]);

  // Determine which CSS variable to use based on hotspot type
  const getHotspotColorVariable = useCallback(() => {
    if (type === "damage") {
      return "var(--hotspot-damage-color)";
    }
    if (type === "feature") {
      return "var(--hotspot-feature-color)";
    }
    // Default: if no type, use feature color with fallback to primary
    return "var(--hotspot-feature-color)";
  }, [type]);

  const hotspotColorVariable = getHotspotColorVariable();

  return (
    <div
      className={cn(
        "group absolute z-hotspot -translate-x-1/2 -translate-y-1/2 hover:z-hotspot-hover",
        clickable ? "cursor-pointer" : "cursor-default"
      )}
      style={{
        top: `${100 * hotspot.position.y}%`,
        left: `${100 * hotspot.position.x}%`,
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        // Hoverable icon
        className={cn(
          "relative top-px flex shrink-0 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground",
          withImage ? "left-[-5px] size-7" : "-left-px size-4"
        )}
        style={{ backgroundColor: hotspotColorVariable }}
      >
        <div
          // Ping animation
          className="pointer-events-none absolute -z-20 size-8 animate-hotspot-ping rounded-full border-0 bg-primary"
          style={{ backgroundColor: hotspotColorVariable }}
        />

        {/* Use the icon from the config if available. Else, replace it if needed */}
        <div className={cn(withImage ? "size-4 [&_*]:size-4" : "size-1")}>
          {hotspotConfig?.Icon ? hotspotConfig.Icon : DefaultIcon}
        </div>
      </div>
      {withTitle && (
        <div
          className={cn(
            "absolute bottom-0 left-0 -z-10 flex w-max max-w-60 items-center gap-1.5 rounded-t-full rounded-br-full bg-foreground py-1.5 text-background transition-[opacity,transform] duration-200 group-hover:translate-x-1 small:max-w-64",
            extendMode && "large:max-w-72",
            withImage
              ? "rounded-bl-[10px] pl-6 small:pl-7"
              : "rounded-bl-[8px] pl-5 small:pl-6",
            "pr-2.5 small:pr-3",
            "pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100"
          )}
        >
          <div className="truncate text-xs font-normal">
            {title}
          </div>
          {clickable && <ArrowRightIcon className="size-5 shrink-0" />}
        </div>
      )}
    </div>
  );
};

const Hotspot: React.FC<HotspotProps> = ({ hotspot, item }) => {
  const { detail, title, description, position } = hotspot;

  const text = useMemo(
    () =>
      title || description
        ? {
            ...(title ? { title } : {}),
            ...(description ? { description } : {}),
          }
        : undefined,
    [title, description]
  );

  const hotspotInfo = useMemo(
    () =>
      text || position
        ? {
            ...(text ? { text } : {}),
            ...(position ? { position } : {}),
          }
        : undefined,
    [text, position]
  );

  const analyticsValue = useMemo(
    () => ({
      ...(hotspotInfo ? { hotspot: hotspotInfo } : {}),
      ...(detail ? { detail } : {}),
    }),
    [hotspotInfo, detail]
  );

  const IconComp = (
    <IconHotspot
      hotspot={hotspot}
      item={item}
      analyticsValue={analyticsValue}
    />
  );

  return IconComp;
};

export default Hotspot;
