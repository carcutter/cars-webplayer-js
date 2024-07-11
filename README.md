# CarCutter WebPlayer v3

This repository contains the code to build CarCutter Webplayer's WebComponent!
It uses React.js with Vite.

## Usage

### HTML-Attributes

| Attribute       | Type    | Required |
| --------------- | ------- | -------- |
| composition-url | string  | ✅       |
| flatten         | boolean |          |

### Modes

To accommodate different needs, the WebPlayer offers various modes that allow excluding external libraries for a lighter bundle.

| Modes       | React-Query (~30kB) | Zod (~60kB) |
| ----------- | ------------------- | ----------- |
| Production  | ✅                  | ❌          |
| Light       | ❌                  | ❌          |
| Safe / Dev' | ✅                  | ✅          |

## Development

### Setup

1. Install Node v20. Tuto for macOS [here](https://sukiphan.medium.com/how-to-install-nvm-node-version-manager-on-macos-d9fe432cc7db)
2. Install Yarn v1 : `brew install yarn`.
3. Install the node modules with the command `yarn`.

### Running Dev'

Run `yarn dev` to start the app in development mode.

You can also specify the mode:

- by adding `--mode MODE` to the command
- `yarn dev:prod` to use the same mode as production
- `yarn dev:light` to use light mode

#### Using Local Composition

Vite serves all assets in the `/public` directory at the root path `/` during development. For instance, `/public/composition_mock.json` can be accessed at `/composition_mock.json`. Use that URL as the `compositionURL`.

### Linting

Run `yarn lint`. You can also add the flag `--fix` to automatically fix "fixable" linting errors.

### Building

Run `yarn build` to build the bundle.

You can also specify the mode:

- by adding `--mode MODE` to the command
- `yarn build:safe` to use the safe mode
- `yarn build:light` to use light mode

#### Test production

Open the file `index-build.html` directly in your browser (⚠️ NOT the one served by Vite because it won't use the production configuration ⚠️).

If you want to make adjustments and test them, you can add the `--watch` flag to the build command. Note that the browser will not refresh automatically.

#### Analyze Bundle Size

Run `npx vite-bundle-visualizer --sourcemap false` (the sourcemap seems to interfere with size calculation [GitHub issue](https://github.com/KusStar/vite-bundle-visualizer/issues/8)).

More info [here](https://www.npmjs.com/package/vite-bundle-visualizer).
