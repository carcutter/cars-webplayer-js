import { StrictMode } from "react";
import { render } from "react-dom";

import App from "./App.tsx";

import "@car-cutter/demo/styles.css";

// React 16 / 17 root API
render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById("root")
);
