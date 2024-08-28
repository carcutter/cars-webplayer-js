import r2wc from "@r2wc/react-to-web-component";

import { WebPlayer, type WebPlayerProps } from "@car-cutter/core-ui";
import styles from "@car-cutter/core-ui/dist/style.css?inline";

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

    reverse360: "boolean",

    minImageWidth: "number",
    maxImageWidth: "number",
    imageLoadStrategy: "string",

    flatten: "boolean",
    infiniteCarrousel: "boolean",

    eventId: "string",

    allowFullScreen: "boolean",

    permanentGallery: "boolean",
  },
});

export default WebPlayerWebComponent;
