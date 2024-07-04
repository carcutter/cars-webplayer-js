# CarCutter WebPlayer v3

This repository contains the code to build CarCutter Webplayer's WebComponent!
It uses React.js with Vite.

## Setup

1. Install Node v20. Tuto for macOS [here](https://sukiphan.medium.com/how-to-install-nvm-node-version-manager-on-macos-d9fe432cc7db)
2. Install Yarn v1 : `brew install yarn`.
3. Install the node modules with the command `yarn`.

## Running

Run `yarn dev` to start the app in dev'

## Linting

Run `yarn lint`

## Test production

- Build `yarn build`
- Run the Vite server `yarn dev` to serve the `data.json` file
- Open `index-build.html` direclty on your brother (! NOT THE ONE SERVED BY VITE BECAUSE IT WON'T USE PROD CONFIGURATION !)

### Analyze bundle size

Simply run `npx vite-bundle-visualizer`

More infos [here](https://www.npmjs.com/package/vite-bundle-visualizer)
