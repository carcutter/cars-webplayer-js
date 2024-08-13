import WebPlayerTS from "@/lib/WebPlayerTS";
import type { WebPlayerProps } from "@/types/webPlayerProps";

import styles from "./index.css?inline";

const WebPlayer = (props: WebPlayerProps) => {
  return (
    <>
      <style>{styles}</style>
      <WebPlayerTS {...props} />
    </>
  );
};

export default WebPlayer;
