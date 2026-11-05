import {
  createElement,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import { WEB_PLAYER_WC_TAG } from "@car-cutter/core";

// Processed by Tailwind and updated while editing
import styles from "../src/index.css?inline";

type Props = {
  shadowDom: boolean;
  width: string;
  cssVariables: React.CSSProperties;
  children: ReactNode;
};

/**
 * Where the player is rendered: in the page, or in a shadow root holding the
 * inlined styles, as the web component of core-wc does (the page's styles
 * don't reach it, the CSS variables do)
 */
const Stage: React.FC<Props> = ({
  shadowDom,
  width,
  cssVariables,
  children,
}) => (
  <div
    className="pg-stage"
    style={{
      ...cssVariables,
      maxWidth: width === "auto" ? undefined : `${width}px`,
    }}
  >
    {shadowDom ? (
      <ShadowHost>{children}</ShadowHost>
    ) : (
      <>
        {/* For the whole page, as a host page importing the styles */}
        <style>{styles}</style>
        {children}
      </>
    )}
  </div>
);

const ShadowHost: React.FC<{ children: ReactNode }> = ({ children }) => {
  const hostRef = useRef<HTMLElement>(null);
  const [root, setRoot] = useState<ShadowRoot | null>(null);

  useLayoutEffect(() => {
    const host = hostRef.current!;
    setRoot(host.shadowRoot ?? host.attachShadow({ mode: "open" }));
  }, []);

  // Hosted by an element with the tag of the web component, which the player
  // recognizes as the one made fullscreen
  return createElement(
    WEB_PLAYER_WC_TAG,
    { ref: hostRef, style: { display: "block" } },
    root &&
      createPortal(
        <>
          <style>{styles}</style>
          {children}
        </>,
        root
      )
  );
};

export default Stage;
