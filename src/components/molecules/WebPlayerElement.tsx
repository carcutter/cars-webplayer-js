import ImageElement from "@/components/molecules/web_player_elements/ImageElement";
import OmniDirectionElement from "@/components/molecules/web_player_elements/OmniDirectionElement";
import ThreeSixtyElement from "@/components/molecules/web_player_elements/ThreeSixtyElement";
import VideoElement from "@/components/molecules/web_player_elements/VideoElement";
import { useCompositionContext } from "@/providers/CompositionContext";
import type { Item } from "@/types/composition";

type Props = {
  index: number;
  item: Item;
  isShown: boolean;
  lazy: boolean;
};

const WebPlayerElement: React.FC<Props> = ({ index, item, isShown, lazy }) => {
  const { aspectRatioClass } = useCompositionContext();

  const { type } = item;

  let Comp: React.ReactNode;

  if (!lazy) {
    switch (type) {
      case "image":
        Comp = <ImageElement onlyPreload={!isShown} {...item} />;
        break;
      case "video":
        Comp = <VideoElement index={index} {...item} />;
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

  return (
    <div className={`relative h-full ${aspectRatioClass} bg-foreground/50`}>
      {Comp}
    </div>
  );
};

export default WebPlayerElement;
