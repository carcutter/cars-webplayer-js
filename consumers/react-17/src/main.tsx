// React 16.8 - 17 entry point
import {
  WebPlayer,
  WebPlayerCustomMedia,
  WebPlayerIcon,
} from "@car-cutter/react-webplayer/legacy";
import { StrictMode, useState } from "react";
import { render } from "react-dom";

const COMPOSITION_URL =
  "https://cdn.car-cutter.com/libs/web-player/v3/demos/composition_v3.json";

function App() {
  const [events, setEvents] = useState<string[]>([]);
  const log = (name: string) => () => setEvents(prev => [...prev, name]);

  return (
    <>
      <WebPlayer
        compositionUrl={COMPOSITION_URL}
        permanentGallery
        onCompositionLoading={log("composition-loading")}
        onCompositionLoaded={log("composition-loaded")}
        onItemChange={log("item-change")}
      >
        <WebPlayerCustomMedia index={4}>
          <div id="custom-media">Custom media</div>
        </WebPlayerCustomMedia>
        <WebPlayerIcon name="UI_GALLERY">
          <svg id="custom-icon" viewBox="0 0 10 10">
            <circle cx="5" cy="5" r="4" />
          </svg>
        </WebPlayerIcon>
      </WebPlayer>
      <ol id="events">
        {events.map((name, i) => (
          <li key={i}>{name}</li>
        ))}
      </ol>
    </>
  );
}

render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById("root")
);
