import { Item } from "@/types/composition";
import { useState } from "react";

type Props = { item: Extract<Item, { type: "video" }> };

const VideoElement: React.FC<Props> = ({ item: { src, poster } }) => {
  const [displayVideo, setDisplayVideo] = useState(false);

  return (
    <div className="relative size-full">
      {!displayVideo ? (
        <>
          <img className="size-full" src={poster} alt="" />
          <div
            className="absolute flex justify-center items-center inset-0 bg-foreground/25 cursor-pointer"
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
