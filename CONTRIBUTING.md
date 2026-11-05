# Contributing

## Commit messages

Git commit messages are used for changelog generation. Because of this, it is important that the Git commit message format is standardized and no deviations cause incorrect changelogs to be generated.

As a standard, we make use of [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

Pull requests are squashed into `develop`: their title becomes the commit, so it follows the same format, and CI checks it (`.github/workflows/pr-title.yml`).

Therefore, any Git commit message should adhere to the following format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Here, `<>` denotes a required element, whereas `[]` denotes an optional field.

Where `<type>` is the type of contribution, which can be one of:

- `feat` A feature.
- `fix` A fix.
- `test` A test-related change.
- `style` A style correction.
- `perf` A performance improvement.
- `ci` A change related to CI.
- `build` A change related to building this project (dependencies, fixes, etc.).
- `docs` Documentation change.
- `refactor` A change that neither fixes a bug nor adds a feature.
- `chore` Other changes, not to the sources or the tests.
- `revert` Reverts a previous commit.

Where `[optional scope]` is the scope of the change, such as `App`, `Lib`, as these can vary over time, coordination and adherence to previously used scopes is important.

Where `<description>` is the short description of the change. **It is important that the description starts with a capital, without a full stop at the end.** The short description will directly show up in the changelog, therefore the description must make sense within that context.

Where `[optional body]` is a long description of the change.

Where `[optional footer(s)]` is a place for optional information, such as linking to issues, merge requests, etc. as is described [here](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue).

An example of a commit message:

```
fix(Lib): Resolved a null pointer causing crash during image load

Fixed a null pointer in the PNG loader that caused PNG image loading to crash whenever a 16-bit image would be loaded.

Resolves #14.
```

### Reverting

For reverting, the `revert` type should be used, followed by the description of the commit that is reverted.

For example:

```
revert: Resolved a null pointer causing crash during image load

Refs: e4231f6e
```

## Browser support

The player's styles are built with Tailwind CSS 4, made for Safari 16.4, Chrome 111 and Firefox 128: its CSS relies on cascade layers, `@property`, `color-mix()` and `oklab` gradients. Older browsers still use the player, about 0.8% of its loads in late 2026 (mostly Chrome 109 on Windows 7 / 8, Safari on iOS 15 and Firefox ESR 115). `tailwindCompat` in `packages/core-ui/vite.config.ts` keeps most styles working for those with cascade layers (Safari 15.4, Chrome 99, Firefox 97), and in the shadow root of the web component. A few are still lost there (the `translate` and `scale` utilities need Chrome 104), and older browsers get no styles, but most of them can't run the player's JavaScript either.

So, when a change brings CSS newer than these browsers (a Tailwind class or variant not used yet, or CSS written by hand: container queries, `:has()`, nesting, `@starting-style`...), check the player on an old device or browser too (an iPhone on iOS 15.4 to 16.3, Chrome 109, in a simulator or a service like BrowserStack), and in the web component, not only in a page.

## Contributions

To contribute, fork this repository and create a [pull request](https://docs.github.com/en/github/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request).
