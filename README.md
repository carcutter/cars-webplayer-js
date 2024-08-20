# CarCutter WebPlayer v3

This repository contains the code to build CarCutter Webplayer's WebComponent!
It uses React.js with Vite.

## Usage

### HTML-Attributes

| Attribute             | Type    | Required | Description                                               |
| --------------------- | ------- | -------- | --------------------------------------------------------- |
| `composition-url`     | string  | ✅       | URL to the composition data                               |
| `flatten`             | boolean |          | Flatten the hierarchy of elements (no categories)         |
| `infinite-carrousel`  | boolean |          | Allow to navigate from 1st to last image (and vice versa) |
| `reverse360`          | boolean |          | Reverse the 360-degree rotation                           |
| `min-image-width`     | number  |          | Force minimum image width (in pixels)                     |
| `max-image-width`     | number  |          | Force maximum image width (in pixels)                     |
| `image-load-strategy` | string  |          | Strategy for loading images. "quality" or "speed"         |
| `event-id`            | string  |          | ID of cc-player events                                    |
| `allow-full-screen`   | boolean |          | Whether to allow full screen mode                         |
| `permanent-gallery`   | boolean |          | Display gallery under the carrousel                       |

### Customisation

#### CSS

You can customise the WebPlayer CSS with CSS Variables

| CSS Variable              | Description                        | Default Value     |
| ------------------------- | ---------------------------------- | ----------------- |
| `--cc-background`         | Background color (contrast texts)  | `0 0% 100%`       |
| `--cc-foreground`         | Foreground color (text color)      | `240 10% 3.9%`    |
| `--cc-primary`            | Primary color (buttons)            | `216 100% 52%`    |
| `--cc-primary-foreground` | Foreground color for primary items | `--cc-background` |
| `--cc-neutral`            | Neutral color                      | `0 0% 39%`        |
| `--cc-neutral-foreground` | Foreground color for neutral items | `--cc-foreground` |
| `--cc-radius-ui`          | UI element Border radius (buttons) | `9999px` (full)   |
| `--cc-radius-carrousel`   | Carrousel border radius            | `0`               |
| `--cc-radius-gallery`     | Gallery images border radius       | `0`               |

##### Example

```html
<style>
  cc-web-player {
    --cc-background: 262 100% 95%;
    --cc-foreground: 262 5% 0%;
    --cc-primary: 262 88% 58%;
    --cc-neutral: 262 10% 39%;
    --cc-radius-ui: 0.8rem;
  }
</style>
```

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

Run `yarn analyze` to analyze the bundle.

You can also specify the mode:

- by adding `--mode MODE` to the command
- `yarn analyze:safe` to use the safe mode
- `yarn analyze:light` to use light mode

NOTE : the sourcemap seems to interfere with size calculation [GitHub issue](https://github.com/KusStar/vite-bundle-visualizer/issues/8). More info [here](https://www.npmjs.com/package/vite-bundle-visualizer).

### Useful scripts

#### Generate JSON schema

Use the command `yarn migrate_composition <COMPOSITION_V1_PATH>`. It will create a new file with the new type

#### Convert composition from V2 to V3

Use the command `yarn generate_json_schema`. It will create a file within the _schemas_ folder
