import ReactDOM from "react-dom/client";

import WebPlayerIcon, { WebPlayerIconProps } from "../WebPlayerIcon";

import AbstractWebComponent from "./AbstractWebComponent";

class WebPlayerIconWebComponent extends AbstractWebComponent {
  connectedCallback() {
    const props = this.getPropsFromAttributes<WebPlayerIconProps>();
    const root = ReactDOM.createRoot(
      document.querySelector("#cc-webplayer-wrapper")!
    );
    root.render(<WebPlayerIcon {...props} />);
  }
}

export default WebPlayerIconWebComponent;
