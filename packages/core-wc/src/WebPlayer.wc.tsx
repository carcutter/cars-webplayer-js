import r2wc from "@r2wc/react-to-web-component";

import { WebPlayer, type WebPlayerProps } from "@car-cutter/core-ui";
import styles from "@car-cutter/core-ui/dist/style.css?inline";

import { CamelToKebab, propsToAttributes } from "./utils";

const WebPlayerWithInjectedStyles: React.FC<WebPlayerProps> = props => {
  return (
    <>
      <style>{styles}</style>
      <WebPlayer {...props} />
    </>
  );
};

const WebPlayerWebComponent = r2wc(WebPlayerWithInjectedStyles, {
  shadow: "open",
  props: {
    compositionUrl: "string",

    hideCategories: "boolean",
    infiniteCarrousel: "boolean",
    permanentGallery: "boolean",

    minImageWidth: "number",
    maxImageWidth: "number",
    imageLoadStrategy: "string",

    preventFullScreen: "boolean",
    eventPrefix: "string",
    reverse360: "boolean",
  },
});

export type WebPlayerAttributes = Record<
  CamelToKebab<keyof WebPlayerProps>,
  string
>;

export const webPlayerPropsToAttributes = (props: WebPlayerProps) =>
  propsToAttributes(props) as WebPlayerAttributes;

export default WebPlayerWebComponent;
