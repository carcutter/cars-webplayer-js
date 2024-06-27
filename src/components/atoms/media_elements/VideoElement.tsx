import { useState } from "react";

import { Item } from "@/types/composition";

type Props = { item: Extract<Item, { type: "video" }> };

const VideoElement: React.FC<Props> = ({ item: { src, poster } }) => {
  const [displayVideo, setDisplayVideo] = useState(false);

  return (
    <div className="relative size-full">
      {!displayVideo ? (
        <>
          <img className="size-full" src={poster} alt="" />
          <div
            className="absolute inset-0 flex cursor-pointer items-center justify-center bg-foreground/25"
            onClick={() => setDisplayVideo(true)}
          >
            <div className="text-background">PLAY</div>
          </div>
        </>
      ) : (
        <video className="size-full" src={src} controls autoPlay />
      )}
    </div>
  );
};

export default VideoElement;
