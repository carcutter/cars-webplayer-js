import React from "react";
import ReactDOM from "react-dom/client";

import WebPlayer from "./custom_elements/WebPlayer.tsx";
import WebPlayerIcon from "./custom_elements/WebPlayerIcon.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div>
      {/* TODO: Add some stuff to make it appear like a real app */}

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
        compositionUrl="/data.json"
        aspectRatio="4:3"
        maxItemsShown={2.5}
        flatten
      >
        <WebPlayerIcon feature="DRIVER ASSIST" color="#ffa000">
          <svg
            style={{ color: "white" }}
            xmlns="http://www.w3.org/2000/svg"
            height="48"
            viewBox="0 -960 960 960"
            width="48"
          >
            <path
              fill="currentColor"
              d="M230-450q-12.75 0-21.375-8.675-8.625-8.676-8.625-21.5 0-12.825 8.625-21.325T230-510h500q12.75 0 21.375 8.675 8.625 8.676 8.625 21.5 0 12.825-8.625 21.325T730-450H230Z"
            />
          </svg>
        </WebPlayerIcon>
      </WebPlayer>
    </div>
  </React.StrictMode>
);
