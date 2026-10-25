/**
 * Limits `value` to the inclusive range [`min`, `max`].
 * Throws a RangeError when `min` is greater than `max`. NaN is not checked:
 * it passes through as Math.min and Math.max return it.
 */
export function clamp(value: number, min: number, max: number): number {
  if (min > max) {
    throw new RangeError(`clamp: min (${min}) is greater than max (${max})`);
  }
  return Math.min(Math.max(value, min), max);
}
