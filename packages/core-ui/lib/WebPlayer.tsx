import type { FC as ReactFC } from "react";

import styles from "../src/index.css?inline";
import { WebPlayerProps } from "../src/types/WebPlayer.props";
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
