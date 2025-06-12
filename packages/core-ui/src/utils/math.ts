export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// linear interpolation
export const lerp = (start: number, end: number, progress: number) =>
  start + (end - start) * progress;

export const modulo = (val: number, mod: number) => ((val % mod) + mod) % mod;

export const convertPannellumHfovToBidirectionalSteppedScale = (
  hfov: number,
  minHfov: number,
  maxHfov: number,
  maxZoom: number,
  zoomStep: number,
  invert: boolean = false
): number => {
  const clampedValue = clamp(hfov, minHfov, maxHfov);

  if (clampedValue === (invert ? maxHfov : minHfov)) return maxZoom;
  if (clampedValue === (invert ? minHfov : maxHfov)) return 1;

  const normalizedValue = (clampedValue - minHfov) / (maxHfov - minHfov);
  const percentage = invert ? normalizedValue : 1 - normalizedValue;

  const rawTargetValue = 1 + percentage * (maxZoom - 1);

  const numberOfSteps = Math.round((rawTargetValue - 1) / zoomStep);

  const steppedValue = 1 + numberOfSteps * zoomStep;

  return clamp(steppedValue, 1, maxZoom);
};

export const findClosestValidNumberInRange = (
  num: number,
  range: readonly number[]
) => {
  // If the number is already valid, return it
  if (range.includes(num)) {
    return num;
  }

  // Find the closest value
  let closest = range[0];
  let minDiff = Math.abs(num - closest);

  for (let i = 1; i < range.length; i++) {
    const diff = Math.abs(num - range[i]);
    if (diff < minDiff) {
      minDiff = diff;
      closest = range[i];
    }
  }
  return closest;
};
