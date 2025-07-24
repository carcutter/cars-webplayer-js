[![Lint Commit Messages](https://github.com/carcutter/cars-webplayer-js/actions/workflows/lint_commits.yml/badge.svg)](https://github.com/carcutter/cars-webplayer-js/actions/workflows/lint_commits.yml) [![Continuous Delivery](https://github.com/carcutter/cars-webplayer-js/actions/workflows/continuous_delivery.yml/badge.svg)](https://github.com/carcutter/cars-webplayer-js/actions/workflows/continuous_delivery.yml) [![Continuous Deployment](https://github.com/carcutter/cars-webplayer-js/actions/workflows/continuous_deployment.yml/badge.svg)](https://github.com/carcutter/cars-webplayer-js/actions/workflows/continuous_deployment.yml) [![Continuous Integration](https://github.com/carcutter/cars-webplayer-js/actions/workflows/continuous_integration.yml/badge.svg)](https://github.com/carcutter/cars-webplayer-js/actions/workflows/continuous_integration.yml)

# Car-Cutter WebPlayer Monorepo

This monorepo hosts the WebPlayer project, which includes multiple demo applications and several packages for different web technologies. The project is structured to support various frameworks and libraries, enabling reusable components and configurations.

## Contributing

### Structure

The structure of this monorepo is organized as follows:

```bash
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

1. Install Node v20. Tutorial for macOS [here](https://sukiphan.medium.com/how-to-install-nvm-node-version-manager-on-macos-d9fe432cc7db)
2. Install Yarn v1 : `brew install yarn`.
3. Install the node modules with the command `yarn`.

### Developing the WebPlayer Core

Simply run `yarn dev` from the workspace root to start the app in development mode.

#### Using Local Composition

Vite serves all assets in the `/public` directory at the root path `/` during development. For instance, `/public/composition_mock.json` can be accessed at `/composition_mock.json`. Use that URL as the `compositionUrl`.

### Developing the Documentation

Simply run `yarn dev:docs` from the workspace root to start the documentation in development mode.

### Building

Run `yarn build` to build all packages

#### Analyze Bundle Size

Go in any package and run `yarn analyze` to analyze the bundle.

NOTE : the sourcemap seems to interfere with size calculation [GitHub issue](https://github.com/KusStar/vite-bundle-visualizer/issues/8). More info [here](https://www.npmjs.com/package/vite-bundle-visualizer).

### Linting

Run `yarn lint`

### Run demos

Run `yarn demo:XX` to start any demo app

## Publication

This repository uses the Changesets CLI to handle versioning and publication to NPM registry. Follow the steps below to publish new versions of your packages:

### 1. Create a Changeset

To propose a new version for one or more packages, you need to create a changeset. Run the command `yarn version:commit` and follow the prompts.

You will be prompted to select the packages that should be affected and to specify the type of change (patch, minor, or major). This will create a changeset file that describes the changes.

### 2. Version Packages

Once changesets have been added and merged into your base branch (e.g., `main`), you can version the packages. This step updates the version numbers in your `package.json` files and generates changelogs based on your changesets: `yarn version:apply`

This command will:

- Update the version numbers in the affected `package.json` files.
- Generate or update changelog files.
- Prepare the packages for publishing.

### 3. Ensure every thing is working as expected

Run `yarn ci` to run both `build` and `lint` commands. It will also run `yarn` to be sure dependencies are correct.

_NOTE: at this point, if you see a change in the yarn.lock file, it is certainly because all version have not been properly updated._

### 4. Publish to npm

After versioning the packages, you can publish them to npm. This command will publish all packages that have changed since the last release: `yarn publish:packages`

Make sure you are logged in to npm with the correct credentials before running this command. The packages will be published according to the access level specified in your `changesets` configuration (`config.json`).

### 5. Publish documentation

Run `yarn publish:docs`

## Use the WebPlayer on your App

### Properties

| Prop                          | Type                               | Default           | Description                                                                                                                                      |
| ----------------------------- | ---------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `compositionUrl`              | `string`                           | ❌ Required       | URL to the composition data                                                                                                                      |
| `hideCategoriesNav`           | `boolean`                          | `false`           | Hide the category-based navigation                                                                                                               |
| `infiniteCarrousel`           | `boolean`                          | `false`           | Allow to navigate from 1st to last media (and vice versa)                                                                                        |
| `permanentGallery`            | `boolean`                          | `false`           | Display gallery under the carrousel                                                                                                              |
| `mediaLoadStrategy`           | `"quality"`/`"balanced"`/`"speed"` | `"quality"`       | Strategy for loading medias.                                                                                                                     |
| `minMediaWidth`               | `number`                           | `0`               | Force minimum media width (in pixels)                                                                                                            |
| `maxMediaWidth`               | `number`                           | `Infinity`        | Force maximum media width (in pixels)                                                                                                            |
| `preloadRange`                | `number`                           | `1`               | Number of items to preload before and after the viewport                                                                                         |
| `autoLoad360`                 | `boolean`                          | `false`           | Load 360 images without having to click                                                                                                          |
| `autoLoadInterior360`         | `boolean`                          | `false`           | Load interior 360 images without having to click                                                                                                 |
| `categoriesFilter`            | `string`                           | `*`               | Only display certain categories                                                                                                                  |
| `extendBehavior`              | `"full_screen"`/`"event"`/`"none"` | `"full_screen"`   | Handle extend mode                                                                                                                               |
| `eventPrefix`                 | `string`                           | `"cc-webplayer:"` | Prefix of cc-player events                                                                                                                       |
| `demoSpin`                    | `boolean`                          | `false`           | Run a spin once the 360 images has been loaded                                                                                                   |
| `reverse360`                  | `boolean`                          | `false`           | Reverse the 360-degree rotation                                                                                                                  |
| `integration`                 | `boolean`                          | `false`           | Allows to use maxItemsShown and disables permanentGallery with infiniteCarrousel, enables hideCategoriesNav                                      |
| `maxItemsShown`               | `number`                           | `1`               | Maximum number of items to display in the gallery                                                                                                |
| `analyticsEventPrefix`        | `string`                           | `cc-analytics`    | Prefix of cc-analytics events                                                                                                                    |
| `analyticsUrl`                | `string`                           | ``                | A URL to send simple tracking / analytic events                                                                                                  |
| `analyticsBearer`             | `string`                           | ``                | A Bearer token to authenticate when sending requests to `analyticUrl`                                                                            |
| `analyticsSimpleRequestsOnly` | `boolean`                          | `false`           | A flag if only Simple-Requests should be sent. Will disable `analyticsBearer`. See https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS |
| `analyticsDryRun`             | `boolean`                          | `false`           | A flag if the tracking / analytic events should be just output to the console instead of actually send to the `analyticsUrl`                     |
| `analyticsDebug`              | `boolean`                          | `false`           | A flag if the tracking / analytic events should output debug information to the console                                                          |

_NOTE: If you are using the WebComponent directly, you need to transform the props to HTML attributes
(which are in dashed-case and take `string` as value type)_

### Customization

#### CSS

You can customize the WebPlayer CSS with CSS Variables

| CSS Variable                        | Description                        | Default Value               |
| ----------------------------------- | ---------------------------------- | --------------------------- |
| `--cc-webplayer-background`         | Background color (contrast texts)  | `0 0% 100%`                 |
| `--cc-webplayer-foreground`         | Foreground color (text color)      | `240 10% 3.9%`              |
| `--cc-webplayer-primary`            | Primary color (buttons)            | `216 100% 52%`              |
| `--cc-webplayer-primary-foreground` | Foreground color for primary items | `--cc-webplayer-background` |
| `--cc-webplayer-primary-light`      | Alternative to primary if too dark | `--cc-webplayer-primary`    |
| `--cc-webplayer-neutral`            | Neutral color                      | `0 0% 39%`                  |
| `--cc-webplayer-neutral-foreground` | Foreground color for neutral items | `--cc-webplayer-foreground` |
| `--cc-webplayer-radius-ui`          | UI element Border radius (buttons) | `16px`                      |
| `--cc-webplayer-radius-carrousel`   | Carrousel border radius            | `0`                         |
| `--cc-webplayer-radius-gallery`     | Gallery medias border radius       | `0`                         |

### More customization

For more customization, take a look at the **[Online Documentation](https://carcutter.github.io/cars-webplayer-js/)**

## Useful scripts

Scripts are available in the `scripts` directory

### Generate JSON schema

Use the command `yarn migrate_composition <COMPOSITION_V1_PATH>`. It will create a new file with the new type

### Convert composition from V2 to V3

Use the command `yarn generate_json_schema`. It will create a file within the _schemas_ folder
