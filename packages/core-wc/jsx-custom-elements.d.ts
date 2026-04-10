import type { PropsWithChildren as ReactPropsWithChildren } from "react";

import type {
  WebPlayerAttributes,
  WebPlayerCustomMediaAttributes,
  WebPlayerIconAttributes,
} from "@car-cutter/core-wc";

type WebPlayerIntrinsicElements = {
  "cc-webplayer": ReactPropsWithChildren<WebPlayerAttributes> &
    Pick<React.HTMLAttributes<HTMLElement>, "style">;
  "cc-webplayer-custom-media": ReactPropsWithChildren<WebPlayerCustomMediaAttributes>;
  "cc-webplayer-icon": ReactPropsWithChildren<WebPlayerIconAttributes>;
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "cc-webplayer": WebPlayerIntrinsicElements["cc-webplayer"];
      "cc-webplayer-custom-media": WebPlayerIntrinsicElements["cc-webplayer-custom-media"];
      "cc-webplayer-icon": WebPlayerIntrinsicElements["cc-webplayer-icon"];
    }
  }
}

declare module "react" {
  namespace JSX {
    interface IntrinsicElements extends WebPlayerIntrinsicElements {}
  }
}
