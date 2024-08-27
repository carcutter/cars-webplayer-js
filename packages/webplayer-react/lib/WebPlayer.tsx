import type { FC as ReactFC } from "react";

import type { WebPlayerProps } from "@car-cutter/core-webplayer";

import styles from "../src/index.css?inline";
import WebPlayerTS from "../src/WebPlayerTS";

const WebPlayer: ReactFC<WebPlayerProps> = props => {
  return (
    <>
      <style>{styles}</style>
      <WebPlayerTS {...props} />
    </>
  );
};

export default WebPlayer;
