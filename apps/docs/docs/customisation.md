---
sidebar_position: 2
---

# Customisation

## Props

| Prop                | Type                     | Default           | Description                                               |
| ------------------- | ------------------------ | ----------------- | --------------------------------------------------------- |
| `compositionUrl`    | `string`                 | ❌ Required       | URL to the composition data                               |
| `hideCategories`    | `boolean`                | `false`           | Hide the category-based navigation                        |
| `infiniteCarrousel` | `boolean`                | `false`           | Allow to navigate from 1st to last image (and vice versa) |
| `permanentGallery`  | `boolean`                | `false`           | Display gallery under the carrousel                       |
| `imageLoadStrategy` | `"quality"` or `"speed"` | `"quality"`       | Strategy for loading images.                              |
| `minImageWidth`     | `number`                 | `0`               | Force minimum image width (in pixels)                     |
| `maxImageWidth`     | `number`                 | `Infinity`        | Force maximum image width (in pixels)                     |
| `preventFullScreen` | `boolean`                | `false`           | Whether to prevent full screen mode                       |
| `eventPrefix`       | `string`                 | `"cc-webplayer:"` | Prefix of cc-player events                                |
| `reverse360`        | `boolean`                | `false`           | Reverse the 360-degree rotation                           |

:::info

If you are using the WebComponent directly, you need to transform the props to HTML attributes (which are in kebab case and take `string` as value type)

:::

### Property to attribute

| Property            | Attribute             |
| ------------------- | --------------------- |
| `compositionUrl`    | `composition-url`     |
| `hideCategories`    | `hide-categories`     |
| `infiniteCarrousel` | `infinite-carrousel`  |
| `permanentGallery`  | `permanent-gallery`   |
| `imageLoadStrategy` | `image-load-strategy` |
| `minImageWidth`     | `min-image-width`     |
| `maxImageWidth`     | `max-image-width`     |
| `preventFullScreen` | `prevent-full-screen` |
| `eventPrefix`       | `event-prefix`        |
| `reverse360`        | `reverse360`          |

## CSS

You can customise the WebPlayer CSS with CSS Variables

| CSS Variable                        | Description                        | Default Value     |
| ----------------------------------- | ---------------------------------- | ----------------- |
| `--cc-webplayer-background`         | Background color (contrast texts)  | `0 0% 100%`       |
| `--cc-webplayer-foreground`         | Foreground color (text color)      | `240 10% 3.9%`    |
| `--cc-webplayer-primary`            | Primary color (buttons)            | `216 100% 52%`    |
| `--cc-webplayer-primary-foreground` | Foreground color for primary items | `--cc-background` |
| `--cc-webplayer-primary-light`      | Alternative to primary if too dark | `--cc-primary`    |
| `--cc-webplayer-neutral`            | Neutral color                      | `0 0% 39%`        |
| `--cc-webplayer-neutral-foreground` | Foreground color for neutral items | `--cc-foreground` |
| `--cc-webplayer-radius-ui`          | UI element Border radius (buttons) | `1rem`            |
| `--cc-webplayer-radius-carrousel`   | Carrousel border radius            | `0`               |
| `--cc-webplayer-radius-gallery`     | Gallery images border radius       | `0`               |

### Example

You can insert CSS variables in your style files

```css title="index.css"
:root {
  --cc-webplayer-primary: 262 88% 58%;
  --cc-webplayer-radius-ui: 0.8rem;
}
```

Or directly in your HTML

```html title="index.html"
<style>
  cc-webplayer {
    --cc-webplayer-primary: 262 88% 58%;
    --cc-webplayer-radius-ui: 0.8rem;
  }
</style>
```
