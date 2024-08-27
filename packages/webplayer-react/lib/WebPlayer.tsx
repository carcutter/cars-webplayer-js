import type { WebPlayerProps } from "@car-cutter/core-webplayer";

import styles from "../src/index.css?inline";
import WebPlayerTS from "../src/WebPlayerTS";

const WebPlayer = (props: WebPlayerProps) => {
  return (
    <>
      <style>{styles}</style>
      <WebPlayerTS {...props} />
    </>
  );
};

export default WebPlayer;
