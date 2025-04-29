"use client";

import dynamic from "next/dynamic";

const WebPlayerCustomMedia = dynamic(
  () =>
    import("@car-cutter/react-webplayer/legacy").then(
      mod => mod.WebPlayerCustomMedia
    ),
  { ssr: false }
);

export { WebPlayerCustomMedia };
