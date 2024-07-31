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
      getVideoElmtOrThrow().pause();
    }
  }, [getVideoElmtOrThrow, isActiveIndex]);

  const handlePlayClick = () => {
    getVideoElmtOrThrow().play();
  };

  return (
    <div className="relative size-full">
      <video
        ref={videoRef}
        className="size-full"
        src={src}
        poster={poster}
        controls={isPlaying}
        controlsList={`${!isFullScreen ? "" : "nofullscreen"} nodownload noremoteplayback noplaybackrate`}
        disablePictureInPicture={true}
        onPlay={handleOnPlay}
        onPause={handleOnPause}
      />
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-foreground/25">
          <Button color="neutral" shape="icon" onClick={handlePlayClick}>
            <img
              className="size-full"
              src="https://cdn.car-cutter.com/libs/web-player/v2/assets/icons/ui/play.svg"
              alt="Play"
            />
          </Button>
        </div>
      )}
    </div>
  );
};

export default VideoElement;
