import type { WebPlayerProps } from "@car-cutter/core-ui";

import { type PropsToAttributes, propsToAttributes } from "./utils";

export type WebPlayerAttributes = PropsToAttributes<WebPlayerProps>;

export const webPlayerPropsToAttributes = (
  props: WebPlayerProps
): WebPlayerAttributes => propsToAttributes(props);
