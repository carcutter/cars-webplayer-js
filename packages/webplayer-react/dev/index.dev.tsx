import React from "react";
import ReactDOM from "react-dom/client";

import DevApp from "./DevApp.tsx";

import "./index.dev.css";
import "../src/index.css";
// NOTE: We need to import the CSS file and not inject it because it would broke the HMR

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DevApp />
  </React.StrictMode>
);
