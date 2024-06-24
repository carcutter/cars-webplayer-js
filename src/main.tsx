import React from "react";
import ReactDOM from "react-dom/client";
import WebPlayer from "./components/WebPlayer.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="h-screen flex items-center justify-center p-20">
      <div className="h-96">
        <WebPlayer />
      </div>
    </div>
  </React.StrictMode>
);
