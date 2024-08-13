import React from "react";
import ReactDOM from "react-dom/client";

import DevApp from "./DevApp.tsx";

import "./index.dev.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DevApp />
  </React.StrictMode>
);
