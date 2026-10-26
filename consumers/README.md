# Consumer apps

Minimal apps using the WebPlayer packages the way a customer does: installed
from the packed tarballs with npm, outside the yarn workspaces. Run them all
with `yarn test:consumers` (see `scripts/consumer-test.mjs`): each app is
copied to a temp folder, installed, type-checked, built and served, then
checked by the Playwright project `consumers` (`apps/e2e`).

Each app renders a player with a custom media and a custom icon, and lists
the events it gets in `<ol id="events">`.

The `@car-cutter/*` versions in the package.json files are replaced by the
tarballs when the apps are tested.
