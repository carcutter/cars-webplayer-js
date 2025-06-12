---
sidebar_position: 7
sidebar_label: <iframe/>

description: "Use the WebPlayer without any package manager or script"
---

# WebPlayer with `<iframe/>` tag

## Usage

```html
<iframe src="..."> </iframe>
```

### Attribute `src`

In order to construct the `src` URL for the iframe integration you need

- The **iframe-integration-url** of the iframe integration

  ```
  https://cdn.car-cutter.com/libs/web-player/v3/integrations/iframe/index.html
  ```

- Required & optional [Properties](../properties.mdx) as urlencoded [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)
  _We recommend to [encode](https://www.w3schools.com/tags/ref_urlencode.ASP) all Properties even though we know it technically might not always be necessary!_

#### Blueprint

```html
<iframe
  src="{iframe-integration-url}?composition-url={...}&{optional-properties}"
></iframe>
```

### Example

_\* Required [Properties](../properties.mdx)_

#### Non Encoded

| Properties            | value                                                                  |
| --------------------- | ---------------------------------------------------------------------- |
| `composition-url`\*   | `https://cdn.car-cutter.com/libs/web-player/v3/demos/composition.json` |
| `hide-categories-nav` | `true`                                                                 |
| `categories-filter`   | `360\|interior`                                                        |

#### Encoded

| Properties            | value                                                                                  |
| --------------------- | -------------------------------------------------------------------------------------- |
| `composition-url`\*   | `https%3A%2F%2Fcdn.car-cutter.com%2Flibs%2Fweb-player%2Fv3%2Fdemos%2Fcomposition.json` |
| `hide-categories-nav` | `true`                                                                                 |
| `categories-filter`   | `360%7Cinterior`                                                                       |

#### Result

```HTML
src="https://cdn.car-cutter.com/libs/web-player/v3/integrations/iframe/index.html?composition-url=https%3A%2F%2Fcdn.car-cutter.com%2Flibs%2Fweb-player%2Fv3%2Fdemos%2Fcomposition.json&hide-categories-nav=true&categories-filter=360%7Cinterior"
```

#### HTML

```html
<iframe
  src="https://cdn.car-cutter.com/libs/web-player/v3/integrations/iframe/index.html?composition-url=https%3A%2F%2Fcdn.car-cutter.com%2Flibs%2Fweb-player%2Fv3%2Fdemos%2Fcomposition.json&hide-categories-nav=true&categories-filter=360%7Cinterior"
></iframe>
```

## Next steps

For more customization, take a look at available **props** in the **[Properties](../properties.mdx)** section
