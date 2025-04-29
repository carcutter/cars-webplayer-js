---
sidebar_position: 5
sidebar_label: Vanilla JS

description: "Use the WebPlayer with Vanilla JavaScript/TypsScript"
---

# WebPlayer with Vanilla JS/TS

## Installation

```bash npm2yarn
npm install @car-cutter/vanilla-webplayer
```

## Usage

1. Import: `import { appendWebPlayer } from "@car-cutter/vanilla-webplayer"`

2. Use the `appendWebPlayer` function to add the WebPlayer to your target element.

```js
appendWebPlayer(document.getElementById("webplayer-wrapper"), {
  compositionUrl:
    "https://cdn.car-cutter.com/libs/web-player/v3/demos/composition.json",
});
```

### Quick start

```html title="/index.html"
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>🚗 Demo - Vanilla JS 🍦</title>
  </head>
  <body>
    <script type="module">
      import {
        appendWebPlayer,
        DEFAULT_EVENT_PREFIX,
        EVENT_COMPOSITION_LOADED,
      } from "@car-cutter/vanilla-webplayer";

      function init() {
        const targetElement = document.getElementById("webplayer-wrapper");

        appendWebPlayer(targetElement, {
          compositionUrl:
            "https://cdn.car-cutter.com/libs/web-player/v3/demos/composition.json",
          infiniteCarrousel: true,
        });

        document.addEventListener(
          `${DEFAULT_EVENT_PREFIX}${EVENT_COMPOSITION_LOADED}`,
          () => console.log("Composition loaded")
        );
      }

      init();
    </script>

    <div id="app">
      <h1>Vanilla App</h1>

      <div
        id="webplayer-wrapper"
        style="max-width: 800px; margin-inline: auto"
      ></div>
    </div>
  </body>
</html>
```

## Next steps

For more customisation, take a look at available **props** in the **[Properties](../properties.mdx)** section
