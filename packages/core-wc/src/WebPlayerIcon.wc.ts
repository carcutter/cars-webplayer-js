import r2wc from "@r2wc/react-to-web-component";

import { WebPlayerIcon, type WebPlayerIconProps } from "@car-cutter/core-ui";

import { CamelToKebab, propsToAttributes } from "./utils";

const WebPlayerIconWebComponent = r2wc(WebPlayerIcon, {
  shadow: "closed",
  props: {
    name: "string",
    color: "string",
  },
});

export type WebPlayerIconAttributes = Record<
  CamelToKebab<keyof WebPlayerIconProps>,
  string
>;

export const webPlayerIconPropsToAttributes = (props: WebPlayerIconProps) =>
  propsToAttributes(props) as WebPlayerIconAttributes;

export default WebPlayerIconWebComponent;
