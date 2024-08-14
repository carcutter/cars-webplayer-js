import type { Item } from "../../../types/composition";

type Props = { item: Extract<Item, { type: "omni_directional" }> };

// FUTURE: Add support for 360° images
const OmniDirectionElement: React.FC<Props> = ({ item: { src } }) => {
  return <img key={src} className="size-full" src={src} alt="" />;
};

export default OmniDirectionElement;
