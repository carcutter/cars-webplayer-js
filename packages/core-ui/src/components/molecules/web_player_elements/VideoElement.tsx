import { useCallback, useEffect, useRef, useState } from "react";

import { useControlsContext } from "../../../providers/ControlsContext";
import { CustomizableItem } from "../../../types/customizable_item";
import { cn } from "../../../utils/style";
import PlayButton from "../../atoms/PlayButton";
import PauseIcon from "../../icons/PauseIcon";
import VolumeIcon from "../../icons/VolumeIcon";
import VolumeOffIcon from "../../icons/VolumeOffIcon";
import Button from "../../ui/Button";
import ProgressBar from "../../ui/ProgressBar";
import Spinner from "../../ui/Spinner";

type Timeout = ReturnType<typeof setTimeout>;

const HIDE_CONTROLS_DELAY = 3000;

// Farthest a finger can move (px) for a touch to be a tap, not a swipe
const TAP_MAX_DISTANCE = 10;

type Props = Extract<CustomizableItem, { type: "video" }> & {
  itemIndex: number;
};

/**
 * VideoElement component renders a carrousel's video with controls.
 *
 * @prop `index`: The index of the item in the carrousel. Used to share state.
 */
const VideoElement: React.FC<Props> = ({ src, poster, itemIndex }) => {
  const { carrouselItemIndex, setItemInteraction } = useControlsContext();

  // - Ref
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const getVideoElementOrThrow = useCallback(() => {
    if (!videoRef.current) {
      throw new Error("videoRef.current is null");
    }
    return videoRef.current;
  }, []);

  useEffect(() => {
    // FUTURE: We can do better than that (e.g. preload the video to know if it's ready)
    setItemInteraction(itemIndex, "ready");
  }, [itemIndex, setItemInteraction]);

  // -- Play/Pause/Loading

  const play = useCallback(() => {
    getVideoElementOrThrow().play();
  }, [getVideoElementOrThrow]);
  const pause = useCallback(() => {
    getVideoElementOrThrow().pause();
  }, [getVideoElementOrThrow]);

  // Pause the video when the video is not the carrousel active index
  useEffect(() => {
    const isActiveIndex = carrouselItemIndex === itemIndex;

    if (!isActiveIndex) {
      pause();
    }
  }, [carrouselItemIndex, itemIndex, pause]);

  const [isRunning, setIsRunning] = useState(false); // Video is playing or loading
  const [isLoading, setIsLoading] = useState(true);

  const handleOnPlay = () => {
    setIsRunning(true);
    setItemInteraction(itemIndex, "running");
  };

  // Either the video ended or the user stopped it
  const handleOnStop = () => {
    setIsRunning(false);
    setItemInteraction(itemIndex, "ready");
  };

  // Video is ready to play (enough data has been loaded)
  const handleOnCanPlay = () => {
    setIsLoading(false);
  };

  // Video is waiting for more data
  const handleOnWaiting = () => {
    setIsLoading(true);
  };

  // -- Volume
  const [videoVolumeInfos, setVideoVolumeInfos] = useState<{
    volume: number;
    isMuted: boolean;
  } | null>(null);

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const videoElmt = getVideoElementOrThrow();

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newVolume = Math.min(1, Math.max(0, percentage));

    videoElmt.volume = newVolume;
    videoElmt.muted = false;
  };
  const setMutedAttribute = (value: boolean) => {
    const videoElmt = getVideoElementOrThrow();
    videoElmt.muted = value;
  };

  // Listen to volume changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const refreshVideoVolume = () => {
      setVideoVolumeInfos({
        volume: video.volume,
        isMuted: video.muted,
      });
    };

    refreshVideoVolume();

    video.addEventListener("volumechange", refreshVideoVolume);
    return () => {
      video.removeEventListener("volumechange", refreshVideoVolume);
    };
  }, []);

  // -- Progress bar

  const [videoTimeInfos, setVideoTimeInfos] = useState<{
    currentTime: number;
    duration: number;
  } | null>(null);
  const progress = videoTimeInfos
    ? videoTimeInfos.currentTime / videoTimeInfos.duration
    : 0;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const refreshVideoTimeInfos = () => {
      const currentTime = video.currentTime;
      const duration = video.duration;
      if (isNaN(currentTime) || isNaN(duration)) {
        return;
      }

      setVideoTimeInfos({
        currentTime,
        duration,
      });
    };

    refreshVideoTimeInfos();

    video.addEventListener("timeupdate", refreshVideoTimeInfos);
    return () => {
      video.removeEventListener("timeupdate", refreshVideoTimeInfos);
    };
  }, []);

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = getVideoElementOrThrow();

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const time = video.duration * percentage;

    video.currentTime = time;
  };

  // - Misc
  const formatTime = (time: number) => {
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // -- Controls
  const [showControls, setShowControls] = useState(false);

  const hideControlsTimeout = useRef<Timeout | undefined>(undefined);
  const clearHideControlsTimeout = useCallback(
    () => clearTimeout(hideControlsTimeout.current),
    []
  );
  const restartHideControlsTimeout = useCallback(() => {
    clearHideControlsTimeout();
    hideControlsTimeout.current = setTimeout(() => {
      setShowControls(false);
    }, HIDE_CONTROLS_DELAY);
  }, [clearHideControlsTimeout]);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;

    // DOM not ready
    if (!container || !video) {
      return;
    }

    const showControls = () => {
      restartHideControlsTimeout();
      setShowControls(true);
    };
    const hideControls = () => {
      clearHideControlsTimeout();
      setShowControls(false);
    };

    // Pointer events tell touch and pens from the mouse: a tap is followed by
    // emulated mouse events, which aren't listened to. A swipe of the
    // carrousel over the video ends with pointercancel (native scroll).
    const isMouse = (e: PointerEvent) => e.pointerType === "mouse";

    // Hovering with the mouse shows the controls (pens are handled as
    // fingers: some can't hover, and a tap toggles the controls)
    const onPointerHover = (e: PointerEvent) => {
      if (isMouse(e)) {
        showControls();
      }
    };
    const onPointerLeave = (e: PointerEvent) => {
      if (isMouse(e)) {
        hideControls();
      }
    };

    // A mouse click on the video pauses it, a tap (finger, pen) toggles the
    // controls. Not when the pointer moved: the user moves the carrousel,
    // which scrolls from the first pixel with the mouse (touch tolerates a
    // few, as fingers do). Nor for a multi-touch gesture. Done on the click:
    // hit-tested before the controls a tap shows, it doesn't press them.
    let press: { x: number; y: number; mouse: boolean } | null = null;
    let tap: { mouse: boolean } | null = null;
    const hasMoved = (e: PointerEvent) => {
      if (!press) {
        return false;
      }
      const distance = Math.hypot(e.clientX - press.x, e.clientY - press.y);
      return press.mouse ? distance > 0 : distance >= TAP_MAX_DISTANCE;
    };

    const onPointerDown = (e: PointerEvent) => {
      tap = null;
      // A second finger cancels the tap of the first one
      press =
        e.isPrimary && e.target === video && e.button === 0
          ? { x: e.clientX, y: e.clientY, mouse: isMouse(e) }
          : null;
    };
    const onPointerMove = (e: PointerEvent) => {
      onPointerHover(e);
      if (hasMoved(e)) {
        press = null;
      }
    };
    const onPointerUp = (e: PointerEvent) => {
      tap =
        press && e.isPrimary && e.target === video && !hasMoved(e)
          ? { mouse: press.mouse }
          : null;
      press = null;
    };
    const onPointerCancel = () => {
      press = null;
      tap = null;
    };
    const onClick = () => {
      if (!tap) {
        return;
      }

      if (tap.mouse) {
        pause();
      } else {
        restartHideControlsTimeout();
        setShowControls(state => !state);
      }
      tap = null;
    };

    container.addEventListener("pointerenter", onPointerHover);
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerleave", onPointerLeave);
    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointerup", onPointerUp);
    container.addEventListener("pointercancel", onPointerCancel);
    video.addEventListener("click", onClick);
    // Starting the video shows the controls for a while, also on touch
    video.addEventListener("play", showControls);

    return () => {
      container.removeEventListener("pointerenter", onPointerHover);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerleave", onPointerLeave);
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointercancel", onPointerCancel);
      video.removeEventListener("click", onClick);
      video.removeEventListener("play", showControls);

      clearHideControlsTimeout();
    };
  }, [clearHideControlsTimeout, pause, restartHideControlsTimeout]);

  return (
    <div ref={containerRef} className="relative aspect-[4/3] w-full">
      <video
        ref={videoRef}
        // No double-tap zoom (nor the click delay it brings) on pages without
        // a mobile viewport: a tap toggles the controls
        className="size-full touch-manipulation"
        src={src}
        poster={poster}
        disablePictureInPicture
        playsInline
        onPlay={handleOnPlay}
        onPause={handleOnStop}
        onEnded={handleOnStop}
        onCanPlay={handleOnCanPlay}
        onWaiting={handleOnWaiting}
      />
      {!isRunning ? (
        <div
          // Overlay with play button
          className="absolute inset-0 flex items-center justify-center bg-foreground/25"
        >
          <PlayButton onClick={play} />
        </div>
      ) : (
        <>
          <div
            // Controls
            className={cn(
              "absolute inset-x-0 bottom-0 cursor-auto space-y-2 bg-gradient-to-t from-foreground to-transparent p-4 pr-12 pt-8 transition-opacity duration-300",
              !showControls
                ? "pointer-events-none opacity-0"
                : "pointer-events-auto opacity-100"
            )}
            onMouseDownCapture={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between text-background">
              <div
                // Play and time
                className="flex items-center gap-x-4"
              >
                <Button
                  shape="icon"
                  variant="ghost"
                  color="neutral"
                  onClick={pause}
                >
                  <PauseIcon className="size-full" />
                </Button>
                {videoTimeInfos && (
                  <span className="text-sm">
                    {formatTime(videoTimeInfos.currentTime)} /{" "}
                    {formatTime(videoTimeInfos.duration)}
                  </span>
                )}
              </div>

              {videoVolumeInfos && (
                <div
                  // Volume
                  className="group/volume flex items-center gap-x-4 rounded-ui-md p-2 transition-colors hover:bg-foreground/25"
                >
                  <div
                    // Wrap the progress bar to make the click easier
                    // NOTE: we could/should use an input "range" instead of a progress bar
                    className={`w-12 cursor-pointer py-1 opacity-0 transition-opacity ${!videoVolumeInfos.isMuted ? "group-hover/volume:opacity-100" : "group-hover/volume:opacity-50"}`}
                    onClick={handleVolumeClick}
                  >
                    <ProgressBar progress={videoVolumeInfos.volume} />
                  </div>

                  <div
                    className="size-5 cursor-pointer"
                    onClick={() => setMutedAttribute(!videoVolumeInfos.isMuted)}
                  >
                    {!videoVolumeInfos.isMuted ? (
                      <VolumeIcon className="size-full" />
                    ) : (
                      <VolumeOffIcon className="size-full" />
                    )}
                  </div>
                </div>
              )}
            </div>

            <div
              // Wrap the progress bar to make the click easier
              // NOTE: we could/should use an input "range" instead of a progress bar
              className="cursor-pointer py-1"
              onClick={handleProgressBarClick}
            >
              <ProgressBar progress={progress} />
            </div>
          </div>

          {isLoading && (
            <div
              // Loading overlay with spinner
              className="pointer-events-none absolute inset-0 flex items-center justify-center bg-foreground/25"
            >
              <Spinner size="lg" color="background" />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VideoElement;
