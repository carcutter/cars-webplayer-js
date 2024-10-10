import type { WebPlayerProps } from "@car-cutter/core";
import { WebPlayer } from "@car-cutter/core-ui";
import styles from "@car-cutter/core-ui/dist/style.css?inline";

import { type PropsToAttributes, propsToAttributes } from "./utils";

export const WebPlayerWithInjectedStyles: React.FC<WebPlayerProps> = props => {
  return (
    <>
      <style>{styles}</style>
      <WebPlayer {...props} />
    </>
  );
};

export type WebPlayerAttributes = PropsToAttributes<WebPlayerProps>;

export const webPlayerPropsToAttributes = (
  props: WebPlayerProps
): WebPlayerAttributes => propsToAttributes(props);
