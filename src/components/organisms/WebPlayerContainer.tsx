import { useCallback } from "react";
import { ZodError } from "zod";

import CloseButton from "@/components/atoms/CloseButton";
import Gallery from "@/components/organisms/Gallery";
import WebPlayerCarrousel from "@/components/organisms/WebPlayerCarrousel";
import ErrorTemplate from "@/components/template/ErrorTemplate";
import { useComposition } from "@/hooks/useComposition";
import { useEscapeKeyEffect } from "@/hooks/useEscapeKeyEffect";
import CompositionContextProvider from "@/providers/CompositionContext";
import { useControlsContext } from "@/providers/ControlsContext";
import ControlsContextProvider from "@/providers/ControlsContext";
import { useGlobalContext } from "@/providers/GlobalContext";
import { positionToClassName } from "@/utils/style";
import { isFirstChildEvent, isSelfEvent } from "@/utils/web";

const WebPlayerContent: React.FC<React.PropsWithChildren> = () => {
  const { permanentGallery } = useGlobalContext();

  const { extendMode, disableExtendMode, isZooming, showingDetails } =
    useControlsContext();

  // Handle escape key to disable extend mode
  useEscapeKeyEffect(
    useCallback(() => {
      if (isZooming || showingDetails || !extendMode) {
        return;
      }
      disableExtendMode();
    }, [disableExtendMode, extendMode, isZooming, showingDetails])
  );

  // Handle click on overlay to disable extend mode
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      // Check if the click originated from the overlay itself or the firstChild which is only to place the content in the center
      if (!isSelfEvent(e) && !isFirstChildEvent(e)) {
        return;
      }

      disableExtendMode();
    },
    [disableExtendMode]
  );

  return (
    <div
      className={`relative ${!extendMode ? "" : "flex size-full items-center justify-center bg-foreground/75"}`}
      onClick={handleOverlayClick}
    >
      <div
        className={
          !extendMode
            ? "space-y-2"
            : "flex size-full max-h-[calc(100%-128px)] flex-col justify-center gap-y-2 sm:gap-y-4"
        }
      >
        <WebPlayerCarrousel
          className={!extendMode ? undefined : "mx-auto max-w-screen-xl"}
        />
        {permanentGallery && (
          <Gallery className={!extendMode ? undefined : "shrink-0"} />
        )}
      </div>

      {extendMode && (
        <CloseButton
          className={`absolute ${positionToClassName("top-right")} lg:right-4 lg:top-4`}
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
      <div className="flex items-center justify-center">
        Loading WebPlayer...
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
