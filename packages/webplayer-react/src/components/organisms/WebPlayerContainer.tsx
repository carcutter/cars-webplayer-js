import { useEffect, useRef } from "react";

import { useComposition } from "../../hooks/useComposition";
import CompositionContextProvider, {
  useCompositionContext,
} from "../../providers/CompositionContext";
import ControlsContextProvider, {
  useControlsContext,
} from "../../providers/ControlsContext";
import { useGlobalContext } from "../../providers/GlobalContext";
import CloseButton from "../atoms/CloseButton";
import ErrorTemplate from "../template/ErrorTemplate";
import Spinner from "../ui/Spinner";

import Gallery from "./Gallery";
import WebPlayerCarrousel from "./WebPlayerCarrousel";

const WebPlayerContent: React.FC<React.PropsWithChildren> = () => {
  const { permanentGallery } = useGlobalContext();

  const { aspectRatioClass } = useCompositionContext();

  const {
    prevImage,
    nextImage,

    isShowingDetails,
    resetShownDetails,

    extendMode,
    disableExtendMode,
    isZooming,
    resetZoom,
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
      className={`relative ${!extendMode ? "" : "flex size-full items-center justify-center bg-foreground/75"}`}
    >
      <div
        // Container : Space for the carrousel and gallery + center vertically in extend mode
        ref={containerRef}
        className={
          !extendMode
            ? "space-y-2"
            : "flex size-full flex-col justify-center gap-y-2 sm:gap-y-4"
        }
      >
        <div
          // Carrousel Wrapper : Center horizontally and limit width
          ref={wrapperRef}
          className={
            !extendMode
              ? undefined
              : `mx-auto flex min-h-0 w-full max-w-screen-2xl ${aspectRatioClass} justify-center`
          }
        >
          <WebPlayerCarrousel
            className={!extendMode ? undefined : "h-full min-w-0"}
          />
        </div>
        {permanentGallery && (
          <Gallery className={!extendMode ? undefined : "my-4 shrink-0"} />
        )}
      </div>

      {extendMode && (
        <CloseButton
          className={`absolute right-2 top-2 lg:right-4 lg:top-4`}
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
  const {
    data: composition,
    isSuccess,
    error,
  } = useComposition(compositionUrl);

  if (error) {
    // TODO
    return <ErrorTemplate title="Failed to fetch composition" error={error} />;
  }

  if (!isSuccess) {
    // TODO
    return (
      <div className="flex aspect-4/3 size-full flex-col items-center justify-center gap-y-4">
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
