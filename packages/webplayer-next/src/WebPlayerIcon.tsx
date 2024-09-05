"use client";

import { useEffect, type FC as ReactFC } from "react";

import type { WebPlayerIconProps } from "@car-cutter/core-ui";

const WebPlayer: ReactFC<WebPlayerIconProps> = ({ name, color }) => {
  useEffect(() => {
    (async () => {
      const { ensureCustomElementsDefinition } = await import(
        "@car-cutter/core-wc"
      );
      ensureCustomElementsDefinition();
    })();
  }, []);

  // @ts-expect-error: [TODO] Should define into JSX.IntrinsicElements
  return <cc-webplayer-icon name={name} color={color} />;
};

export { WebPlayerIconProps };

export default WebPlayer;
