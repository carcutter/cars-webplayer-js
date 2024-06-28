import { useState } from "react";

import Button from "@/components/ui/Button";
import { Item } from "@/types/composition";

type Props = { item: Extract<Item, { type: "video" }> };

const VideoElement: React.FC<Props> = ({ item: { src, poster } }) => {
  const [displayVideo, setDisplayVideo] = useState(false);

  if (!displayVideo) {
    return (
      <div className="relative size-full">
        <img className="size-full" src={poster} alt="" />
        <div className="absolute inset-0 flex items-center justify-center bg-foreground/25">
          <Button onClick={() => setDisplayVideo(true)}>PLAY</Button>
        </div>
      </div>
    );
  }

  return <video className="size-full" src={src} controls autoPlay />;
};

export default VideoElement;
