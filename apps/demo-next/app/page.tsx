"use client";

import { WebPlayer } from "@car-cutter/next-webplayer";

export default function Home() {
  return (
    <main className="p-4 space-y-4">
      <h1 className="text-xl">Next App</h1>
      <div className="mx-auto max-w-4xl">
        <WebPlayer
          compositionUrl="https://cdn.car-cutter.com/libs/web-player/v3/demos/composition.json"
          flatten={true}
          infiniteCarrousel={true}
          permanentGallery={true}
        />
      </div>
    </main>
  );
}
