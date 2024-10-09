import type { WebPlayerCustomMediaProps } from "@car-cutter/core-ui";

import { type PropsToAttributes, propsToAttributes } from "./utils";

export type WebPlayerCustomMediaAttributes =
  PropsToAttributes<WebPlayerCustomMediaProps>;

export const webPlayerCustomMediaPropsToAttributes = (
  props: WebPlayerCustomMediaProps
): WebPlayerCustomMediaAttributes => propsToAttributes(props);
