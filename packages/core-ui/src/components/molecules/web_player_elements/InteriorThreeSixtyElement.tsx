import { Pannellum } from "pannellum-react";
import { useCallback, useEffect, useState } from "react";

import { useControlsContext } from "../../../providers/ControlsContext";
import { useGlobalContext } from "../../../providers/GlobalContext";
import { CustomizableItem } from "../../../types/customizable_item";
import { cn } from "../../../utils/style";
import CdnImage from "../../atoms/CdnImage";
import InteriorThreeSixtyIcon from "../../icons/InteriorThreeSixtyIcon";
import PlayIcon from "../../icons/PlayIcon";
import ErrorTemplate from "../../template/ErrorTemplate";
import Button from "../../ui/Button";

type InteriorThreeSixtyElementProps = Extract<
  CustomizableItem,
  { type: "interior-360" }
> & {
  itemIndex: number;
  onLoaded: () => void;
  onError: () => void;
};

const InteriorThreeSixtyElementInteractive: React.FC<
  InteriorThreeSixtyElementProps
> = props => {
  const { itemIndex, src, poster, onLoaded, onError } = props;

  const { isShowingDetails, setItemInteraction } = useControlsContext();

  const onLoad = useCallback(() => {
    if (itemIndex !== undefined) {
      setItemInteraction(itemIndex, "ready");
    }

    onLoaded?.();
  }, [itemIndex, setItemInteraction, onLoaded]);

  const onMouse = useCallback((e: MouseEvent) => {
    // Ignore event if the user is not using the main button
    if (e.button !== 0) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  }, []);

  return (
    <div className={cn("relative size-full overflow-hidden bg-transparent")}>
      <div
        // Scale effect on show details
        className={cn(
          "size-full duration-details",
          isShowingDetails ? "scale-105" : "scale-100"
        )}
      >
        <Pannellum
          id="pannellum"
          panorama={src}
          preview={poster}
          width="100%"
          height="100%"
          image={src}
          pitch={0}
          yaw={0}
          hfov={100}
          maxHfov={100}
          compass={false}
          showControls={false}
          onLoad={onLoad}
          onError={onError}
          onMousedown={onMouse}
          onTouchstart={onMouse}
          onTouchend={onMouse}
          onMouseup={onMouse}
          autoLoad={true}
        >
          <Pannellum.Hotspot
            type="info"
            pitch={11}
            yaw={-167}
            text="Info Hotspot Text 3"
            URL="https://github.com/farminf/pannellum-react"
          />
          <Pannellum.Hotspot
            type="info"
            pitch={11}
            yaw={-0}
            text="Info Hotspot Text 3"
            URL="https://github.com/farminf/pannellum-react"
          />
        </Pannellum>
      </div>
    </div>
  );
};

type InteriorThreeSixtyElementPlaceholderProps = {
  src: string;
  poster?: string;
  onPlaceholderImageLoaded: () => void;
  onLoaded: () => void;
  onError: () => void;
};

const InteriorThreeSixtyElementPlaceholder: React.FC<
  InteriorThreeSixtyElementPlaceholderProps
> = ({ src, poster, onPlaceholderImageLoaded, onLoaded, onError }) => {
  const { autoLoadInterior360 } = useGlobalContext();
  const [loadingStatus, setLoadingStatus] = useState<boolean | null>(null);

  const fetchSpinImages = useCallback(() => {
    if (loadingStatus !== null) {
      return;
    }
    setLoadingStatus(false);
  }, [loadingStatus, setLoadingStatus]);

  const onImageLoaded = useCallback(() => {
    setLoadingStatus(true);
  }, []);

  // If autoLoadInterior360 is enabled, we start loading the images
  useEffect(() => {
    if (autoLoadInterior360) {
      fetchSpinImages();
    }
  }, [autoLoadInterior360, fetchSpinImages]);

  // When all images are loaded, we emit the event
  useEffect(() => {
    if (loadingStatus === true) {
      onLoaded();
    }
  }, [loadingStatus, onLoaded]);

  return (
    <div className="relative size-full">
      {loadingStatus !== null && !loadingStatus && (
        // Add images to DOM to preload them
        <div className="hidden">
          <img key={src} src={src} onLoad={onImageLoaded} onError={onError} />
        </div>
      )}

      {poster && (
        <CdnImage
          className="size-full"
          src={poster}
          onLoad={onPlaceholderImageLoaded}
        />
      )}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-y-4 bg-foreground/35">
        <InteriorThreeSixtyIcon className="size-20 text-primary-light" />

        <Button color="neutral" shape="icon" onClick={fetchSpinImages}>
          <PlayIcon className="size-full" />
        </Button>

        <div
          // Progress bar (invisible when not loading to avoid layout shift)
          className={cn(
            "relative h-1 w-3/5 overflow-hidden rounded-full bg-background",
            loadingStatus === null && "invisible"
          )}
        >
          <div
            className="h-full bg-primary transition-[width]"
            style={{ width: `${loadingStatus ? 100 : 0}%` }}
          />
        </div>
      </div>
    </div>
  );
};

/**
 * InteriorThreeSixtyElement component renders a carrousel's 360
 *
 * @prop `onlyPreload`: If true, zoom will not affect the 360. It is useful to pre-fetch images.
 * @prop `index`: The index of the item in the carrousel. Used to share state.
 */
const InteriorThreeSixtyElement: React.FC<
  InteriorThreeSixtyElementProps
> = props => {
  const { itemIndex } = props;

  const { setItemInteraction } = useControlsContext();

  const [status, setStatus] = useState<
    null | "placeholder" | "spin" | "error"
  >();

  // Update the item interaction state according to the readiness of the 360
  useEffect(() => {
    if (status === null || status === "error") {
      return;
    }

    setItemInteraction(itemIndex, status === "spin" ? "running" : "ready");
  }, [itemIndex, setItemInteraction, status]);

  if (status === "error") {
    return (
      <ErrorTemplate
        className="text-background"
        text="Interior Spin could not be loaded"
      />
    );
  } else if (status !== "spin") {
    return (
      <InteriorThreeSixtyElementPlaceholder
        {...props}
        onPlaceholderImageLoaded={() =>
          setStatus(s => (s === null ? "placeholder" : s))
        }
        onLoaded={() => setStatus("spin")}
        onError={() => setStatus("error")}
      />
    );
  } else {
    return (
      <InteriorThreeSixtyElementInteractive
        {...props}
        // onLoaded={() => setStatus("spin")}
        // onError={() => setStatus("error")}
      />
    );
  }
};

export default InteriorThreeSixtyElement;
