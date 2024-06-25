import { Item } from "@/types/composition";

type Props = { item: Extract<Item, { type: "video" }> };

const VideoElement: React.FC<Props> = ({ item: { src, poster } }) => {
  return <img key={src} className="size-full" src={poster} alt="" />;
};

export default VideoElement;
