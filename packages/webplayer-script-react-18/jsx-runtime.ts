// Stands in for "react/jsx-runtime": this bundle uses the React of the host
// page (the `React` global), so JSX must be created with it too. Bundling the
// runtime of the React installed in the repo (19) gives elements the host's
// React can't render.
import React from "react";

type Props = Record<string, unknown> & { children?: React.ReactNode };

export const Fragment = React.Fragment;

export function jsx(type: React.ElementType, props: Props, key?: React.Key) {
  return React.createElement(
    type,
    key === undefined ? props : { ...props, key }
  );
}

export const jsxs = jsx;
