import { CustomizableItem } from "../../types/customizable_item";

import CustomElement from "./web_player_elements/CustomElement";
import ImageElement from "./web_player_elements/ImageElement";
import InteriorThreeSixtyElement from "./web_player_elements/InteriorThreeSixtyElement";
import NextGenThreeSixtyElement from "./web_player_elements/NextGenThreeSixtyElement";
import ThreeSixtyElement from "./web_player_elements/ThreeSixtyElement";
import VideoElement from "./web_player_elements/VideoElement";

type Props = {
  index: number;
  item: CustomizableItem;
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
    case "next360":
      Comp = (
        <NextGenThreeSixtyElement itemIndex={index} onlyPreload={!isShown} {...item} />
      );
      break;
    case "interior-360":
      Comp = (
        <InteriorThreeSixtyElement
          itemIndex={index}
          onlyPreload={!isShown}
          {...item}
        />
      );
      break;
    case "custom":
      Comp = <CustomElement itemIndex={index} {...item} />;
  }

  // HACK: Add 1px on both side to avoid vertical lines due to decimal sizes
  // NOTE: The hack "-ml-px h-full w-[calc(100%+2px)]" was replaced with "grid grid-cols-[repeat(var(--max-items),1fr)]".

  Comp = (
    <div className="grid grid-cols-[repeat(var(--max-items),1fr)]">{Comp}</div>
  );

  return Comp;
};

export default WebPlayerElement;
