"use client"; // Mandatory only if we use events handlers

import { WebPlayer } from "@car-cutter/next-webplayer";

export default function Home() {
  return (
    <main className="p-4 space-y-4">
      <h1 className="text-xl">Next App</h1>
      <WebPlayer
        className="mx-auto max-w-4xl"
        compositionUrl="https://cdn.car-cutter.com/libs/web-player/v3/demos/composition.json"
        infiniteCarrousel
        onCompositionLoaded={composition =>
          // eslint-disable-next-line no-console
          console.log("Composition loaded !", composition)
        }
      />
    </main>
  );
}
