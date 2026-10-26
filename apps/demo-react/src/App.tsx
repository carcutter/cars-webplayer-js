import { COMPOSITION_URL, THEMES } from "@car-cutter/demo";
import {
  DemoPage,
  EventLog,
  useEventLog,
  usePlayerEventHandlers,
} from "@car-cutter/demo/react";
import { WebPlayer } from "@car-cutter/react-webplayer";

export default function App() {
  const eventLog = useEventLog();
  // onCompositionLoading, onCompositionLoaded, onItemChange, … logging each event
  const eventHandlers = usePlayerEventHandlers(eventLog.log);

  return (
    <DemoPage
      theme={THEMES.react}
      media={
        <WebPlayer
          className="dm-player"
          compositionUrl={COMPOSITION_URL}
          infiniteCarrousel
          permanentGallery
          {...eventHandlers}
        />
      }
      events={<EventLog {...eventLog} source="Via <WebPlayer on…> props" />}
    />
  );
}
