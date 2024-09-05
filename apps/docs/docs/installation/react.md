---
sidebar_position: 1
sidebar_label: React.js

description: "Use the WebPlayer with React.js"
---

# WebPlayer with React.js

## Installation

```bash npm2yarn
npm install @car-cutter/react-webplayer
```

## Usage

1. Import: `import { WebPlayer } from "@car-cutter/react-webplayer"`
2. Use: `<WebPlayer compositionUrl={url} />`

### React implementation example

```jsx title="/src/App.jsx"
// highlight-next-line
import { WebPlayer } from "@car-cutter/react-webplayer";

const App = () => {
  return (
    <main>
      <h1>React App</h1>
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

export default App;
```

## Next steps

For more customisation, take a look at available **props** in the **[Customisation](../customisation.md)** section
