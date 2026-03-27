import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
    item_type: "image" | "360" | "next360";
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

  const hasDetailSrc = !!detail?.src?.trim();
  const withImage = detail?.type === "image" && hasDetailSrc;
  const withLink = detail?.type === "link" && hasDetailSrc;
  const withPdf = detail?.type === "pdf" && hasDetailSrc;
  const withDetail = withImage || withLink || withPdf;
  const clickable = !!description || withDetail;
  const withTitle = !!title;
  const hotspotLinkRef = useRef<HTMLAnchorElement | null>(null);
  const hotspotDivRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const [shouldFlipTitle, setShouldFlipTitle] = useState(false);

  const DefaultIcon = withDetail ? (
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

    if (withLink || withPdf) {
      // Navigation is handled by the semantic <a> element
      return;
    }

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

  useEffect(() => {
    if (!withTitle) {
      return;
    }

    const hotspotElement = hotspotLinkRef.current || hotspotDivRef.current;
    const titleElement = titleRef.current;

    if (!hotspotElement || !titleElement) {
      return;
    }

    const containerElement =
      (hotspotElement.offsetParent as HTMLElement | null) ||
      hotspotElement.parentElement;

    if (!containerElement) {
      return;
    }

    let frameId: number | null = null;

    const updatePlacement = () => {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }

      frameId = requestAnimationFrame(() => {
        frameId = null;

        const containerRect = containerElement.getBoundingClientRect();
        const hotspotRect = hotspotElement.getBoundingClientRect();
        const titleRect = titleElement.getBoundingClientRect();

        const availableRight = containerRect.right - hotspotRect.left;
        const availableLeft = hotspotRect.right - containerRect.left;
        const titleWidth = titleRect.width;

        let nextShouldFlip = false;

        if (availableRight >= titleWidth) {
          nextShouldFlip = false;
        } else if (availableLeft >= titleWidth) {
          nextShouldFlip = true;
        } else {
          nextShouldFlip = availableLeft >= availableRight;
        }

        setShouldFlipTitle(current =>
          current === nextShouldFlip ? current : nextShouldFlip
        );
      });
    };

    updatePlacement();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updatePlacement);
      return () => {
        if (frameId !== null) {
          cancelAnimationFrame(frameId);
        }
        window.removeEventListener("resize", updatePlacement);
      };
    }

    const resizeObserver = new ResizeObserver(updatePlacement);
    resizeObserver.observe(containerElement);

    return () => {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }
      resizeObserver.disconnect();
    };
  }, [withTitle, title, clickable, extendMode, withDetail]);

  const sharedClassName = cn(
    "group absolute z-hotspot -translate-x-1/2 -translate-y-1/2 hover:z-hotspot-hover",
    clickable ? "cursor-pointer" : "cursor-default"
  );

  const sharedStyle = {
    top: `${100 * hotspot.position.y}%`,
    left: `${100 * hotspot.position.x}%`,
  };

  const hotspotContent = (
    <>
      <div
        // Hoverable icon
        className={cn(
          "relative top-px flex shrink-0 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground",
          withDetail
            ? shouldFlipTitle
              ? "right-[-5px] size-7"
              : "left-[-5px] size-7"
            : shouldFlipTitle
              ? "-right-px size-4"
              : "-left-px size-4"
        )}
        style={{ backgroundColor: hotspotColorVariable }}
      >
        <div
          // Ping animation
          className="pointer-events-none absolute -z-20 size-8 animate-hotspot-ping rounded-full border-0 bg-primary"
          style={{ backgroundColor: hotspotColorVariable }}
        />

        {/* Use the icon from the config if available. Else, replace it if needed */}
        <div className={cn(withDetail ? "size-4 [&_*]:size-4" : "size-1")}>
          {hotspotConfig?.Icon ? hotspotConfig.Icon : DefaultIcon}
        </div>
      </div>
      {withTitle && (
        <div
          className={cn(
            "absolute bottom-0 -z-10 flex w-max max-w-60 items-center gap-1.5 rounded-t-full bg-foreground py-1.5 text-background transition-[opacity,transform] duration-200 small:max-w-64",
            extendMode && "large:max-w-72",
            shouldFlipTitle
              ? "right-0 rounded-bl-full group-hover:-translate-x-1"
              : "left-0 rounded-br-full group-hover:translate-x-1",
            withDetail
              ? shouldFlipTitle
                ? "rounded-br-[10px] pl-2.5 pr-6 small:pl-3 small:pr-7"
                : "rounded-bl-[10px] pl-6 pr-2.5 small:pl-7 small:pr-3"
              : shouldFlipTitle
                ? "rounded-br-[8px] pl-2.5 pr-5 small:pl-3 small:pr-6"
                : "rounded-bl-[8px] pl-5 pr-2.5 small:pl-6 small:pr-3",
            "pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100"
          )}
          ref={titleRef}
        >
          <div className="truncate text-xs font-normal">{title}</div>
          {clickable && <ArrowRightIcon className="size-5 shrink-0" />}
        </div>
      )}
    </>
  );

  if (withLink || withPdf) {
    return (
      <a
        className={sharedClassName}
        style={sharedStyle}
        ref={hotspotLinkRef}
        href={detail.src}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={title || "Open link"}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {hotspotContent}
      </a>
    );
  }

  return (
    <div
      className={sharedClassName}
      style={sharedStyle}
      ref={hotspotDivRef}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      aria-label={clickable ? title || "View details" : undefined}
    >
      {hotspotContent}
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
