"use client";

import dynamic from "next/dynamic";

import type { WebPlayerCustomMediaProps } from "@car-cutter/react-webplayer";

const WebPlayerCustomMedia = dynamic(
  () =>
    import("@car-cutter/react-webplayer").then(mod => mod.WebPlayerCustomMedia),
  { ssr: false }
);

export { WebPlayerCustomMedia, type WebPlayerCustomMediaProps };
