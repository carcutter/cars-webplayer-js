"use client"; // Mandatory only if we use events handlers

import { WebPlayer } from "@car-cutter/next-webplayer";

export default function Home() {
  return (
    <main className="p-4 space-y-4">
      <h1 className="text-xl">Next App</h1>
      <div className="mx-auto max-w-4xl">
        <WebPlayer
          compositionUrl="https://cdn.car-cutter.com/libs/web-player/v3/demos/composition.json"
          infiniteCarrousel
          // eslint-disable-next-line no-console
          onCompositionLoaded={() => console.log("Composition loaded")}
        />
      </div>
    </main>
  );
}
