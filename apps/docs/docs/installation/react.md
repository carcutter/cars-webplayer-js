---
sidebar_position: 2
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

### Quick start

```jsx title="/src/App.jsx"
// highlight-next-line
import { WebPlayer } from "@car-cutter/react-webplayer";

const App = () => {
  return (
    <main>
      <h1>React App</h1>
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
};

export default App;
```

## Next steps

For more customisation, take a look at available **props** in the **[Properties](../properties.mdx)** section
