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

    flatten: "boolean",
    infiniteCarrousel: "boolean",
    permanentGallery: "boolean",

    minImageWidth: "number",
    maxImageWidth: "number",
    imageLoadStrategy: "string",

    allowFullScreen: "boolean",
    eventId: "string",
    reverse360: "boolean",
  },
});

export default WebPlayerWebComponent;
