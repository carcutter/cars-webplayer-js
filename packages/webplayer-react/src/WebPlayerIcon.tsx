import {
  ensureCustomElementsDefinition,
  type WebPlayerIconProps,
} from "@car-cutter/core-wc";

ensureCustomElementsDefinition();

const WebPlayer: React.FC<WebPlayerIconProps> = ({ name, color }) => {
  // @ts-expect-error: [TODO] Should define into JSX.IntrinsicElements
  return <cc-webplayer-icon name={name} color={color} />;
};

export default WebPlayer;
