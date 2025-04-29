"use client";

import dynamic from "next/dynamic";

const WebPlayer = dynamic(
  () => import("@car-cutter/react-webplayer/legacy").then(mod => mod.WebPlayer),
  { ssr: false }
);

export { WebPlayer };
