import { describe, expect, it } from "vitest";
import { clamp } from "./clamp.js";

describe("clamp", () => {
  it("returns the value when it is inside the range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it("raises a value below the range to min", () => {
    expect(clamp(-3, 0, 10)).toBe(0);
  });

  it("lowers a value above the range to max", () => {
    expect(clamp(42, 0, 10)).toBe(10);
  });

  it("keeps values equal to the bounds", () => {
    expect(clamp(0, 0, 10)).toBe(0);
    expect(clamp(10, 0, 10)).toBe(10);
  });

  it("throws a RangeError when min is greater than max", () => {
    expect(() => clamp(1, 10, 0)).toThrow(RangeError);
  });
});
