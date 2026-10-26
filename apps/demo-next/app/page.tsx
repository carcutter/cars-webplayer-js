"use client"; // Needed to pass event handlers to <WebPlayer>

import { COMPOSITION_URL, THEMES } from "@car-cutter/demo";
import {
  DemoPage,
  EventLog,
  useEventLog,
  usePlayerEventHandlers,
} from "@car-cutter/demo/react";
import { WebPlayer } from "@car-cutter/next-webplayer";

export default function Home() {
  const eventLog = useEventLog();
  // onCompositionLoading, onCompositionLoaded, onItemChange, … logging each event
  const eventHandlers = usePlayerEventHandlers(eventLog.log);

  return (
    <DemoPage
      theme={THEMES.next}
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
