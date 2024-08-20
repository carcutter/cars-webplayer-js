"use client";

import { useEffect, useState } from "react";

import {
  WebPlayer as WebPlayerReact,
  type WebPlayerProps,
} from "@car-cutter/react-webplayer";

const WebPlayer: React.FC<React.PropsWithChildren<WebPlayerProps>> = props => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  if (!isClient) {
    return null;
  }

  return <WebPlayerReact {...props} />;
};

export default WebPlayer;
