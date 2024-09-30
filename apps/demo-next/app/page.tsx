"use client"; // Mandatory only if we use events handlers

import {
  WebPlayer,
  WebPlayerCustomMedia,
  WebPlayerIcon,
} from "@car-cutter/next-webplayer";

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
      >
        <WebPlayerCustomMedia
          index={4}
          thumbnailSrc="https://cdn.car-cutter.com/libs/web-player/v3/assets/mocks/custom_thumbnail_audi.png"
        >
          <img src="https://cdn.car-cutter.com/libs/web-player/v3/assets/mocks/custom_image_1.jpg" />
        </WebPlayerCustomMedia>

        <WebPlayerIcon name="UI_IMAGE">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"
            />
          </svg>
        </WebPlayerIcon>
      </WebPlayer>
    </main>
  );
}
