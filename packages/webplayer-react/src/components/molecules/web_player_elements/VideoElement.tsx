import { useCallback, useEffect, useRef, useState } from "react";

import PlayButton from "@/components/atoms/PlayButton";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import Spinner from "@/components/ui/Spinner";
import { useControlsContext } from "@/providers/ControlsContext";
import type { Item } from "@/types/composition";

type Props = Extract<Item, { type: "video" }> & {
  index: number;
};

/**
 * VideoElement component renders a carrousel's video with controls.
 *
 * @prop `index`: The index of the item in the carrousel. Used to share state.
 */
const VideoElement: React.FC<Props> = ({ src, poster, index }) => {
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

  // -- Play/Pause/Loading Events

  const [isRunning, setIsRunning] = useState(false); // Video is playing or loading
  const [isLoading, setIsLoading] = useState(true);

  const handleOnPlay = () => {
    setIsRunning(true);
    setItemInteraction(index, "running");
  };

  // Either the video ended or the user stopped it
  const handleOnStop = () => {
    setIsRunning(false);
    setItemInteraction(index, null);
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

  const handlleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const videoElmt = getVideoElmtOrThrow();

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newVolume = Math.min(1, Math.max(0, percentage));

    videoElmt.volume = newVolume;
    videoElmt.muted = false;
  };
  const setMutedAttribute = (value: boolean) => {
    const videoElmt = getVideoElmtOrThrow();
    videoElmt.muted = value;
  };

  // Listen to volume changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

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
    const video = getVideoElmtOrThrow();

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

  return (
    <div className="group relative size-full">
      <video
        ref={videoRef}
        className="size-full"
        src={src}
        poster={poster}
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
          <PlayButton onClick={play} />
        </div>
      ) : (
        <>
          <div
            // Controls
            className="pointer-events-none absolute inset-x-0 bottom-0 space-y-2 bg-gradient-to-t from-foreground to-transparent p-4 pr-12 pt-8 opacity-0 transition-opacity *:pointer-events-auto group-hover:opacity-100"
          >
            <div className="flex items-center justify-between">
              <div
                // Play and time
                className="flex items-center gap-x-4"
              >
                <Button shape="icon" variant="ghost" onClick={pause}>
                  <img
                    className="size-full invert"
                    src="https://cdn.car-cutter.com/libs/web-player/v3/assets/icons/ui/pause.svg"
                    alt="Pause"
                  />
                </Button>
                {videoTimeInfos && (
                  <span className="text-sm text-background">
                    {formatTime(videoTimeInfos.currentTime)} /{" "}
                    {formatTime(videoTimeInfos.duration)}
                  </span>
                )}
              </div>

              {videoVolumeInfos && (
                <div
                  // Volume
                  className="group/volume flex items-center gap-x-4 rounded-full p-2 transition-colors hover:bg-foreground/25"
                >
                  <div
                    // Wrap the progress bar to make the click easier
                    // NOTE: we could/should use an input "range" instead of a progress bar
                    className={`w-12 cursor-pointer py-1 opacity-0 transition-opacity ${!videoVolumeInfos.isMuted ? "group-hover/volume:opacity-100" : "group-hover/volume:opacity-50"}`}
                    onClick={handlleVolumeClick}
                  >
                    <ProgressBar progress={videoVolumeInfos.volume} />
                  </div>

                  <div
                    className="size-5 cursor-pointer"
                    onClick={() => setMutedAttribute(!videoVolumeInfos.isMuted)}
                  >
                    <img
                      className="size-full invert"
                      src={
                        !videoVolumeInfos.isMuted
                          ? "https://cdn.car-cutter.com/libs/web-player/v3/assets/icons/ui/volume.svg"
                          : "https://cdn.car-cutter.com/libs/web-player/v3/assets/icons/ui/volume-x.svg"
                      }
                      alt="Volume"
                    />
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
              <Spinner size="lg" />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VideoElement;
