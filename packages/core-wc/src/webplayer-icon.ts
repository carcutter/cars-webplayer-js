import type { WebPlayerIconProps } from "@car-cutter/core";

import { type PropsToAttributes, propsToAttributes } from "./utils";

export type WebPlayerIconAttributes = PropsToAttributes<WebPlayerIconProps>;

export const webPlayerIconPropsToAttributes = (
  props: WebPlayerIconProps
): WebPlayerIconAttributes => propsToAttributes(props);
