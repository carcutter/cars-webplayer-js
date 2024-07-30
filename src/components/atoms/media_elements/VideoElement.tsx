import { useEffect, useRef, useState } from "react";

import Button from "@/components/ui/Button";
import { useControlsContext } from "@/providers/ControlsContext";
import type { Item } from "@/types/composition";

type Props = Extract<Item, { type: "video" }> & {
  index: number;
};

const VideoElement: React.FC<Props> = ({ src, poster, index }) => {
  const { carrouselItemIndex, setItemInteraction } = useControlsContext();

  const isActiveIndex = carrouselItemIndex === index;

  const [displayVideo, setDisplayVideo] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  const handleOnPlay = () => {
    setItemInteraction(index, "running");
  };

  const handleOnPause = () => {
    setItemInteraction(index, "pending");
  };

  // Stop video when not active
  useEffect(() => {
    if (!isActiveIndex) {
      videoRef.current?.pause();
    }
  }, [isActiveIndex]);

  const handleOnClick = () => {
    setDisplayVideo(true);
  };

  if (!displayVideo) {
    return (
      <div className="relative size-full">
        <img
          // FUTURE: use srcSet to optimize image loading
          className="size-full"
          src={poster}
          alt=""
        />
        <div className="absolute inset-0 flex items-center justify-center bg-foreground/25">
          <Button color="neutral" shape="icon" onClick={handleOnClick}>
            <img
              className="size-full"
              src="https://cdn.car-cutter.com/libs/web-player/v2/assets/icons/ui/play.svg"
              alt="Play"
            />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      className="size-full"
      src={src}
      controls
      autoPlay
      onPlay={handleOnPlay}
      onPause={handleOnPause}
    />
  );
};

export default VideoElement;
