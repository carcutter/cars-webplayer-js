"use client";

import { useEffect, useState } from "react";

import type { WebPlayerProps } from "@car-cutter/core-webplayer";
import { WebPlayer as WebPlayerReact } from "@car-cutter/react-webplayer";

const WebPlayer: React.FC<React.PropsWithChildren<WebPlayerProps>> = props => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  if (!isClient) {
    return null;
  }

  return <WebPlayerReact {...props} />;
};

export default WebPlayer;
