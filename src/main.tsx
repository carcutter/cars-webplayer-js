import React from "react";
import ReactDOM from "react-dom/client";
import WebPlayer from "./custom_elements/WebPlayer.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="h-screen flex items-center justify-center p-4 lg:p-10">
      <div className="max-h-full w-full aspect-[4/3] lg:w-4/5">
        <WebPlayer />
      </div>
    </div>
  </React.StrictMode>
);
