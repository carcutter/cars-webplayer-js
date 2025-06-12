---
sidebar_position: 6
sidebar_label: <script/>

description: "Use the WebPlayer without any package manager"
---

# WebPlayer with `<script/>` tag

## Usage

1. Import script in `<head>` :

```html
<script src="https://cdn.car-cutter.com/libs/web-player/v3/bundle.js"></script>
```

2. Use the custom element : `cc-webplayer`

```html
<cc-webplayer composition-url="..." />
```

### Quick start

```html title="index.html"
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>WebPlayer Demo</title>

    // highlight-next-line
    <script src="https://cdn.car-cutter.com/libs/web-player/v3/bundle.js"></script>
  </head>

  <body>
    <main>
      <div style="max-width: 800px; marginInline: auto">
        // highlight-start
        <cc-webplayer
          composition-url="https://cdn.car-cutter.com/libs/web-player/v3/demos/composition.json"
        >
        </cc-webplayer>
        // highlight-end
      </div>
    </main>
  </body>
</html>
```

## Next steps

For more customization, take a look at available **props** in the **[Properties](../properties.mdx)** section
