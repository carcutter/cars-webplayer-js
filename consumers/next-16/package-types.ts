// Loads the published .d.ts of @car-cutter/next-webplayer, checked by
// tsconfig.package-types.json. Imported rather than listed in its "files":
// listed by their node_modules path, they don't resolve the dependencies of
// the package, which pnpm puts next to its real folder
export type * from "@car-cutter/next-webplayer";
export type * as Legacy from "@car-cutter/next-webplayer/legacy";
