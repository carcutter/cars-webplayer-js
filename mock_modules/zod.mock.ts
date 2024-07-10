const z = {
  string: () => z,
  number: () => z,
  boolean: () => z,
  object: () => z,
  array: () => z,

  optional: () => z,
  enum: () => z,

  discriminatedUnion: () => z,
  literal: () => z,

  min: () => z,
  max: () => z,

  safeParse: (data: unknown) => ({ success: true, data, error: null }),
  parse: (data: unknown) => data,
};

export { z };
