import { Item } from "@/types/composition";
import { useGlobalContext } from "@/providers/GlobalContext";
import ImageElement from "../atoms/media_elements/ImageElement";
import VideoElement from "../atoms/media_elements/VideoElement";
import ThreeSixtyElement from "../atoms/media_elements/ThreeSixtyElement";
import OmniDirectionElement from "../atoms/media_elements/OmniDirectionElement";

type Props = { item: Item };

const WebPlayerElement: React.FC<Props> = ({ item }) => {
  const { aspectRatioClass } = useGlobalContext();

  const { type } = item;

  let Comp: React.ReactNode;

  switch (type) {
    case "image":
      Comp = <ImageElement item={item} />;
      break;
    case "video":
      Comp = <VideoElement item={item} />;
      break;
    case "360":
      Comp = <ThreeSixtyElement item={item} />;
      break;
    case "omni_directional":
      Comp = <OmniDirectionElement item={item} />;
      break;
    default:
      throw new Error(`Unsupported item type: ${type}`);
  }

  return <div className={`relative h-full ${aspectRatioClass}`}>{Comp}</div>;
};

export default WebPlayerElement;
