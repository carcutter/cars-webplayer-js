<!--
Title: a Conventional Commit, e.g. `feat: Add the gallery position prop`.
PRs are squashed into develop, so the title is the commit.
-->

## What

<!-- The change, in a few sentences or bullets. -->

## Why

<!-- The problem, the request or the incident behind it. -->

Closes #<!-- issue number, closed when the PR is merged; delete the line if there is no issue -->

## Impact on integrators

<!-- Who gets this change: tick the packages whose published output changes. -->

- [ ] None: repo tooling, demos, tests, agent docs only
- [ ] User docs (`apps/docs`, published with the next release)
- [ ] `react-webplayer` / `next-webplayer`
- [ ] `wc-webplayer` and its dependents (`vue-webplayer`, `angular-webplayer`, `vanilla-webplayer`, the CDN script)

Public API (props / attributes, events, CSS variables, exports, peer dependencies, supported browsers):

- [ ] Unchanged
- [ ] Extended, backwards compatible: <!-- what was added -->
- [ ] **Breaking**: <!-- what breaks, and what integrators have to change -->

## Screenshots

<!-- For a visible change: before / after, on a desktop and a phone width. Delete otherwise. -->

| Before | After |
| ------ | ----- |
|        |       |

## How it was tested

<!-- What you ran and checked by hand, so that a reviewer can reproduce it. -->

- [ ] `pnpm run ci` (frozen install, syncpack, build, lint)
- [ ] `pnpm test` (100% coverage kept)
- [ ] `pnpm e2e`: for a change of the player or the demos
- [ ] `pnpm test:consumers`: for a change of a published package's code, exports, build or dependencies
- [ ] Checked in the web component's shadow root (playground `shadowDom`, or `pnpm demo:wc`)
- [ ] Checked on an old browser, for CSS newer than the supported ones (`CONTRIBUTING.md`, "Browser support")

## Checklist

- [ ] A new or changed prop / event is wired everywhere it is listed: core, element, wrappers, demos, docs (`docs/agents/workflows.md`)
- [ ] User docs (`apps/docs`, `README.md`) and agent docs (`AGENTS.md`, `docs/agents/`) updated, or not affected
- [ ] A fixed bug has a test that fails without the fix
- [ ] No version bump: versions change in release commits only
