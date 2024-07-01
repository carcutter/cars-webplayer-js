import ReactDOM from "react-dom/client";

import { WebPlayerProps } from "@/types/props";

import WebPlayer from "../WebPlayer";

import AbstractWebComponent from "./AbstractWebComponent";

class WebPlayerIconWebComponent extends AbstractWebComponent {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const props = this.getPropsFromAttributes<WebPlayerProps>();
    const root = ReactDOM.createRoot(this.shadowRoot as ShadowRoot);
    root.render(<WebPlayer {...props} />);
  }
}

export default WebPlayerIconWebComponent;
