import r2wc from "@r2wc/react-to-web-component";

import {
  WEB_PLAYER_CUSTOM_ELEMENTS_NAME,
  WEB_PLAYER_ICON_CUSTOM_ELEMENTS_NAME,
} from "@/const/custom_elements";
import WebPlayer from "@/lib/WebPlayer";
import WebPlayerIcon from "@/lib/WebPlayerIcon";
import type { WebPlayerProps } from "@/types/webPlayerProps";

import styles from "./index.css?inline";

const WebPlayerWithInjectedCSS = (props: WebPlayerProps) => {
  return (
    <>
      <style>{styles}</style>
      <WebPlayer {...props} />
    </>
  );
};

const WebPlayerWebComponent = r2wc(WebPlayerWithInjectedCSS, {
  shadow: "open",
  props: {
    compositionUrl: "string",

    reverse360: "boolean",

    minImageWidth: "number",
    maxImageWidth: "number",
    imageLoadStrategy: "string",

    flatten: "boolean",

    eventId: "string",

    allowFullScreen: "boolean",

    permanentGallery: "boolean",
  },
});

const WebPlayerIconWebComponent = r2wc(WebPlayerIcon, {
  shadow: "closed",
  props: {
    name: "string",
    color: "string",
    override: "boolean",
  },
});

customElements.define(WEB_PLAYER_CUSTOM_ELEMENTS_NAME, WebPlayerWebComponent);
customElements.define(
  WEB_PLAYER_ICON_CUSTOM_ELEMENTS_NAME,
  WebPlayerIconWebComponent
);
