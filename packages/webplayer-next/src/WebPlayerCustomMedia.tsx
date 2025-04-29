"use client";

import dynamic from "next/dynamic";

const WebPlayerCustomMedia = dynamic(
  () =>
    import("@car-cutter/react-webplayer").then(mod => mod.WebPlayerCustomMedia),
  { ssr: false }
);

export { WebPlayerCustomMedia };
