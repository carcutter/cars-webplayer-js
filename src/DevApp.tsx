import React, { useEffect } from "react";

import WebPlayer from "./custom_elements/WebPlayer.tsx";
import WebPlayerIcon from "./custom_elements/WebPlayerIcon.tsx";
import { DEFAULT_EVENT_ID } from "./types/webPlayerProps.ts";

const DevApp: React.FC = () => {
  useEffect(() => {
    const onEvent = (e: Event) => {
      const { detail } = e as CustomEvent;

      // eslint-disable-next-line no-console
      console.log("Event received:", detail);
    };

    // Listen for the custom event
    document.addEventListener(DEFAULT_EVENT_ID, onEvent);

    return () => {
      document.removeEventListener(DEFAULT_EVENT_ID, onEvent);
    };
  }, []);

  return (
    <div>
      {/* FUTURE: Add some stuff to make it appear like a real app */}

      <div
        style={{
          padding: "1rem",
          marginBottom: "1rem",
          borderBottom: "1px solid #000",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
          }}
        >
          Carcutter Demo React
        </h2>
      </div>

      <WebPlayer
        // compositionUrl="/composition_mock_1.json"
        compositionUrl="https://cdn.car-cutter.com/gallery/767f46375d752707fcb76a19b8b22bc0040bd3ff59abc43d1c19eb0c04785c68/TEST1/composition_v2.json"
        aspectRatio="4:3"
        // reverse360
        // minImageWidth={300}
        // maxImageWidth={1000}
        // imageLoadStrategy="speed"
        flatten
        maxItemsShown={2.5}
        itemsShownBreakpoint={960}
        // eventId="cc-event"
        // optionsPosition="top-left"
      >
        <WebPlayerIcon icon="DRIVER ASSIST" color="#ff00ff">
          <svg
            style={{ color: "white" }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
          >
            <path
              fill="currentColor"
              d="M230-450q-12.75 0-21.375-8.675-8.625-8.676-8.625-21.5 0-12.825 8.625-21.325T230-510h500q12.75 0 21.375 8.675 8.625 8.676 8.625 21.5 0 12.825-8.625 21.325T730-450H230Z"
            />
          </svg>
        </WebPlayerIcon>
      </WebPlayer>
    </div>
  );
};

export default DevApp;
