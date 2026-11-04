# Script WebPlayer

Use CarCutter WebPlayer without any Package Manager

## Usage

1. Import script in `<head>` : `<script src="https://cdn.car-cutter.com/libs/web-player/v3/bundle.js"></script>`
2. Use: `<cc-webplayer composition-url="..." />`

`bundle-react-16-17.js` and `bundle-react-18.js`, which used the React of the page, are now copies of `bundle.js`: pages loading them keep working, but should switch to `bundle.js`.

## Development

`pnpm build` builds the bundle into `dist`, `pnpm analyze` shows what it is made of.

### Next Steps

For more customization, take a look at the **[Online Documentation](https://carcutter.github.io/cars-webplayer-js/)**
