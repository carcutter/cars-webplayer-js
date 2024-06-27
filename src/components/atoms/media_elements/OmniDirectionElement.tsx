import { Item } from "@/types/composition";

type Props = { item: Extract<Item, { type: "omni_directional" }> };

const OmniDirectionElement: React.FC<Props> = ({ item: { src } }) => {
  // TODO
  return <img key={src} className="size-full" src={src} alt="" />;
};

export default OmniDirectionElement;
