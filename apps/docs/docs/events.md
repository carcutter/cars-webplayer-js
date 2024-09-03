---
sidebar_position: 3
---

# Events

## Handling with WebPlayer component

The `WebPlayer` component provides several callback functions that can be used to handle various events. These callbacks can be passed as props to the `WebPlayer` component.

### Available Callbacks

- `onCompositionLoading?: () => void;`

  - Triggered when the composition is loading.

- `onCompositionLoaded?: () => void;`

  - Triggered when the composition has successfully loaded.

- `onCompositionLoadError?: () => void;`

  - Triggered when there is an error loading the composition.

- `onExtendModeOn?: () => void;`

  - Triggered when the extend mode is turned on.

- `onExtendModeOff?: () => void;`

  - Triggered when the extend mode is turned off.

- `onHotspotsOn?: () => void;`

  - Triggered when hotspots are turned on.

- `onHotspotsOff?: () => void;`

  - Triggered when hotspots are turned off.

- `onGalleryOpen?: () => void;`

  - Triggered when the gallery is opened.

- `onGalleryClose?: () => void;`
  - Triggered when the gallery is closed.

### Example Usage with React

```tsx
import WebPlayer from "./WebPlayer";

const App = () => {
  const handleCompositionLoaded = () => {
    console.log("Composition loaded");
  };

  const handleCompositionLoadError = () => {
    console.error("Error loading composition");
  };

  return (
    <WebPlayer
      compositionUrl="..."
      onCompositionLoaded={handleCompositionLoaded}
      onCompositionLoadError={handleCompositionLoadError}
      // Add other event handlers as needed
    />
  );
};

export default App;
```

## Event Handling Directly with Listeners

In addition to using the provided callback functions, you can also handle events directly by adding event listeners. You can use the `details` property from `CustomEvent` to determine which event corresponds to the `CustomEvent`.

:::info

The default name of the WebPlayer event is `cc-webplayer-event`.

- If you do not want to hardcode this variable, you can access it through the constant `DEFAULT_EVENT_ID`
- You can change the event name by setting the property `eventId`

:::

### Available Events

| Event                      | Constant                       |
| -------------------------- | ------------------------------ |
| `"composition-loading"`    | `EVENT_COMPOSITION_LOADING`    |
| `"composition-loaded"`     | `EVENT_COMPOSITION_LOADED`     |
| `"composition-load-error"` | `EVENT_COMPOSITION_LOAD_ERROR` |
| `"extend-mode-on"`         | `EVENT_EXTEND_MODE_ON`         |
| `"extend-mode-off"`        | `EVENT_EXTEND_MODE_OFF`        |
| `"hotspots-on"`            | `EVENT_HOTSPOTS_ON`            |
| `"hotspots-off"`           | `EVENT_HOTSPOTS_OFF`           |
| `"gallery-open"`           | `EVENT_GALLERY_OPEN`           |
| `"gallery-close"`          | `EVENT_GALLERY_CLOSE`          |

### Example Usage with JavaScript

```js
import {
  DEFAULT_EVENT_ID,
  EVENT_COMPOSITION_LOADED,
  EVENT_EXTEND_MODE_ON,
} from "@car-cutter/core-wc";

document.addEventListener("DOMContentLoaded", () => {
  const eventId = DEFAULT_EVENT_ID; // Customize this as needed

  const handleEvent = event => {
    const { details } = event;
    switch (details) {
      case EVENT_COMPOSITION_LOADED:
        console.log("Composition loaded");
        break;
      case EVENT_EXTEND_MODE_ON:
        console.log("Extend mode on");
        break;
      // Add other cases as needed
    }
  };

  document.addEventListener(eventId, handleEvent);

  // Clean up event listener when no longer needed
  window.addEventListener("beforeunload", () => {
    document.removeEventListener(eventId, handleEvent);
  });
});
```
