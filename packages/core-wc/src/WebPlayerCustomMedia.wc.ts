import r2wc from "@r2wc/react-to-web-component";

import {
  WebPlayerCustomMedia,
  type WebPlayerCustomMediaProps,
} from "@car-cutter/core-ui";

import { type PropsToAttributes, propsToAttributes } from "./utils";

const WebPlayerCustomMediaWebComponent = r2wc(WebPlayerCustomMedia, {
  shadow: "closed",
  props: {
    index: "number",
    thumbnailSrc: "string",
  },
});

export type WebPlayerCustomMediaAttributes =
  PropsToAttributes<WebPlayerCustomMediaProps>;

export const webPlayerCustomMediaPropsToAttributes = (
  props: WebPlayerCustomMediaProps
): WebPlayerCustomMediaAttributes => propsToAttributes(props);

export default WebPlayerCustomMediaWebComponent;
