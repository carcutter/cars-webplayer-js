"use client";

import { useEffect, type FC as ReactFC } from "react";

import type { WebPlayerIconProps } from "@car-cutter/core-ui";

const WebPlayerIcon: ReactFC<WebPlayerIconProps> = props => {
  useEffect(() => {
    (async () => {
      const { ensureCustomElementsDefinition } = await import(
        "@car-cutter/core-wc"
      );
      ensureCustomElementsDefinition();
    })();
  }, []);

  return <cc-webplayer-icon {...props} />;
};

export { WebPlayerIconProps };

export default WebPlayerIcon;
