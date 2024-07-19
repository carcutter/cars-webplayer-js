import { useEffect } from "react";
import { ZodError } from "zod";

import CloseButton from "@/components/atoms/CloseButton";
import WebPlayerOverlay from "@/components/molecules/WebPlayerOverlay";
import WebPlayerCarrousel from "@/components/organisms/WebPlayerCarrousel";
import ErrorTemplate from "@/components/template/ErrorTemplate";
import { useComposition } from "@/hooks/useComposition";
import CompositionContextProvider from "@/providers/CompositionContext";
import { useControlsContext } from "@/providers/ControlsContext";
import ControlsContextProvider from "@/providers/ControlsContext";
import { positionToClassName } from "@/utils/style";

const ExtendWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { extendMode, disableExtendMode } = useControlsContext();

  // Handle escape key to disable extend mode
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        disableExtendMode();
      }
    };

    addEventListener("keydown", handleKeyDown);

    return () => {
      removeEventListener("keydown", handleKeyDown);
    };
  }, [disableExtendMode]);

  if (!extendMode) {
    return children;
  }

  return (
    <div className="fixed inset-0 z-modal flex flex-col items-center justify-center bg-foreground/85">
      {children}
      <CloseButton
        className={`absolute ${positionToClassName("top-right")}`}
        onClick={disableExtendMode}
      />
    </div>
  );
};

const WebPlayerContent: React.FC<React.PropsWithChildren> = () => {
  return (
    <ExtendWrapper>
      <div className="relative h-fit">
        <WebPlayerCarrousel />

        <WebPlayerOverlay />
      </div>
    </ExtendWrapper>
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
