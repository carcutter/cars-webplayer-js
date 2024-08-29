import {
  ensureCustomElementsDefinition,
  webPlayerPropsToAttributes,
  type WebPlayerProps,
} from "@car-cutter/core-wc";

ensureCustomElementsDefinition();

const WebPlayer: React.FC<WebPlayerProps> = props => {
  const attributes = webPlayerPropsToAttributes(props);

  // @ts-expect-error: [TODO] Should define into JSX.IntrinsicElements
  return <cc-webplayer {...attributes} />;
};

export default WebPlayer;
