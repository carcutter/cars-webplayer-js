import type { PropsWithChildren as ReactPropsWithChildren } from "react";

import type {
  WebPlayerAttributes,
  WebPlayerCustomMediaAttributes,
  WebPlayerIconAttributes,
} from "@car-cutter/core-wc";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "cc-webplayer": ReactPropsWithChildren<WebPlayerAttributes> &
        Pick<React.HTMLAttributes<HTMLElement>, "style">;
      "cc-webplayer-custom-media": ReactPropsWithChildren<WebPlayerCustomMediaAttributes>;
      "cc-webplayer-icon": ReactPropsWithChildren<WebPlayerIconAttributes>;
    }
  }
}
