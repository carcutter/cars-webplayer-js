"use client";

import dynamic from "next/dynamic";

const WebPlayer = dynamic(
  () => import("@car-cutter/react-webplayer").then(mod => mod.WebPlayer),
  { ssr: false }
);

export { WebPlayer };
