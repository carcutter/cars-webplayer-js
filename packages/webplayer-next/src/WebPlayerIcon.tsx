"use client";

import dynamic from "next/dynamic";

import type { WebPlayerIconProps } from "@car-cutter/react-webplayer";

const WebPlayerIcon = dynamic(
  () => import("@car-cutter/react-webplayer").then(mod => mod.WebPlayerIcon),
  { ssr: false }
);

export { WebPlayerIcon, type WebPlayerIconProps };
