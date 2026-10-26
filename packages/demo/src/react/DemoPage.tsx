import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

import { demoUrl } from "../constants";
import { themeStyle, type Theme } from "../themes";

type Props = {
  theme: Theme;
  /** Content of the stage: the WebPlayer */
  media: ReactNode;
  /** Rendered under the stage */
  events: ReactNode;
};

export function DemoPage({ theme: t, media, events }: Props) {
  // Resolved after mount: on the server (Next.js) the page host is unknown,
  // and a different href on the client would break hydration
  const [indexUrl, setIndexUrl] = useState<string>();
  useEffect(() => setIndexUrl(demoUrl("index")), []);

  return (
    <div className="dm dm--fit" style={themeStyle(t) as CSSProperties}>
      <header className="dm-header">
        <div className="dm-header__inner">
          <a className="dm-brand" href={indexUrl} title="All demos">
            <span className="dm-brand__tile">{t.mono}</span>
            <span className="dm-brand__text">
              <span className="dm-brand__title">{t.title}</span>
              <span className="dm-brand__subtitle">
                CarCutter WebPlayer integration
              </span>
            </span>
          </a>
          <span className="dm-pill">{t.pkg}</span>
        </div>
      </header>
      <main className="dm-main">
        <div className="dm-stage">{media}</div>
        <div className="dm-below">{events}</div>
      </main>
    </div>
  );
}
