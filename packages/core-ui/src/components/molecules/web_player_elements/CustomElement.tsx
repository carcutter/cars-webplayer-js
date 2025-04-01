import { useEffect } from "react";

import { useControlsContext } from "../../../providers/ControlsContext";
import { CustomizableItem } from "../../../types/customizable_item";

type Props = Extract<CustomizableItem, { type: "custom" }> & {
  itemIndex: number;
};

const CustomElement: React.FC<Props> = ({
  Media,

  itemIndex,
}) => {
  const { setItemInteraction } = useControlsContext();

  useEffect(() => {
    setItemInteraction(itemIndex, "ready");
  }, [itemIndex, setItemInteraction]);

  return Media;
};

export default CustomElement;
