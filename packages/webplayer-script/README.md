# Script WebPlayer

Use CarCutter WebPlayer without any Package Manager

## Usage

1. Import script in `<head>` : `<script src="https://cdn.car-cutter.com/libs/web-player/v3/bundle.js"></script>`
2. Use: `<cc-webplayer composition-url="..." />`

### Using the React of the page

If the page already loads React as UMD globals (`React` and `ReactDOM`), a lighter bundle can use it instead of bundling its own:

| React of the page | Bundle                                                                |
| ----------------- | --------------------------------------------------------------------- |
| 16.8 or 17        | `https://cdn.car-cutter.com/libs/web-player/v3/bundle-react-16-17.js` |
| 18                | `https://cdn.car-cutter.com/libs/web-player/v3/bundle-react-18.js`    |

```html
<script src="https://unpkg.com/react@17.0.2/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@17.0.2/umd/react-dom.production.min.js"></script>
<script src="https://cdn.car-cutter.com/libs/web-player/v3/bundle-react-16-17.js"></script>
```

## Development

`pnpm build` builds every bundle of `variants.json`. `vite build` and `pnpm analyze` build or analyze one of them, picked with `SCRIPT_VARIANT` (`default` by default): `SCRIPT_VARIANT=react-18 pnpm analyze`.

### Next Steps

For more customization, take a look at the **[Online Documentation](https://carcutter.github.io/cars-webplayer-js/)**
