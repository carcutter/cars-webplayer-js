import React from "react";
import ReactDOM from "react-dom/client";

import WebPlayer from "./custom_elements/WebPlayer.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="flex h-screen min-h-[512px] items-center justify-center p-4 lg:p-10">
      {/* TODO: Add some stuff to make it appear like a real app */}

      <div className="size-full lg:w-4/5">
        <WebPlayer aspectRatio="4:3" />
      </div>
    </div>
  </React.StrictMode>
);
