import type { Item } from "@car-cutter/core";

import ImageElement from "./web_player_elements/ImageElement";
import ThreeSixtyElement from "./web_player_elements/ThreeSixtyElement";
import VideoElement from "./web_player_elements/VideoElement";

type Props = {
  index: number;
  item: Item;
  isShown: boolean;
  lazy: boolean;
};

const WebPlayerElement: React.FC<Props> = ({ index, item, isShown, lazy }) => {
  const { type } = item;

  let Comp: React.ReactNode;

  if (!lazy) {
    // NOTE: Currently giving "index" to children in order to share their state. If it becomes a problem, we can handle it from here.
    switch (type) {
      case "image":
        Comp = (
          <ImageElement itemIndex={index} onlyPreload={!isShown} {...item} />
        );
        break;
      case "video":
        Comp = <VideoElement itemIndex={index} {...item} />;
        break;
      case "360":
        Comp = (
          <ThreeSixtyElement
            itemIndex={index}
            onlyPreload={!isShown}
            {...item}
          />
        );
        break;
    }
  } else {
    Comp = null;
  }

  return Comp;
};

export default WebPlayerElement;
