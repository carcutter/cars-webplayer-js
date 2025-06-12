---
sidebar_position: 4
sidebar_label: WebComponent

description: "Use the WebPlayer as a WebComponent"
---

# WebPlayer as a WebComponent

## Installation

```bash npm2yarn
npm install @car-cutter/wc-webplayer
```

## Usage

1. Import and define the custom elements:

```js
import { defineCustomElements } from "@car-cutter/wc-webplayer";

defineCustomElements();
```

2. Use the `<cc-webplayer>` element in your HTML.

### Quick start

```html title="/index.html"
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>🚗 Demo - Web Components 🌐</title>
  </head>
  <body>
    <script type="module">
      import {
        defineCustomElements,
        DEFAULT_EVENT_PREFIX,
        EVENT_COMPOSITION_LOADED,
      } from "@car-cutter/wc-webplayer";

      function init() {
        defineCustomElements();

        document.addEventListener(
          `${DEFAULT_EVENT_PREFIX}${EVENT_COMPOSITION_LOADED}`,
          () => console.log("Composition loaded")
        );
      }

      init();
    </script>

    <h1>WC App</h1>

    <div style="max-width: 800px; margin-inline: auto">
      <cc-webplayer
        composition-url="https://cdn.car-cutter.com/libs/web-player/v3/demos/composition.json"
        hide-categories-nav="true"
      >
      </cc-webplayer>
    </div>
  </body>
</html>
```

## Next steps

For more customization, take a look at available **props** in the **[Properties](../properties.mdx)** section
