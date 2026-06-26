import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { Hotspot as HotspotType } from "@car-cutter/core";

import {
  BREAKPOINT_HOTSPOT_SIDE_PANEL,
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
  const { emitAnalyticsEvent, playerWidth } = useGlobalContext();
  // Below the side-panel breakpoint the web-player is too narrow for the inline
  // description panel, so expandable hotspots open the shared side pane instead.
  // The `> 0` guard avoids treating the pre-measurement initial state as compact.
  const isCompactPlayer =
    playerWidth > 0 && playerWidth < BREAKPOINT_HOTSPOT_SIDE_PANEL;
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
  // Max height (px) the inline description may grow to before it would overflow
  // the bottom of the media container. `null` until measured (falls back to the
  // CSS clamp). Recomputed by the placement effect on resize/expand.
  const [descriptionMaxHeight, setDescriptionMaxHeight] = useState<
    number | null
  >(null);
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
      // When the player is narrow, open the shared side panel (like image
      // hotspots) instead of the cramped inline description panel.
      if (isCompactPlayer) {
        setShownDetails({ title, text: description });
        return;
      }

      // Desktop/tablet: toggle the inline description panel instead of opening
      // the side pane.
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

  // If the player shrinks below the side-panel breakpoint while the inline panel
  // is open (e.g. responsive resize), collapse it: at that width these hotspots
  // open the side pane instead, so a lingering inline panel would co-exist with it.
  useEffect(() => {
    if (inlineExpandable && expanded && isCompactPlayer) {
      collapsePanel();
    }
  }, [inlineExpandable, expanded, isCompactPlayer, collapsePanel]);

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

  // Padding on the side where the dot sits, so the title/description text always
  // clears the dot as it grows. The title pill is anchored at the dot's outer edge
  // (left-0 of the dot-sized root), so the text must clear the full dot width plus
  // a fixed gap — not just the radius.
  const dotSidePadding = `calc(${hotspotSize} + 0.5rem)`;
  const dotSidePaddingStyle = shouldFlipTitle
    ? { paddingRight: dotSidePadding }
    : { paddingLeft: dotSidePadding };

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
        // On a compact player the panel never expands inline (it opens the side
        // pane instead), so only the collapsed pill width matters there.
        const requiredWidth =
          inlineExpandable && !isCompactPlayer
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

        // Cap the inline description so the panel never overflows the bottom of
        // the media container. The panel is top-anchored at the dot, so the room
        // available below = container bottom − dot top − the title row height
        // (which sits above the description) − a small margin off the edge.
        if (inlineExpandable) {
          const titleRowEl =
            titleElement.firstElementChild as HTMLElement | null;
          const titleRowHeight = titleRowEl
            ? titleRowEl.getBoundingClientRect().height
            : titleRect.height;
          const dotTopInContainer = hotspotRect.top - containerRect.top;
          const VERTICAL_MARGIN = 8;
          const available =
            containerRect.height -
            dotTopInContainer -
            titleRowHeight -
            VERTICAL_MARGIN;
          // Keep a usable minimum and an upper bound matching the CSS clamp ceiling.
          const nextMaxHeight = Math.round(
            Math.min(Math.max(available, 64), 256)
          );

          setDescriptionMaxHeight(current =>
            current === nextMaxHeight ? current : nextMaxHeight
          );
        }
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
  }, [
    withTitle,
    title,
    clickable,
    extendMode,
    withDetail,
    inlineExpandable,
    isCompactPlayer,
    expanded,
  ]);

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
                    // fixed accent radius. The dot-side padding is applied inline
                    // (dotSidePaddingStyle) so the title text clears the dot as it
                    // grows; the far side keeps its fixed padding.
                    // Match top padding to the far-side padding; keep the bottom tight so the
                    // description butts directly against the title to read as one panel.
                    "px-6 pb-1.5 pt-6 small:px-7 small:pt-7",
                    shouldFlipTitle ? "rounded-tl-[16px]" : "rounded-tr-[16px]"
                  )
                : cn(
                    "rounded-full py-1.5",
                    // Dot-side padding comes from dotSidePaddingStyle; only the
                    // far side is fixed here.
                    shouldFlipTitle ? "pl-2.5 small:pl-3" : "pr-2.5 small:pr-3"
                  )
            )}
            style={
              panelMounted
                ? {
                    ...dotSidePaddingStyle,
                    ...(shouldFlipTitle
                      ? { borderTopRightRadius: `calc(${hotspotSize} / 2)` }
                      : { borderTopLeftRadius: `calc(${hotspotSize} / 2)` }),
                  }
                : dotSidePaddingStyle
            }
          >
            <div
              className={cn(
                "font-normal",
                panelMounted
                  ? "min-w-0 flex-1 break-words font-medium"
                  : "truncate"
              )}
              style={{
                // Scale the title with the hotspot dot so text and dot grow in
                // lockstep. Fractions preserve the prior fixed sizes at the
                // dot's 28px minimum (~13px expanded, ~12px collapsed).
                fontSize: panelMounted
                  ? `calc(${hotspotSize} * 0.46)`
                  : `calc(${hotspotSize} * 0.43)`,
              }}
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
              <div className="relative min-h-0 overflow-hidden rounded-b-[16px]">
                <div
                  className={cn(
                    "max-h-[clamp(4rem,40vh,16rem)] overflow-y-auto overscroll-y-none whitespace-normal break-words rounded-b-[16px] border-x-[0.5px] border-b-[0.5px] border-[#64748B] bg-foreground pb-6 pt-1.5 font-normal leading-relaxed text-background no-scrollbar small:pb-7",
                    // Far-side padding is fixed; the dot-side padding comes from
                    // dotSidePaddingStyle so the text aligns with the expanded title.
                    "px-6 small:px-7"
                  )}
                  style={{
                    // Scale the description with the hotspot dot. Fraction preserves
                    // the prior ~11px size at the dot's 28px minimum.
                    fontSize: `calc(${hotspotSize} * 0.39)`,
                    // Align the description's dot-side indent with the title text.
                    ...dotSidePaddingStyle,
                    // Cap to the room measured below the dot so the panel stays
                    // within the media container (falls back to the CSS clamp).
                    ...(descriptionMaxHeight !== null
                      ? { maxHeight: `${descriptionMaxHeight}px` }
                      : {}),
                  }}
                >
                  {description}
                </div>
                {/* Bottom fade — hints the text continues beyond the visible area */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 rounded-b-[16px] bg-gradient-to-t from-foreground to-transparent" />
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
