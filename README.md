# Car-Cutter WebPlayer Monorepo

This monorepo hosts the WebPlayer project, which includes multiple demo applications and several packages for different web technologies. The project is structured to support various frameworks and libraries, enabling reusable components and configurations.

## Contributing

### Structure

The structure of this monorepo is organized as follows:

```
CARS-WEBPLAYER/
├── apps/                    # Demo applications for different frameworks
│   ├── demo-next/           # Demo app using Next.js
│   ├── demo-vanilla/        # Demo app using Vanilla JS
│   .
│   .
├── packages/                # Shared packages for different frameworks
│   ├── core/                # Core logic for the web player (Composition typing, utils functions, ...)
│   ├── core-ui/             # WebPlayer implementation (carrousel, 360, hotspots, ...)
│   ├── core-wc/             # Wraps the WebPlayer in a WebComponent
│   ├── webplayer-react/     # Adapt the WC WebPlayer for React
│   ├── webplayer-next/      # Adapt the WC WebPlayer for Next.js
│   ├── webplayer-wc/        # Expose the WC from core-wc and add React & ReactDOM
│   .
│   .
└── schemas/                 # JSON schemas
```

- **apps/**: Contains demo applications showcasing the usage of the web player in various frameworks. Each demo is isolated, allowing you to see how the web player can be integrated into different environments.

- **packages/**: This directory all NPM packages

## Development

### Setup

1. Install Node v20. Tuto for macOS [here](https://sukiphan.medium.com/how-to-install-nvm-node-version-manager-on-macos-d9fe432cc7db)
2. Install Yarn v1 : `brew install yarn`.
3. Install the node modules with the command `yarn`.

### Developing the React WebPlayer

Simply run `yarn dev` from the workspace root to start the app in development mode.

#### Using Local Composition

Vite serves all assets in the `/public` directory at the root path `/` during development. For instance, `/public/composition_mock.json` can be accessed at `/composition_mock.json`. Use that URL as the `compositionURL`.

#### Analyze Bundle Size

Run `yarn analyze` to analyze the bundle.

NOTE : the sourcemap seems to interfere with size calculation [GitHub issue](https://github.com/KusStar/vite-bundle-visualizer/issues/8). More info [here](https://www.npmjs.com/package/vite-bundle-visualizer).

### Building

Run `yarn build` to build all packages

### Run demos

1. Go on any demo's directory : `cd apps/demo-XX`
2. Run `yarn dev` to start the app

### Linting

Run `yarn lint`

### Useful scripts

Scripts are available in the `scripts` directory

#### Generate JSON schema

Use the command `yarn migrate_composition <COMPOSITION_V1_PATH>`. It will create a new file with the new type

#### Convert composition from V2 to V3

Use the command `yarn generate_json_schema`. It will create a file within the _schemas_ folder

## Publication

This repository uses the Changesets CLI to handle versioning and publication to NPM registry. Follow the steps below to publish new versions of your packages:

### 1. Create a Changeset

To propose a new version for one or more packages, you need to create a changeset. Run the command `yarn commit-packages` and follow the prompts.

You will be prompted to select the packages that should be affected and to specify the type of change (patch, minor, or major). This will create a changeset file that describes the changes.

### 2. Version Packages

Once changesets have been added and merged into your base branch (e.g., `main`), you can version the packages. This step updates the version numbers in your `package.json` files and generates changelogs based on your changesets: `yarn version-packages`

This command will:

- Update the version numbers in the affected `package.json` files.
- Generate or update changelog files.
- Prepare the packages for publishing.

### 3. Publish to npm

After versioning the packages, you can publish them to npm. This command will publish all packages that have changed since the last release:

`yarn publish-packages`

Make sure you are logged in to npm with the correct credentials before running this command. The packages will be published according to the access level specified in your `changesets` configuration (`config.json`).

## Use the WebPlayer on your App

### Properties

| Prop                | Type                     | Required | Default                | Description                                               |
| ------------------- | ------------------------ | -------- | ---------------------- | --------------------------------------------------------- |
| `compositionUrl`    | `string`                 | ✅       | -                      | URL to the composition data                               |
| `flatten`           | `boolean`                |          | false                  | Flatten the hierarchy of elements (no categories)         |
| `infiniteCarrousel` | `boolean`                |          | false                  | Allow to navigate from 1st to last image (and vice versa) |
| `permanentGallery`  | `boolean`                |          | false                  | Display gallery under the carrousel                       |
| `imageLoadStrategy` | `"quality"` or `"speed"` |          | `"quality"`            | Strategy for loading images.                              |
| `minImageWidth`     | `number`                 |          | -                      | Force minimum image width (in pixels)                     |
| `maxImageWidth`     | `number`                 |          | -                      | Force maximum image width (in pixels)                     |
| `allowFullScreen`   | `boolean`                |          | true                   | Whether to allow full screen mode                         |
| `eventId`           | `string`                 |          | `"cc-webplayer-event"` | ID of cc-player events                                    |
| `reverse360`        | `boolean`                |          | false                  | Reverse the 360-degree rotation                           |

_NOTE: If you are using the WebComponent directly, you need to transform the props to HTML attributes
(which are in kebab case and take `string` as value type)_

### Customisation

#### CSS

You can customise the WebPlayer CSS with CSS Variables

| CSS Variable                        | Description                        | Default Value     |
| ----------------------------------- | ---------------------------------- | ----------------- |
| `--cc-webplayer-background`         | Background color (contrast texts)  | `0 0% 100%`       |
| `--cc-webplayer-foreground`         | Foreground color (text color)      | `240 10% 3.9%`    |
| `--cc-webplayer-primary`            | Primary color (buttons)            | `216 100% 52%`    |
| `--cc-webplayer-primary-foreground` | Foreground color for primary items | `--cc-background` |
| `--cc-webplayer-neutral`            | Neutral color                      | `0 0% 39%`        |
| `--cc-webplayer-neutral-foreground` | Foreground color for neutral items | `--cc-foreground` |
| `--cc-webplayer-radius-ui`          | UI element Border radius (buttons) | `9999px` (full)   |
| `--cc-webplayer-radius-carrousel`   | Carrousel border radius            | `0`               |
| `--cc-webplayer-radius-gallery`     | Gallery images border radius       | `0`               |

### More customisation

For more customisation, take a look at the **[Online Documentation](https://carcutter.github.io/cars-webplayer-js/)**
