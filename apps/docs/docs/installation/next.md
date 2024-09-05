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

### Next.js implementation example

```tsx title="/app/page.tsx"
"use client"; // Mandatory only if we use events handlers
// highlight-next-line
import { WebPlayer } from "@car-cutter/next-webplayer";

export default function Home() {
  return (
    <main>
      <h1>Next App</h1>
      <div style={{ maxWidth: "1200px"; marginInline: "auto" }}>
        // highlight-start
        <WebPlayer
          compositionUrl="https://cdn.car-cutter.com/libs/web-player/v3/demos/composition.json"
          infiniteCarrousel
          onCompositionLoaded={() => console.log("Composition loaded")}
        />
        // highlight-end
      </div>
    </main>
  );
}
```

## Next steps

For more customisation, take a look at available **props** in the **[Customisation](../customisation.md)** section
