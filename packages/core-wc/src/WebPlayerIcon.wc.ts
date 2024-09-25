import r2wc from "@r2wc/react-to-web-component";

import { WebPlayerIcon, type WebPlayerIconProps } from "@car-cutter/core-ui";

import { type PropsToAttributes, propsToAttributes } from "./utils";

const WebPlayerIconWebComponent = r2wc(WebPlayerIcon, {
  shadow: "closed",
  props: {
    name: "string",
    color: "string",
  },
});

export type WebPlayerIconAttributes = PropsToAttributes<WebPlayerIconProps>;

export const webPlayerIconPropsToAttributes = (
  props: WebPlayerIconProps
): WebPlayerIconAttributes => propsToAttributes(props);

export default WebPlayerIconWebComponent;
