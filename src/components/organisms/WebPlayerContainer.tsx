import { useCallback } from "react";
import { ZodError } from "zod";

import CloseButton from "@/components/atoms/CloseButton";
import WebPlayerCarrousel from "@/components/organisms/WebPlayerCarrousel";
import ErrorTemplate from "@/components/template/ErrorTemplate";
import { useComposition } from "@/hooks/useComposition";
import { useEscapeKeyEffect } from "@/hooks/useEscapeKeyEffect";
import CompositionContextProvider from "@/providers/CompositionContext";
import { useControlsContext } from "@/providers/ControlsContext";
import ControlsContextProvider from "@/providers/ControlsContext";
import { positionToClassName } from "@/utils/style";
import { isSelfEvent } from "@/utils/web";

const WebPlayerContent: React.FC<React.PropsWithChildren> = () => {
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
      if (!extendMode) {
        return;
      }

      // Check if the click originated from the overlay itself
      if (!isSelfEvent(e)) {
        return;
      }

      disableExtendMode();
    },
    [disableExtendMode, extendMode]
  );

  return (
    <div
      className={`relative ${!extendMode ? "" : "flex size-full items-center justify-center bg-foreground/75"}`}
      onClick={handleOverlayClick}
    >
      <div
        className={
          !extendMode
            ? undefined
            : "flex size-full items-center justify-center sm:size-5/6"
        }
      >
        <WebPlayerCarrousel />
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
