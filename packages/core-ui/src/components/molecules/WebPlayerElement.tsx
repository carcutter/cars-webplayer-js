import { CustomisableItem } from "../../types/customisable_item";

import CustomElement from "./web_player_elements/CustomElement";
import ImageElement from "./web_player_elements/ImageElement";
import ThreeSixtyElement from "./web_player_elements/ThreeSixtyElement";
import VideoElement from "./web_player_elements/VideoElement";

type Props = {
  index: number;
  item: CustomisableItem;
  isShown: boolean;
};

const WebPlayerElement: React.FC<Props> = ({ index, item, isShown }) => {
  const { type } = item;

  let Comp: React.ReactNode;

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
        <ThreeSixtyElement itemIndex={index} onlyPreload={!isShown} {...item} />
      );
      break;
    case "custom":
      Comp = <CustomElement itemIndex={index} {...item} />;
  }

  // HACK: Add 1px on both side to avoid vertical lines due to decimal sizes
  Comp = <div className="-ml-px h-full w-[calc(100%+2px)]">{Comp}</div>;

  return Comp;
};

export default WebPlayerElement;
