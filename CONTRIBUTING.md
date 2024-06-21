# Contributing

## Commit messages

Git commit messages are used for changelog generation. Because of this, it is important that the Git commit message format is standardized and no deviations cause incorrect changelogs to be generated.

As a standard, we make use of [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

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
- `refactor` None of the above. 

Where `[optional scope]` is the scope of the change, such as `App`, `Lib`, as these can vary over time, coordination and adherence to previously used scopes is important.

Where `<description>` is the short description of the change. **It is important that the description starts with a capital and ends with a full stop.** The short description will directly show up in the changelog, therefore the description must make sense within that context.

Where `[optional body]` is a long description of the change.

Where `[optional footer(s)]` is a place for optional information, such as linking to issues, merge requests, etc. as is described [here](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue).

An example of a commit message:

```
fix(Lib): Resolved a null pointer causing crash during image load.

Fixed a null pointer in the PNG loader that caused PNG image loading to crash whenever a 16-bit image would be loaded.

Resolves #14.
```

### Reverting

For reverting, the `revert` scope should be used, followed by the description of the commit that is reverted.

For example:

```
revert: Resolved a null pointer causing crash during image load.

Refs: e4231f6e
```

## Contributions

To contribute, fork this repository and create a [pull request](https://docs.github.com/en/github/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request).
