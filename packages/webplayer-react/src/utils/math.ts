export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// linear interpolation
export const lerp = (start: number, end: number, progress: number) =>
  start + (end - start) * progress;

export const modulo = (val: number, mod: number) => ((val % mod) + mod) % mod;
