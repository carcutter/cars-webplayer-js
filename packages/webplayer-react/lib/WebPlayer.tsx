import styles from "../src/index.css?inline";
import type { WebPlayerProps } from "../src/types/webPlayerProps";
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
