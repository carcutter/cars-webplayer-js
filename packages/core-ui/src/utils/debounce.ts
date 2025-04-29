/**
 * Creates a throttled and debounced version of a callback function
 *
 * @param callback The function to throttle and debounce
 * @param throttleDelay Minimum time between allowed executions during continuous events (ms)
 * @param debounceDelay Time to wait after last event before final execution (ms)
 * @returns A throttled and debounced function
 */
export function createThrottleDebounce<Args extends unknown[], Return>(
  callback: (...args: Args) => Return,
  throttleDelay = 50,
  debounceDelay = 200
): (...args: Args) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let lastCall = 0;

  return (...args: Args) => {
    const now = Date.now();

    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }

    if (now - lastCall >= throttleDelay) {
      callback(...args);
      lastCall = now;
    }

    timeout = setTimeout(() => {
      callback(...args);
    }, debounceDelay);
  };
}
