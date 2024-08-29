"use client";

import { useEffect, useState } from "react";

import type { WebPlayerProps, WebPlayerAttributes } from "@car-cutter/core-wc";

const WebPlayer: React.FC<WebPlayerProps> = props => {
  const [attributes, setAttributes] = useState<WebPlayerAttributes>();

  useEffect(() => {
    (async () => {
      const { ensureCustomElementsDefinition, webPlayerPropsToAttributes } =
        await import("@car-cutter/core-wc");

      // NOTE: Cannot be used in the top level of a module because of the dynamic import
      setAttributes(webPlayerPropsToAttributes(props));

      ensureCustomElementsDefinition();
    })();
  }, [props]);

  if (!attributes) {
    return null;
  }

  // @ts-expect-error: [TODO] Should define into JSX.IntrinsicElements
  return <cc-webplayer {...attributes} />;
};

export default WebPlayer;
