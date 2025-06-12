---
sidebar_position: 4
---

# Styles

You can customize the WebPlayer color & roundness with CSS Variables

| CSS Variable                        | Description                        | Default Value     |
| ----------------------------------- | ---------------------------------- | ----------------- |
| `--cc-webplayer-background`         | Background color (contrast texts)  | `0 0% 100%`       |
| `--cc-webplayer-foreground`         | Foreground color (text color)      | `240 10% 3.9%`    |
| `--cc-webplayer-primary`            | Primary color (buttons)            | `216 100% 52%`    |
| `--cc-webplayer-primary-foreground` | Foreground color for primary items | `--cc-background` |
| `--cc-webplayer-primary-light`      | Alternative to primary if too dark | `--cc-primary`    |
| `--cc-webplayer-neutral`            | Neutral color                      | `0 0% 39%`        |
| `--cc-webplayer-neutral-foreground` | Foreground color for neutral items | `--cc-foreground` |
| `--cc-webplayer-radius-ui`          | UI element Border radius (buttons) | `16px`            |
| `--cc-webplayer-radius-carrousel`   | Carrousel border radius            | `0`               |
| `--cc-webplayer-radius-gallery`     | Gallery medias border radius       | `0`               |

## Examples

You can insert CSS variables in your style files

```css title="index.css"
:root {
  --cc-webplayer-primary: 262 88% 58%;
  --cc-webplayer-radius-ui: 14px;
}
```

Or directly in your HTML

```html title="index.html"
<style>
  cc-webplayer {
    --cc-webplayer-primary: 262 88% 58%;
    --cc-webplayer-radius-ui: 14px;
  }
</style>
```
