"use client";

import dynamic from "next/dynamic";

import type { WebPlayerProps } from "@car-cutter/react-webplayer";

const WebPlayer = dynamic(
  () => import("@car-cutter/react-webplayer").then(mod => mod.WebPlayer),
  { ssr: false }
);

export { WebPlayer, type WebPlayerProps };
