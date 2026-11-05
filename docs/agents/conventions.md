# Conventions

What ESLint (`eslint.config.js`) and the tsconfigs (`packages/config-typescript`) don't already enforce. Write code indistinguishable from its neighbours: same comment density, naming and idioms.

## Components (`packages/core-ui/src`)

- One component per file, PascalCase, `export default`, typed with `React.FC` and a local `type Props`:
  ```tsx
  type Props = { currentIndex: number; maxIndex: number };

  const IndexIndicator: React.FC<Props> = ({ currentIndex, maxIndex }) => {
  ```
- Place it by size in `components/`: `atoms/`, `molecules/` (player elements in `molecules/web_player_elements/`), `organisms/`, `template/`; generic UI in `ui/`, SVG icons in `icons/` (`<Name>Icon.tsx`).
- Hooks are named exports `useX` in `hooks/`. Each context exports a `useXContext` that throws outside its provider:
  ```ts
  throw new Error(
    "useGlobalContext must be used within a GlobalContextProvider"
  );
  ```
- A user-replaceable icon goes through `CustomizableIcon`, so `<cc-webplayer-icon>` can override it.

## Classes

- Join classes with `cn` from `packages/core-ui/src/utils/style.ts`: a plain join of the truthy strings, not tailwind-merge, so a later class doesn't remove a conflicting earlier one. Give conflicting classes in exclusive branches:
  ```tsx
  className={cn(
    "flex h-5 w-8 items-center justify-center rounded-full transition-colors",
    enabled ? "bg-primary" : "bg-background/60"
  )}
  ```
- Use the player's breakpoints: `max-small:`, `small:` (depend on the orientation), `max-large:`, `large:`, declared in that order in `src/index.css` so that `large:` overrides `small:`. Their values are also in `src/const/browser.ts` for `matchMedia`: change both.
- Spacing classes are multiples of 4px (`--spacing: 4px`), font sizes in px: the player doesn't depend on the page's root font size.
- Colors are the theme's (`bg-primary`, `text-foreground/65`...), set from the `--cc-webplayer-*` variables. A new theme color is `hsl(var(--x))` in the `@theme inline reference` block of `src/index.css`, with its variable added in `WebPlayer.tsx`.

## Comments

- Explain why, in full sentences, at the density of the file. Section markers inside long components: `// -- Gallery`, sub-sections `// - Events`.
- `console` calls are errors for ESLint: keep the ones meant for integrators (debug options) behind `// eslint-disable-next-line no-console`.

## Packages

- Imports between workspace packages go through the package name (`@car-cutter/core`), never a relative path into another package.
- Constants shared by the player and the wrappers (tags, events, defaults) live in `packages/core/src/const`, types in `packages/core/src/types`, and are exported from `packages/core/index.ts`.
- A list that must cover every prop is typed against `WebPlayerProps` so that the build fails when a prop is added: `WEB_PLAYER_WC_PROPS` (`satisfies Record<keyof WebPlayerProps, PropType>`), Angular's `WebPlayerInputs`; Vue's `booleanPropsDefaults` covers the boolean props only. Keep that pattern for new lists. (The docs' `properties` array isn't checked that way: update it by hand.)
- Wrappers set attributes, not properties (Angular `syncAttributes`, Vue `^`-prefixed keys): the element parses attributes.
