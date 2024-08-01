import { useCallback, useEffect, useRef, useState } from "react";

import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { useControlsContext } from "@/providers/ControlsContext";
import { useGlobalContext } from "@/providers/GlobalContext";
import type { Item } from "@/types/composition";

type Props = Extract<Item, { type: "video" }> & {
  index: number;
};

const VideoElement: React.FC<Props> = ({ src, poster, index }) => {
  const { isFullScreen } = useGlobalContext();

  const { carrouselItemIndex, setItemInteraction } = useControlsContext();

  const isActiveIndex = carrouselItemIndex === index;

  // - Ref
  const videoRef = useRef<HTMLVideoElement>(null);
  const getVideoElmtOrThrow = useCallback(() => {
    if (!videoRef.current) {
      throw new Error("videoRef.current is null");
    }
    return videoRef.current;
  }, []);

  const play = useCallback(() => {
    getVideoElmtOrThrow().play();
  }, [getVideoElmtOrThrow]);
  const pause = useCallback(() => {
    getVideoElmtOrThrow().pause();
  }, [getVideoElmtOrThrow]);

  // Pause the video when the video is not the carrousel active index
  useEffect(() => {
    if (!isActiveIndex) {
      pause();
    }
  }, [pause, isActiveIndex]);

  // - Events

  const [isRunning, setIsRunning] = useState(false); // Video is playing or loading
  const [isLoading, setIsLoading] = useState(true);

  const handleOnPlay = () => {
    setIsRunning(true);
    setItemInteraction(index, "running");
  };

  // Either the video ended or the user stopped it
  const handleOnStop = () => {
    setIsRunning(false);
    setItemInteraction(index, "pending");
  };

  // Video is ready to play (enough data has been loaded)
  const handleOnCanPlay = () => {
    setIsLoading(false);
  };

  // Video is waiting for more data
  const handleOnWaiting = () => {
    setIsLoading(true);
  };

  // -- Progress bar

  const [videoTimes, setVideoTimes] = useState<{
    currentTime: number;
    duration: number;
  } | null>(null);
  const progress = videoTimes
    ? (videoTimes.currentTime / videoTimes.duration) * 100
    : 0;

  const updateProgress = useCallback(() => {
    const videoElmt = videoRef.current;
    setVideoTimes(
      videoElmt
        ? { currentTime: videoElmt.currentTime, duration: videoElmt.duration }
        : null
    );
  }, []);

  // Update progress every second
  useEffect(() => {
    const interval = setInterval(updateProgress, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [getVideoElmtOrThrow, updateProgress]);

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const videoElmt = getVideoElmtOrThrow();

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const time = videoElmt.duration * percentage;

    videoElmt.currentTime = time;

    updateProgress();
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="group relative size-full">
      <video
        ref={videoRef}
        className="size-full"
        src={src}
        poster={poster}
        controlsList={`${!isFullScreen ? "" : "nofullscreen"} nodownload noremoteplayback noplaybackrate`}
        disablePictureInPicture={true}
        onPlay={handleOnPlay}
        onPause={handleOnStop}
        onEnded={handleOnStop}
        onCanPlay={handleOnCanPlay}
        onWaiting={handleOnWaiting}
        onClick={pause}
      />
      {!isRunning ? (
        <div
          // Overlay with play button
          className="absolute inset-0 flex items-center justify-center bg-foreground/25"
        >
          <Button color="neutral" shape="icon" onClick={play}>
            <img
              className="size-full"
              src="https://cdn.car-cutter.com/libs/web-player/v2/assets/icons/ui/play.svg"
              alt="Play"
            />
          </Button>
        </div>
      ) : (
        <>
          <div
            // Controls
            className="pointer-events-none absolute inset-x-0 bottom-0 space-y-2 bg-gradient-to-t from-foreground to-transparent p-4 pr-12 pt-8 opacity-0 transition-opacity *:pointer-events-auto group-hover:opacity-100"
          >
            <div className="flex items-center gap-x-4">
              <Button shape="icon" variant="ghost" onClick={pause}>
                <img
                  className="size-full invert"
                  src="https://cdn.car-cutter.com/libs/web-player/v3/assets/icons/ui/pause.svg"
                  alt="Play"
                />
              </Button>
              {videoTimes && (
                <span className="text-sm text-background">
                  {formatTime(videoTimes.currentTime)} /{" "}
                  {formatTime(videoTimes.duration)}
                </span>
              )}
            </div>

            <div
              // Wrap the progress bar to make the click easier
              className="cursor-pointer py-1"
              onClick={handleProgressBarClick}
            >
              <div className="h-1 w-full rounded-full bg-background/25">
                <div
                  className="h-full rounded-full bg-background"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {isLoading && (
            <div
              // Loading overlay with spinner
              className="pointer-events-none absolute inset-0 flex items-center justify-center bg-foreground/25"
            >
              <Spinner size="lg" />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VideoElement;
