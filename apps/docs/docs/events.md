---
sidebar_position: 3
---

# Events

## Handling with WebPlayer component

The `WebPlayer` component provides several callback functions that can be used to handle various events. These callbacks can be passed as props to the `WebPlayer` component.

### Available Callbacks

- `onCompositionLoading?: (url: string) => void;`

  - Triggered when the composition is loading.

- `onCompositionLoaded?: (composition: Composition) => void;`

  - Triggered when the composition has successfully loaded.

- `onCompositionLoadError?: (error: unknown) => void;`

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

In addition to using the provided callback functions, you can also handle events directly by adding event listeners.

:::info

The default prefix for all WebPlayer events is `"cc-webplayer:"`. This prefix helps to avoid potential conflicts with other events in your application.

- If you do not want to hardcode the prefix, you can access it through the constant `DEFAULT_EVENT_PREFIX`.
- You can customize the event prefix by setting the property `eventPrefix`.

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

Here's how you can add event listeners for these events:

```js
import {
  DEFAULT_EVENT_PREFIX,
  EVENT_COMPOSITION_LOADED,
} from "@car-cutter/core-wc";

document.addEventListener(
  DEFAULT_EVENT_PREFIX + EVENT_COMPOSITION_LOADED,
  function (event) {
    console.log("WebPlayer Composition is loading");
  }
);

document.addEventListener("cc-webplayer:gallery-open", function (event) {
  console.log("WebPlayer Gallery opened");
});
```
