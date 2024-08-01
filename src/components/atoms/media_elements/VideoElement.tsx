import { useCallback, useEffect, useRef, useState } from "react";

import Button from "@/components/ui/Button";
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

  const videoRef = useRef<HTMLVideoElement>(null);
  const getVideoElmtOrThrow = useCallback(() => {
    if (!videoRef.current) {
      throw new Error("videoRef.current is null");
    }
    return videoRef.current;
  }, []);

  const [isPlaying, setIsPlaying] = useState(false);
  const [videoTimes, setVideoTimes] = useState<{
    currentTime: number;
    duration: number;
  } | null>(null);
  const progress = videoTimes
    ? (videoTimes.currentTime / videoTimes.duration) * 100
    : 0;

  useEffect(() => {
    const updateProgress = () => {
      const videoElmt = videoRef.current;
      setVideoTimes(
        videoElmt
          ? { currentTime: videoElmt.currentTime, duration: videoElmt.duration }
          : null
      );
    };

    const interval = setInterval(updateProgress, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [getVideoElmtOrThrow]);

  const play = useCallback(() => {
    getVideoElmtOrThrow().play();
  }, [getVideoElmtOrThrow]);
  const pause = useCallback(() => {
    getVideoElmtOrThrow().pause();
  }, [getVideoElmtOrThrow]);

  const handleOnPlay = () => {
    setIsPlaying(true);
    setItemInteraction(index, "running");
  };

  const handleOnPause = () => {
    const videoElmt = getVideoElmtOrThrow();

    /** [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/readyState) */
    // As the video is paused when navigating, we need to check if the video is paused manually
    const isManuallyPaused = videoElmt.readyState === 4;

    if (isManuallyPaused) {
      setIsPlaying(false);
      setItemInteraction(index, "pending");
    }
  };

  // Stop video when not active
  useEffect(() => {
    if (!isActiveIndex) {
      pause();
    }
  }, [pause, isActiveIndex]);

  const handleVideoClick = () => {
    pause();
  };

  const handlePlayClick = () => {
    play();
  };

  const handlePauseClick = () => {
    pause();
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const videoElmt = getVideoElmtOrThrow();

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const time = videoElmt.duration * percentage;

    videoElmt.currentTime = time;
  };

  const timeToMMSS = (time: number) => {
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds}`;
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
        onPause={handleOnPause}
        onClick={handleVideoClick}
      />
      {!isPlaying ? (
        <div className="absolute inset-0 flex items-center justify-center bg-foreground/25">
          <Button color="neutral" shape="icon" onClick={handlePlayClick}>
            <img
              className="size-full"
              src="https://cdn.car-cutter.com/libs/web-player/v2/assets/icons/ui/play.svg"
              alt="Play"
            />
          </Button>
        </div>
      ) : (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 space-y-2 bg-gradient-to-t from-foreground to-transparent p-4 pr-12 pt-8 opacity-0 transition-opacity *:pointer-events-auto group-hover:opacity-100">
          <div className="flex items-center gap-x-4">
            <Button shape="icon" variant="ghost" onClick={handlePauseClick}>
              <img
                className="size-full invert"
                src="https://cdn.car-cutter.com/libs/web-player/v3/assets/icons/ui/pause.svg"
                alt="Play"
              />
            </Button>
            {videoTimes && (
              <span className="text-sm text-background">
                {timeToMMSS(videoTimes.currentTime)} /{" "}
                {timeToMMSS(videoTimes.duration)}
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
      )}
    </div>
  );
};

export default VideoElement;
