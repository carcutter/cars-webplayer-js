import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { Hotspot as HotspotType } from "@car-cutter/core";

import {
  HOTSPOT_EXPANDED_PANEL_WIDTH,
  LARGE_MEDIA_QUERY,
  SMALL_MEDIA_QUERY,
} from "../../const/browser";
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

const HOTSPOT_INTERACTION_EVENT = "car-cutter:inline-hotspot-interaction";

type HotspotInteractionEvent = CustomEvent<{
  sourceElement: HTMLElement;
}>;

const getRootEventTarget = (
  element: HTMLElement | null
): Document | ShadowRoot | null => {
  const rootNode = element?.getRootNode();

  if (!rootNode) {
    return null;
  }

  if (
    rootNode instanceof Document ||
    (typeof ShadowRoot !== "undefined" && rootNode instanceof ShadowRoot)
  ) {
    return rootNode;
  }

  return null;
};

// Mirrors the `w-72 max-w-[70vw] small:w-80 large:w-96` classes applied to the
// inline detail panel when expanded. Used to pick the flip direction based on
// the panel's *expanded* width (not the collapsed pill) so the expanded panel
// stays within the media on whichever side it opens.
const getExpandedPanelWidth = (): number => {
  if (typeof window === "undefined") {
    return HOTSPOT_EXPANDED_PANEL_WIDTH.base;
  }

  let width: number = HOTSPOT_EXPANDED_PANEL_WIDTH.base;
  if (window.matchMedia(LARGE_MEDIA_QUERY).matches) {
    width = HOTSPOT_EXPANDED_PANEL_WIDTH.large;
  } else if (window.matchMedia(SMALL_MEDIA_QUERY).matches) {
    width = HOTSPOT_EXPANDED_PANEL_WIDTH.small;
  }

  // Mirror the `max-w-[70vw]` cap on the expanded panel.
  return Math.min(width, window.innerWidth * 0.7);
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
  // Hotspots that only carry a title + description (no image/link/pdf detail)
  // expand their label inline instead of opening the side details pane.
  const inlineExpandable = !withDetail && !!description;
  const hotspotLinkRef = useRef<HTMLAnchorElement | null>(null);
  const hotspotDivRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const [shouldFlipTitle, setShouldFlipTitle] = useState(false);
  const [expanded, setExpanded] = useState(false);
  // Keeps the panel laid out (full width / opacity) while the description
  // retracts, so closing animates smoothly instead of snapping.
  const [collapsing, setCollapsing] = useState(false);
  const collapseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCollapseTimeout = useCallback(() => {
    if (collapseTimeoutRef.current !== null) {
      clearTimeout(collapseTimeoutRef.current);
      collapseTimeoutRef.current = null;
    }
  }, []);

  const collapsePanel = useCallback(() => {
    setExpanded(wasExpanded => {
      if (!wasExpanded) {
        return false;
      }
      // Keep the panel laid out while the description retracts.
      setCollapsing(true);
      clearCollapseTimeout();
      // Fallback in case transitionend never fires (e.g. reduced motion)
      collapseTimeoutRef.current = setTimeout(() => {
        setCollapsing(false);
        collapseTimeoutRef.current = null;
      }, 280);
      return false;
    });
  }, [clearCollapseTimeout]);

  const dispatchHotspotInteraction = useCallback(() => {
    const rootElement = hotspotDivRef.current;
    const eventTarget = getRootEventTarget(rootElement);

    if (!rootElement || !eventTarget) {
      return;
    }

    eventTarget.dispatchEvent(
      new CustomEvent(HOTSPOT_INTERACTION_EVENT, {
        detail: { sourceElement: rootElement },
      })
    );
  }, []);

  useEffect(() => clearCollapseTimeout, [clearCollapseTimeout]);

  const DefaultIcon =
    type === "damage" ? (
      <WarningIcon className="size-full" />
    ) : (
      <ImageIcon className="size-full" />
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

    if (inlineExpandable) {
      // Toggle the inline description panel instead of opening the side pane
      if (expanded) {
        collapsePanel();
      } else {
        dispatchHotspotInteraction();
        clearCollapseTimeout();
        setCollapsing(false);
        setExpanded(true);
      }
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
    dispatchHotspotInteraction();
    emitAnalyticsEventHotspotHovered();
  }, [
    over,
    setOver,
    dispatchHotspotInteraction,
    emitAnalyticsEventHotspotHovered,
  ]);

  const onMouseLeave = useCallback(() => {
    if (!over) return;
    setOver(false);
  }, [over, setOver]);

  // Close the inline description panel on Escape or when clicking outside of it
  useEffect(() => {
    if (!expanded) {
      return;
    }

    const rootElement = hotspotDivRef.current;
    const pointerEventTarget = getRootEventTarget(rootElement);

    if (!rootElement || !pointerEventTarget) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        collapsePanel();
      }
    };

    const handlePointerDown = (event: Event) => {
      const eventPath = event.composedPath();
      const isInsideHotspot =
        eventPath.includes(rootElement) ||
        rootElement.contains(event.target as Node);

      if (!isInsideHotspot) {
        collapsePanel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    pointerEventTarget.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      pointerEventTarget.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [expanded, collapsePanel]);

  useEffect(() => {
    if (!inlineExpandable || !expanded) {
      return;
    }

    const rootElement = hotspotDivRef.current;
    const eventTarget = getRootEventTarget(rootElement);

    if (!rootElement || !eventTarget) {
      return;
    }

    const handleHotspotInteraction = (event: Event) => {
      const interactionEvent = event as HotspotInteractionEvent;
      if (interactionEvent.detail.sourceElement !== rootElement) {
        collapsePanel();
      }
    };

    eventTarget.addEventListener(
      HOTSPOT_INTERACTION_EVENT,
      handleHotspotInteraction
    );

    return () => {
      eventTarget.removeEventListener(
        HOTSPOT_INTERACTION_EVENT,
        handleHotspotInteraction
      );
    };
  }, [inlineExpandable, expanded, collapsePanel]);

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

  // Responsive hotspot size using container query width units.
  // The hotspot circle scales proportionally to the container width
  // with a min/max to stay usable on small screens and not grow too large.
  const hotspotSize = "clamp(28px, 3.5cqw, 48px)";
  const hotspotPingSize = "clamp(32px, 4cqw, 56px)";

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

        // Measure available space from the hotspot dot's center, which is the
        // anchor point of the panel (left-0 / right-0 of the dot-centered root).
        // Using the same reference on both sides keeps the comparison symmetric.
        const hotspotCenter = (hotspotRect.left + hotspotRect.right) / 2;
        const availableRight = containerRect.right - hotspotCenter;
        const availableLeft = hotspotCenter - containerRect.left;

        // For hotspots that expand inline, decide the direction based on the
        // panel's *expanded* width so the expanded detail fits the media too —
        // not just the collapsed pill. The expanded width is always >= the pill
        // width, so the chosen side fits both states (no flip on expand).
        const requiredWidth = inlineExpandable
          ? Math.max(titleRect.width, getExpandedPanelWidth())
          : titleRect.width;

        let nextShouldFlip = false;

        if (availableRight >= requiredWidth) {
          nextShouldFlip = false;
        } else if (availableLeft >= requiredWidth) {
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
  }, [withTitle, title, clickable, extendMode, withDetail, inlineExpandable]);

  // While collapsing, keep the panel laid out (wide + opaque) so the
  // description can retract smoothly before reverting to the title pill.
  const panelMounted = expanded || collapsing;

  const sharedClassName = cn(
    "group absolute z-hotspot -translate-x-1/2 -translate-y-1/2 hover:z-hotspot-hover",
    clickable ? "cursor-pointer" : "cursor-default",
    panelMounted && "z-hotspot-hover"
  );

  const sharedStyle = {
    top: `${100 * hotspot.position.y}%`,
    left: `${100 * hotspot.position.x}%`,
  };

  const hotspotContent = (
    <>
      <div
        // Hoverable icon — kept centered on the hotspot coordinate (no relative
        // x-offset) so the painted circle, the CSS :hover region that reveals the
        // title, and the click hit-box are the exact same area. A paint-only
        // offset would shift the visible/hover circle off the click box, creating
        // an edge sliver where hovering shows the title but clicking misses.
        className="relative top-px flex shrink-0 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground"
        style={{
          backgroundColor: hotspotColorVariable,
          width: hotspotSize,
          height: hotspotSize,
        }}
      >
        <div
          // Ping animation
          className="pointer-events-none absolute -z-20 animate-hotspot-ping rounded-full border-0 bg-primary"
          style={{
            backgroundColor: hotspotColorVariable,
            width: hotspotPingSize,
            height: hotspotPingSize,
          }}
        />

        {/* Use the icon from the config if available. Else, replace it if needed */}
        {(withDetail || hotspotConfig?.Icon) && (
          <div
            className="[&_*]:size-full"
            style={{
              width: `calc(${hotspotSize} * 0.57)`,
              height: `calc(${hotspotSize} * 0.57)`,
            }}
          >
            {hotspotConfig?.Icon ? hotspotConfig.Icon : DefaultIcon}
          </div>
        )}
      </div>
      {withTitle && (
        <div
          className={cn(
            "absolute -z-10",
            panelMounted
              ? // Expanded: anchor the panel's top edge to the top of the hotspot
                // dot (its top sits at 50% - hotspotSize/2 + 1px from the top-px
                // offset, applied via inline style below), so the panel grows
                // downward from the hotspot instead of being centered on it.
                // Only animate opacity here; the vertical anchor snaps with the
                // width/padding when toggling so the transform doesn't slide the
                // panel on collapse.
                "transition-opacity duration-200"
              : "-translate-y-1/2 transition-[opacity,transform] duration-200",
            panelMounted
              ? // Expanded: grow to a comfortable reading width, bounded by the media
                "w-72 max-w-[70vw] small:w-80 large:w-96"
              : "w-max max-w-60 small:max-w-64",
            !panelMounted && extendMode && "large:max-w-72",
            shouldFlipTitle ? "right-0" : "left-0",
            panelMounted
              ? "pointer-events-auto opacity-100"
              : cn(
                  "pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100",
                  shouldFlipTitle
                    ? "group-hover:-translate-x-1"
                    : "group-hover:translate-x-1"
                )
          )}
          style={{
            // Anchor relative to the responsive hotspot dot. Expanded: top edge
            // aligns with the dot's top (50% - hotspotSize/2 + 1px for top-px).
            // Collapsed: centered on the dot (50% + 1px), with -translate-y-1/2.
            top: panelMounted
              ? `calc(50% - ${hotspotSize} / 2 + 1px)`
              : "calc(50% + 1px)",
          }}
          ref={titleRef}
        >
          {/* Title row — centered on the hotspot dot when collapsed; top-anchored when expanded */}
          <div
            className={cn(
              "relative flex items-center gap-1.5 border-[0.5px] border-[#64748B] bg-foreground text-background",
              panelMounted
                ? cn(
                    "z-10 border-b-0",
                    // The corner under the hotspot icon matches the circle radius
                    // (hotspotSize / 2, applied via inline style below so it stays
                    // aligned as the dot scales). The opposite corner uses a small
                    // fixed accent radius.
                    // Match top padding to the horizontal padding; keep the bottom tight so the
                    // description butts directly against the title to read as one panel.
                    "px-6 pb-1.5 pt-6 small:px-7 small:pt-7",
                    shouldFlipTitle ? "rounded-tl-[16px]" : "rounded-tr-[16px]"
                  )
                : cn(
                    "rounded-t-full py-1.5",
                    shouldFlipTitle
                      ? "rounded-b-full pl-2.5 pr-6 small:pl-3 small:pr-7"
                      : "rounded-b-full pl-6 pr-2.5 small:pl-7 small:pr-3"
                  )
            )}
            style={
              panelMounted
                ? shouldFlipTitle
                  ? { borderTopRightRadius: `calc(${hotspotSize} / 2)` }
                  : { borderTopLeftRadius: `calc(${hotspotSize} / 2)` }
                : undefined
            }
          >
            <div
              className={cn(
                "font-normal",
                panelMounted
                  ? "min-w-0 flex-1 break-words text-[13px] font-medium"
                  : "truncate text-xs"
              )}
            >
              {title}
            </div>
            {clickable && !inlineExpandable && (
              <span className="flex shrink-0">
                <ArrowRightIcon className="size-5 shrink-0" />
              </span>
            )}
          </div>

          {/* Description — grows downward below the title without moving it */}
          {inlineExpandable && (
            <div
              className={cn(
                "absolute inset-x-0 top-[calc(100%-1px)] grid transition-[grid-template-rows] ease-out",
                expanded
                  ? "grid-rows-[1fr] duration-300"
                  : "grid-rows-[0fr] duration-200"
              )}
              onTransitionEnd={event => {
                // Once the description has fully retracted, revert to the pill
                if (event.propertyName === "grid-template-rows" && !expanded) {
                  clearCollapseTimeout();
                  setCollapsing(false);
                }
              }}
            >
              <div className="min-h-0 overflow-hidden">
                <div
                  className={cn(
                    "max-h-[clamp(4rem,40vh,16rem)] overflow-y-auto overscroll-y-none whitespace-normal break-words rounded-b-[16px] border-x-[0.5px] border-b-[0.5px] border-[#64748B] bg-foreground pb-6 pt-1.5 text-xxs font-normal leading-relaxed text-background small:pb-7",
                    // Align description padding with the expanded title
                    "px-6 small:px-7"
                  )}
                >
                  {description}
                </div>
              </div>
            </div>
          )}
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
