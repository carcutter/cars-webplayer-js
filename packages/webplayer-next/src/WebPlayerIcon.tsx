"use client";

import dynamic from "next/dynamic";

const WebPlayerIcon = dynamic(
  () => import("@car-cutter/react-webplayer").then(mod => mod.WebPlayerIcon),
  { ssr: false }
);

export { WebPlayerIcon };
