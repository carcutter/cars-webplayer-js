import { useEffect } from "react";

import { useControlsContext } from "../../../providers/ControlsContext";
import { CustomisableItem } from "../../../types/customisable_item";

type Props = Extract<CustomisableItem, { type: "custom" }> & {
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
