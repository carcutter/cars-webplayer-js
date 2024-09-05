import { useEffect, useRef } from "react";

import {
  EVENT_COMPOSITION_LOAD_ERROR,
  EVENT_COMPOSITION_LOADED,
  EVENT_COMPOSITION_LOADING,
} from "@car-cutter/core";

import { useComposition } from "../../hooks/useComposition";
import CompositionContextProvider, {
  useCompositionContext,
} from "../../providers/CompositionContext";
import ControlsContextProvider, {
  useControlsContext,
} from "../../providers/ControlsContext";
import { useGlobalContext } from "../../providers/GlobalContext";
import { cn } from "../../utils/style";
import CloseButton from "../atoms/CloseButton";
import ErrorTemplate from "../template/ErrorTemplate";
import Spinner from "../ui/Spinner";

import Gallery from "./Gallery";
import WebPlayerCarrousel from "./WebPlayerCarrousel";

const WebPlayerContent: React.FC<React.PropsWithChildren> = () => {
  const { permanentGallery } = useGlobalContext();

  const { aspectRatioStyle } = useCompositionContext();

  const {
    prevImage,
    nextImage,

    isShowingDetails,
    resetShownDetails,

    extendMode,
    disableExtendMode,
    isZooming,
    resetZoom,
    fakeFullScreen,
  } = useControlsContext();

  // - Handle click on overlay to disable extend mode
  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!extendMode) {
      return;
    }

    const overlay = overlayRef.current;
    const container = containerRef.current;
    const wrapper = wrapperRef.current;

    // DOM not ready
    if (!overlay || !container || !wrapper) {
      return;
    }

    let mouseDownOnOverlay = false;

    const eventIsOnOverlay = (event: Event) =>
      [overlay, container, wrapper].includes(event.target as HTMLDivElement);

    const handleMouseDown = (event: MouseEvent) => {
      mouseDownOnOverlay = eventIsOnOverlay(event);
    };

    const handleMouseUp = (event: MouseEvent) => {
      if (!mouseDownOnOverlay) {
        return;
      }

      if (eventIsOnOverlay(event)) {
        disableExtendMode();
      }

      // Reset the ref
      mouseDownOnOverlay = false;
    };

    overlay.addEventListener("mousedown", handleMouseDown);
    overlay.addEventListener("mouseup", handleMouseUp);

    return () => {
      overlay.removeEventListener("mousedown", handleMouseDown);
      overlay.removeEventListener("mouseup", handleMouseUp);
    };
  }, [disableExtendMode, extendMode]);

  // -- Handle keys
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isEscape = event.key === "Escape";
      const canNavigate = !isZooming && !isShowingDetails;

      if (isEscape) {
        if (isZooming) {
          resetZoom();
        } else if (isShowingDetails) {
          resetShownDetails();
        } else {
          disableExtendMode();
        }
      } else if (canNavigate) {
        switch (event.key) {
          case "ArrowLeft":
            prevImage();
            break;
          case "ArrowRight":
            nextImage();
            break;
        }
      }
    };

    addEventListener("keydown", handleKeyDown);

    return () => {
      removeEventListener("keydown", handleKeyDown);
    };
  }, [
    disableExtendMode,
    isShowingDetails,
    isZooming,
    nextImage,
    prevImage,
    resetShownDetails,
    resetZoom,
  ]);

  return (
    <div
      // Main Overlay (apply backdrop + close button)
      ref={overlayRef}
      className={cn(
        !extendMode
          ? "relative"
          : "flex size-full items-center justify-center bg-foreground/75",
        fakeFullScreen && "fixed inset-0 z-overlay"
      )}
    >
      <div
        // Container : Space for the carrousel and gallery + center vertically in extend mode
        ref={containerRef}
        className={
          !extendMode
            ? "space-y-2"
            : "flex size-full flex-col justify-center gap-y-2 small:gap-y-4"
        }
      >
        <div
          // Carrousel Wrapper : Center horizontally and limit width
          ref={wrapperRef}
          className={cn(
            extendMode &&
              "mx-auto flex min-h-0 w-full max-w-[1600px] justify-center"
          )}
          style={aspectRatioStyle}
        >
          <WebPlayerCarrousel className={cn(extendMode && "h-full min-w-0")} />
        </div>
        {permanentGallery && (
          <Gallery className={cn(extendMode && "my-2 shrink-0 small:my-4")} />
        )}
      </div>

      {extendMode && (
        <CloseButton
          className="absolute right-2 top-2 small:right-4 small:top-4"
          onClick={disableExtendMode}
        />
      )}
    </div>
  );
};

type WebPlayerContainerProps = {
  compositionUrl: string;
};

const WebPlayerContainer: React.FC<WebPlayerContainerProps> = ({
  compositionUrl,
}) => {
  const { emitEvent } = useGlobalContext();

  const {
    data: composition,
    status,
    isSuccess,
    error,
  } = useComposition(compositionUrl);

  useEffect(() => {
    if (error) {
      emitEvent(EVENT_COMPOSITION_LOAD_ERROR, error);
    } else if (isSuccess) {
      emitEvent(EVENT_COMPOSITION_LOADED);
    } else if (status === "fetching") {
      emitEvent(EVENT_COMPOSITION_LOADING);
    }
  }, [emitEvent, error, isSuccess, status]);

  if (error) {
    // TODO: Implement error state
    return <ErrorTemplate title="Failed to fetch composition" error={error} />;
  }

  if (!isSuccess) {
    // TODO: Implement loading state
    return (
      <div className="flex aspect-video size-full flex-col items-center justify-center gap-y-4">
        <div className="text-xl">Loading WebPlayer...</div>
        <Spinner color="primary" />
      </div>
    );
  }

  return (
    <CompositionContextProvider composition={composition}>
      <ControlsContextProvider>
        <WebPlayerContent />
      </ControlsContextProvider>
    </CompositionContextProvider>
  );
};

export default WebPlayerContainer;
