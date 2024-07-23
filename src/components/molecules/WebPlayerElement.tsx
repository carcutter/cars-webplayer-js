import ImageElement from "@/components/atoms/media_elements/ImageElement";
import OmniDirectionElement from "@/components/atoms/media_elements/OmniDirectionElement";
import ThreeSixtyElement from "@/components/atoms/media_elements/ThreeSixtyElement";
import VideoElement from "@/components/atoms/media_elements/VideoElement";
import { useGlobalContext } from "@/providers/GlobalContext";
import type { Item } from "@/types/composition";

type Props = {
  index: number;
  item: Item;
  currentIndex: number;
};

const WebPlayerElement: React.FC<Props> = ({ index, item, currentIndex }) => {
  const isShown = index === currentIndex;
  const lazy = Math.abs(index - currentIndex) > 1;

  const { aspectRatioClass } = useGlobalContext();

  const { type } = item;

  let Comp: React.ReactNode;

  if (!lazy) {
    switch (type) {
      case "image":
        Comp = <ImageElement onlyPreload={!isShown} {...item} />;
        break;
      case "video":
        Comp = <VideoElement item={item} />;
        break;
      case "360":
        Comp = (
          <ThreeSixtyElement index={index} onlyPreload={!isShown} {...item} />
        );
        break;
      case "omni_directional":
        Comp = <OmniDirectionElement item={item} />;
        break;
      default:
        throw new Error(`Unsupported item type: ${type}`);
    }
  } else {
    Comp = null;
  }

  return <div className={`relative h-full ${aspectRatioClass}`}>{Comp}</div>;
};

export default WebPlayerElement;
