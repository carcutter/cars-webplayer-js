---
sidebar_position: 6
---

# Optimisation

To ensure the WebPlayer loads quickly and efficiently, you can use several techniques to optimize the initial load and defer loading of additional media until later. This guide will walk you through the available options.

## Available props

### Media Load Strategy

The `mediaLoadStrategy` prop allows you to control how medias are loaded. You can choose between three strategies:

- `"quality"`: Prioritizes loading high-quality media.
- `"balanced"`: Balances between quality and speed.
- `"speed"`: Prioritizes loading speed over quality.

```tsx
<WebPlayer ... mediaLoadStrategy="speed" />
```

### Media Width Limits

CarCutter provides several medias resolution to optimise the user experience by providing the right size for each media.
If you do not want your medias to go below/over a certain width, you can use the `minMediaWidth` and `maxMediaWidth` props.

```tsx
<WebPlayer
  ...
  minMediaWidth={300}
  maxMediaWidth={800}
/>
```

### Preload Range

The `preloadRange` prop specifies how many media items to preload on either side of the current media. This helps in controlling when preloading should occur.

For instance, the following code will load 5 medias at the same time (the current media + 2 on left + 2 on the right)

```tsx
<WebPlayer ... preloadRange={2} />
```

:::tip
You can set `preloadRange` to 0 if you want to lead only the displayed media, but it will feel very buggy to the user.
What you can do is to increase the value as soon as the user can interact with your page. See more on the **[corresponding section](#fasten-first-load-before-user-interaction)**.
:::

## Fasten First Load before User Interaction

You can defer loading higher quality media until the user interacts with the WebPlayer. For example, you can set a lower `maxMediaWidth` initially and increase it after user interaction.

### Complete Optimisation Example

```tsx title="OptimizedWebPlayer.tsx"
import { useState, useEffect } from "react";
import { WebPlayer } from "@car-cutter/react-webplayer";

const OptimizedWebPlayer = () => {
  const [userInteracted, setUserInteracted] = useState(false);

  useEffect(() => {
    const handleUserInteraction = () => setUserInteracted(true);
    window.addEventListener("click", handleUserInteraction);
    return () => window.removeEventListener("click", handleUserInteraction);
  }, []);

  return (
    <WebPlayer
      ...
      mediaLoadStrategy={!userInteracted ? "speed" : "quality"}
      maxMediaWidth={!userInteracted ? 500 : Infinity}
      preloadRange={!userInteracted ? 0 : 2}
    />
  );
};

export default OptimizedWebPlayer;
```

:::tip

In this example, we are waiting for the user to click before loading the higher definition medias...
But, in fact, you could use any event/condition you want !

:::

By using these techniques, you can ensure that the WebPlayer loads quickly initially and then loads additional media as needed, providing a smooth user experience.
