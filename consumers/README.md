# Consumer apps

Minimal apps using the WebPlayer packages the way a customer does: installed
from the packed tarballs, in a pnpm workspace of their own (outside the
repo's one), where a package importing a framework it doesn't declare
fails. Run them all with `pnpm test:consumers`: the packages are packed
(`turbo run pack:check`), the apps installed, then type-checked, built, served and
checked by `apps/e2e/playwright.consumers.config.ts`. `CONSUMERS="react-17
vue-3.3" pnpm test:consumers` checks some of them only.

Each app renders a player with a custom media and a custom icon, and lists
the events it gets in `<ol id="events">`.

The `@car-cutter/*` versions in the package.json files are replaced by the
tarballs, through the `overrides` of `pnpm-workspace.yaml`.
