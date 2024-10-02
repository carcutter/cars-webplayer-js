---
sidebar_position: 2
sidebar_label: Next.js

description: "Use the WebPlayer with Next.js"
---

# WebPlayer with Next.js

## Installation

```bash npm2yarn
npm install @car-cutter/next-webplayer
```

## Usage

1. Import: `import { WebPlayer } from "@car-cutter/next-webplayer"`
2. Use: `<WebPlayer compositionUrl={url} />`

### Quick start

```jsx title="/app/page.tsx"
"use client"; // Mandatory only if we use events handlers

// highlight-next-line
import { WebPlayer } from "@car-cutter/next-webplayer";

export default function Home() {
  return (
    <main>
      <h1>Next App</h1>
      // highlight-start
      <WebPlayer
        style={{ maxWidth: "800px", marginInline: "auto", marginTop: "16px" }}
        compositionUrl="https://cdn.car-cutter.com/libs/web-player/v3/demos/composition.json"
        infiniteCarrousel
        onCompositionLoaded={() => console.log("Composition loaded")}
      />
      // highlight-end
    </main>
  );
}
```

## Next steps

For more customisation, take a look at available **props** in the **[Properties](../properties.mdx)** section
