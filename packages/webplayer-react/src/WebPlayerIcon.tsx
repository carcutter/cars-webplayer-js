import {
  ensureCustomElementsDefinition,
  type WebPlayerIconProps,
} from "@car-cutter/core-wc";

ensureCustomElementsDefinition();

const WebPlayer: React.FC<WebPlayerIconProps> = ({ name, color }) => {
  return (
    // @ts-expect-error: Should define into the JSX.IntrinsicElements (.d.ts)
    <cc-webplayer-icon name={name} color={color} />
  );
};

export default WebPlayer;
