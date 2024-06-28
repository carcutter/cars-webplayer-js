import React from "react";
import ReactDOM from "react-dom/client";

import WebPlayer from "./custom_elements/WebPlayer.tsx";

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

      <WebPlayer aspectRatio="4:3" maxItemsShown={2.5} flatten />
    </div>
  </React.StrictMode>
);
