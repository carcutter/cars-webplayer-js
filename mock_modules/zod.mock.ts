const z = {
  string: () => z,
  number: () => z,
  boolean: () => z,
  object: () => z,
  array: () => z,

  literal: () => z,

  optional: () => z,

  enum: () => z,
  union: () => z,
  discriminatedUnion: () => z,

  extract: () => z,

  min: () => z,
  max: () => z,

  safeParse: (data: unknown) => ({ success: true, data, error: null }),
  parse: (data: unknown) => data,
};

export { z };
