import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { Hotspot as HotspotType } from "@car-cutter/core";

import {
  BREAKPOINT_HOTSPOT_SIDE_PANEL,
  HOTSPOT_EXPANDED_PANEL_WIDTH,
  HOTSPOT_INLINE_IMAGE_MAX_DESCRIPTION_LENGTH,
  HOTSPOT_INLINE_IMAGE_MAX_TITLE_LENGTH,
  LARGE_MEDIA_QUERY,
  SMALL_MEDIA_QUERY,
} from "../../const/browser";
import { useCompositionContext } from "../../providers/CompositionContext";
import { useControlsContext } from "../../providers/ControlsContext";
import { useCustomizationContext } from "../../providers/CustomizationContext";
import { useGlobalContext } from "../../providers/GlobalContext";
import { cn } from "../../utils/style";
import CdnImage from "../atoms/CdnImage";
import ArrowRightIcon from "../icons/ArrowRightIcon";
import HotspotImageIcon from "../icons/HotspotImageIcon";
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

  const { aspectRatioStyle } = useCompositionContext();
  const { getIconConfig } = useCustomizationContext();
  const hotspotConfig = icon ? getIconConfig(icon) : undefined;

  const hasDetailSrc = !!detail?.src?.trim();
  const withImage = detail?.type === "image" && hasDetailSrc;
  const withLink = detail?.type === "link" && hasDetailSrc;
  const withPdf = detail?.type === "pdf" && hasDetailSrc;
  const withDetail = withImage || withLink || withPdf;
  const withTitle = !!title;
  const detailImageSrc = withImage ? detail.src : undefined;
  // Hotspots that only carry a title and/or description (no image/link/pdf
  // detail) expand their label inline instead of opening the side details pane.
  // A title-only hotspot expands too, so a truncated title can be read in full.
  const textInlineExpandable = !withDetail && (!!description || withTitle);
  // A title-only panel has no description to wipe in: the title row itself
  // closes the panel, so it opens and closes without the grow/retract step.
  const titleOnlyExpandable = textInlineExpandable && !description;
  const clickable = textInlineExpandable || withDetail;
  // Image hotspots whose text is short enough to read beside the media expand
  // in-context too (image on top, title + description below) instead of opening
  // the side pane. A missing description counts as short; past either limit the
  // pane offers the room a long text needs — and a long title would push the
  // card past the player height. An untitled image keeps its full-bleed
  // side-pane treatment.
  const imageInlineExpandable =
    withImage &&
    withTitle &&
    title.trim().length <= HOTSPOT_INLINE_IMAGE_MAX_TITLE_LENGTH &&
    (description?.trim().length ?? 0) <=
      HOTSPOT_INLINE_IMAGE_MAX_DESCRIPTION_LENGTH;
  const inlineExpandable = textInlineExpandable || imageInlineExpandable;
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
  // Max height (px) the in-context image card may grow to before it would
  // overflow the bottom of the media container. Unlike `descriptionMaxHeight`
  // this caps the *whole* card (image + title + description), which scrolls as
  // one, so it carries no upper bound that would crop the image.
  const [panelMaxHeight, setPanelMaxHeight] = useState<number | null>(null);
  // The detail image is only mounted once the hotspot has been hovered or
  // opened. Every carrousel item renders its hotspots, so mounting eagerly
  // would fetch a detail image for each one of them up front.
  const [imagePrimed, setImagePrimed] = useState(false);
  // Flipped once the detail image reports its own dimensions; until then the
  // card reserves a placeholder box (see `aspectRatioStyle` use below).
  const [imageLoaded, setImageLoaded] = useState(false);
  // Share of the media width the expanded panel takes, so `CdnImage` requests a
  // panel-sized source rather than a full-width one. Measured by the placement
  // effect, which is the only thing that knows the current panel width.
  const [panelWidthRatio, setPanelWidthRatio] = useState(0.4);
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
      if (!wasExpanded || titleOnlyExpandable) {
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
  }, [clearCollapseTimeout, titleOnlyExpandable]);

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

  // Hotspots are keyed by index within an item, so switching category can hand
  // this component a different detail image; drop the stale "measured" flag so
  // the new one reserves its box again.
  useEffect(() => {
    setImageLoaded(false);
  }, [detailImageSrc]);

  const DefaultIcon =
    type === "damage" ? (
      <WarningIcon className="size-full" />
    ) : (
      <HotspotImageIcon className="size-full" />
    );

  const openSideDetails = useCallback(() => {
    setShownDetails({
      src: detailImageSrc,
      title: title,
      text: description,
    });
  }, [detailImageSrc, title, description, setShownDetails]);

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
      // When the player is narrow, open the shared side panel instead of the
      // cramped in-context panel.
      if (isCompactPlayer) {
        openSideDetails();
        return;
      }

      // Desktop/tablet: toggle the in-context panel instead of opening the side
      // pane.
      if (expanded) {
        collapsePanel();
      } else {
        setImagePrimed(true);
        dispatchHotspotInteraction();
        clearCollapseTimeout();
        setCollapsing(false);
        setExpanded(true);
      }
      return;
    }

    openSideDetails();
  };

  const [over, setOver] = useState(false);
  const onMouseEnter = useCallback(() => {
    if (over) return;
    setOver(true);
    // On a compact player the card never expands (clicks open the side pane,
    // which fetches its own full-width source), so priming here would download
    // a panel-sized variant that is never shown.
    if (!isCompactPlayer) {
      setImagePrimed(true);
    }
    dispatchHotspotInteraction();
    emitAnalyticsEventHotspotHovered();
  }, [
    over,
    setOver,
    isCompactPlayer,
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

  // Radius of the panel corner sitting under the hotspot dot. Matching the dot's
  // own radius makes the circle nestle exactly into the cut corner as it scales.
  const dotCornerRadiusStyle = shouldFlipTitle
    ? { borderTopRightRadius: `calc(${hotspotSize} / 2)` }
    : { borderTopLeftRadius: `calc(${hotspotSize} / 2)` };

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
        const expandedPanelWidth = getExpandedPanelWidth();
        const requiredWidth =
          inlineExpandable && !isCompactPlayer
            ? Math.max(titleRect.width, expandedPanelWidth)
            : titleRect.width;

        // `getExpandedPanelWidth()` reads media queries and the window width,
        // so it can only be kept fresh from here — this effect is the one the
        // ResizeObserver re-runs. The container is the media overlay, so its
        // width is the "player width" `imgInPlayerWidthRatio` is relative to.
        if (imageInlineExpandable && containerRect.width > 0) {
          const nextRatio = Math.min(
            1,
            expandedPanelWidth / containerRect.width
          );

          setPanelWidthRatio(current =>
            Math.abs(current - nextRatio) < 0.01 ? current : nextRatio
          );
        }

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

        // Cap the in-context panel so it never overflows the bottom of the
        // media container. Both variants are top-anchored at the dot, so the
        // room available below = container bottom − dot top − a small margin
        // off the edge, minus whatever sits above the scrolling part.
        const dotTopInContainer = hotspotRect.top - containerRect.top;
        const VERTICAL_MARGIN = 8;

        if (imageInlineExpandable) {
          // The image card is one scroll area anchored at the dot's top, so all
          // of it — not just its text — has to fit in the room below the dot.
          // No upper bound here: capping it would crop the image.
          const available =
            containerRect.height - dotTopInContainer - VERTICAL_MARGIN;
          // Clamped at 0 rather than a usable minimum: where there is less
          // room than that, a taller box would not become visible — it would
          // spill past the media, which the carrousel clips — and the scroll
          // area would claim height the user cannot reach.
          const nextPanelMaxHeight = Math.round(Math.max(available, 0));

          setPanelMaxHeight(current =>
            current === nextPanelMaxHeight ? current : nextPanelMaxHeight
          );
        } else if (inlineExpandable) {
          const titleRowEl =
            titleElement.firstElementChild as HTMLElement | null;
          const titleRowHeight = titleRowEl
            ? titleRowEl.getBoundingClientRect().height
            : titleRect.height;
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
    imageInlineExpandable,
    isCompactPlayer,
    expanded,
  ]);

  // While collapsing, keep the panel laid out (wide + opaque) so the
  // description can retract smoothly before reverting to the title pill.
  const panelMounted = expanded || collapsing;
  // Text-only hotspots morph their title pill into the panel's header row.
  // Image hotspots instead render the title inside the card, below the image,
  // so their pill keeps its collapsed shape and just fades out underneath.
  const titleRowExpanded = panelMounted && !imageInlineExpandable;

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
              imageInlineExpandable &&
                cn(
                  "transition-opacity duration-200",
                  panelMounted && "opacity-0"
                ),
              titleRowExpanded && titleOnlyExpandable
                ? // No description below: the title row is the whole panel,
                  // so it carries the bottom padding and rounded corners itself.
                  "rounded-[16px] p-6 small:p-7"
                : titleRowExpanded
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
                      shouldFlipTitle
                        ? "rounded-tl-[16px]"
                        : "rounded-tr-[16px]"
                    )
                  : cn(
                      "rounded-full py-1.5",
                      // Dot-side padding comes from dotSidePaddingStyle; only the
                      // far side is fixed here.
                      shouldFlipTitle
                        ? "pl-2.5 small:pl-3"
                        : "pr-2.5 small:pr-3"
                    )
            )}
            style={
              titleRowExpanded
                ? { ...dotSidePaddingStyle, ...dotCornerRadiusStyle }
                : dotSidePaddingStyle
            }
            aria-hidden={imageInlineExpandable && panelMounted}
          >
            <div
              className={cn(
                "font-normal",
                titleRowExpanded
                  ? "min-w-0 flex-1 break-words font-medium"
                  : "truncate"
              )}
              style={{
                // Scale the title with the hotspot dot so text and dot grow in
                // lockstep. Fractions preserve the prior fixed sizes at the
                // dot's 28px minimum (~13px expanded, ~12px collapsed).
                fontSize: titleRowExpanded
                  ? `calc(${hotspotSize} * 0.46)`
                  : `calc(${hotspotSize} * 0.43)`,
              }}
            >
              {title}
            </div>
            {clickable && !(inlineExpandable && !isCompactPlayer) && (
              <span className="flex shrink-0">
                <ArrowRightIcon className="size-5 shrink-0" />
              </span>
            )}
          </div>

          {/* In-context image card — image on top, title and description below.
              Absolutely positioned over the title pill so it wipes down across
              it while the pill fades out, reading as one morphing panel. */}
          {imageInlineExpandable && (
            <div
              className={cn(
                "absolute inset-x-0 top-0 grid transition-[grid-template-rows] ease-out",
                expanded
                  ? "grid-rows-[1fr] duration-300"
                  : "grid-rows-[0fr] duration-200"
              )}
              onTransitionEnd={event => {
                // Once the card has fully retracted, revert to the pill
                if (event.propertyName === "grid-template-rows" && !expanded) {
                  clearCollapseTimeout();
                  setCollapsing(false);
                }
              }}
            >
              <div
                className={cn(
                  "relative min-h-0 overflow-hidden rounded-[16px]",
                  // Elevation only while the card is laid out: collapsed it sits
                  // at grid-rows-[0fr], where a shadow on the 0-high box would
                  // smudge across the title pill underneath.
                  panelMounted && "shadow-[2px_4px_4px_0_rgba(0,0,0,0.15)]"
                )}
                style={dotCornerRadiusStyle}
              >
                <div
                  className="overflow-y-auto overscroll-y-none rounded-[16px] border-[0.5px] border-[#64748B] bg-foreground text-background no-scrollbar"
                  style={{
                    ...dotCornerRadiusStyle,
                    // Cap to the room measured below the dot so the card stays
                    // within the media container and scrolls instead of
                    // overflowing it.
                    ...(panelMaxHeight !== null
                      ? { maxHeight: `${panelMaxHeight}px` }
                      : {}),
                  }}
                >
                  {imagePrimed && detailImageSrc && (
                    <div
                      className="w-full"
                      // An <img> has no height until it decodes, so without a
                      // reservation the open animation would land on the
                      // text-only height and then jump. Hovering primes the
                      // fetch early on pointer devices, but a tap has no hover
                      // to speak of. Reserve the composition's ratio until the
                      // real one is known — detail shots come from the same
                      // shoot, so this is usually the final height already.
                      style={imageLoaded ? undefined : aspectRatioStyle}
                    >
                      {/* Once loaded, no explicit height: the intrinsic aspect
                          ratio is kept while the image spans the card. */}
                      <CdnImage
                        src={detailImageSrc}
                        alt={title}
                        fadeIn
                        imgInPlayerWidthRatio={panelWidthRatio}
                        className={cn(
                          "block w-full",
                          !imageLoaded && "h-full object-cover"
                        )}
                        onLoad={() => setImageLoaded(true)}
                      />
                    </div>
                  )}
                  <div className="px-6 pb-6 pt-3 small:px-7 small:pb-7">
                    <div
                      className="break-words font-medium"
                      style={{ fontSize: `calc(${hotspotSize} * 0.46)` }}
                    >
                      {title}
                    </div>
                    {!!description && (
                      <div
                        className="mt-1.5 whitespace-normal break-words font-normal leading-relaxed text-hotspot-description"
                        style={{ fontSize: `calc(${hotspotSize} * 0.39)` }}
                      >
                        {description}
                      </div>
                    )}
                  </div>
                </div>
                {/* Bottom fade — hints the content continues beyond the visible area */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 rounded-b-[16px] bg-gradient-to-t from-foreground to-transparent" />
              </div>
            </div>
          )}

          {/* Description — grows downward below the title without moving it */}
          {textInlineExpandable && !!description && (
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
                    "max-h-[clamp(4rem,40vh,16rem)] overflow-y-auto overscroll-y-none whitespace-normal break-words rounded-b-[16px] border-x-[0.5px] border-b-[0.5px] border-[#64748B] bg-foreground pb-6 pt-1.5 font-normal leading-relaxed text-hotspot-description no-scrollbar small:pb-7",
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
      aria-expanded={
        inlineExpandable && !isCompactPlayer ? expanded : undefined
      }
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
