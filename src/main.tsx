import React from "react";
import ReactDOM from "react-dom/client";
import WebPlayer from "./custom_elements/WebPlayer.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="h-screen flex items-center justify-center p-10">
      <div className="max-h-full w-4/5 aspect-[4/3]">
        <WebPlayer />
      </div>
    </div>
  </React.StrictMode>
);
