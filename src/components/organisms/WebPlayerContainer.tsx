import { useCallback, useEffect } from "react";
import { ZodError } from "zod";

import CloseButton from "@/components/atoms/CloseButton";
import Gallery from "@/components/organisms/Gallery";
import WebPlayerCarrousel from "@/components/organisms/WebPlayerCarrousel";
import ErrorTemplate from "@/components/template/ErrorTemplate";
import Spinner from "@/components/ui/Spinner";
import { useComposition } from "@/hooks/useComposition";
import CompositionContextProvider, {
  useCompositionContext,
} from "@/providers/CompositionContext";
import { useControlsContext } from "@/providers/ControlsContext";
import ControlsContextProvider from "@/providers/ControlsContext";
import { useGlobalContext } from "@/providers/GlobalContext";
import { isSelfEvent } from "@/utils/web";

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

  // Handle click on overlay to disable extend mode
  const handleCloseElementClick = useCallback(
    (e: React.MouseEvent) => {
      // Check if the click originated from the element itself (to avoid closing on children clicks)
      if (!isSelfEvent(e)) {
        return;
      }

      disableExtendMode();
    },
    [disableExtendMode]
  );

  return (
    <div
      // Main Overlay (apply backdrop)
      className={`relative ${!extendMode ? "" : "flex size-full items-center justify-center bg-foreground/75"}`}
      onClick={handleCloseElementClick}
    >
      <div
        // Container : Space for the carrousel and gallery + center vertically in extend mode
        className={
          !extendMode
            ? "space-y-2"
            : "flex size-full flex-col justify-center gap-y-2 py-16 sm:gap-y-4"
        }
        onClick={handleCloseElementClick}
      >
        <div
          // Carrousel Wrapper : Center horizontally and limit width
          className={
            !extendMode
              ? undefined
              : `mx-auto flex min-h-0 w-full max-w-screen-2xl ${aspectRatioClass} justify-center`
          }
          onClick={handleCloseElementClick}
        >
          <WebPlayerCarrousel
            className={!extendMode ? undefined : "h-full min-w-0"}
          />
        </div>
        {permanentGallery && (
          <Gallery className={!extendMode ? undefined : "shrink-0"} />
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
    return (
      <ErrorTemplate
        title="Failed to fetch composition"
        error={error instanceof ZodError ? error.issues : error}
      />
    );
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
