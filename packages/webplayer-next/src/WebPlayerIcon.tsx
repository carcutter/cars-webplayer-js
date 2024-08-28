"use client";

import { useEffect } from "react";

import type { WebPlayerIconProps } from "@car-cutter/core-wc";

const WebPlayer: React.FC<WebPlayerIconProps> = ({ name, color }) => {
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

export default WebPlayer;
