import { describe, expect, it } from "vitest";
import {
  DEFAULT_ISO_CAMERA,
  cameraOffset,
  orthoBounds,
  zoomStep,
} from "./iso-camera-math.js";

describe("cameraOffset", () => {
  it("places the camera on the yaw-45° diagonal", () => {
    const o = cameraOffset(35.26, 45, 60);
    expect(o.x).toBeCloseTo(o.z, 9);
    expect(o.x).toBeGreaterThan(0);
  });

  it("gives true isometric height at pitch 35.26°", () => {
    const o = cameraOffset(35.26, 45, 60);
    const horizontal = Math.hypot(o.x, o.z);
    expect(o.y / horizontal).toBeCloseTo(1 / Math.SQRT2, 3);
  });

  it("keeps the requested distance", () => {
    const o = cameraOffset(30, 45, 50);
    expect(Math.hypot(o.x, o.y, o.z)).toBeCloseTo(50, 9);
  });

  it("rejects non-finite input", () => {
    expect(() => cameraOffset(Number.NaN, 45, 60)).toThrow(RangeError);
    expect(() => cameraOffset(35, 45, Infinity)).toThrow(RangeError);
  });
});

describe("orthoBounds", () => {
  it("is centred and follows the aspect ratio", () => {
    expect(orthoBounds(16, 16 / 9)).toEqual({
      top: 8,
      bottom: -8,
      left: -128 / 9,
      right: 128 / 9,
    });
  });

  it("rejects zero, negative and non-finite sizes", () => {
    expect(() => orthoBounds(0, 1)).toThrow(RangeError);
    expect(() => orthoBounds(16, -1)).toThrow(RangeError);
    expect(() => orthoBounds(Number.NaN, 1)).toThrow(RangeError);
  });
});

describe("zoomStep", () => {
  it("zooms out on positive wheel delta and in on negative", () => {
    expect(zoomStep(16, 100, DEFAULT_ISO_CAMERA)).toBeCloseTo(17.6, 9);
    expect(zoomStep(16, -100, DEFAULT_ISO_CAMERA)).toBeCloseTo(16 / 1.1, 9);
    expect(zoomStep(16, 0, DEFAULT_ISO_CAMERA)).toBe(16);
  });

  it("stays inside the zoom range", () => {
    expect(zoomStep(23.9, 100, DEFAULT_ISO_CAMERA)).toBe(24);
    expect(zoomStep(8.1, -100, DEFAULT_ISO_CAMERA)).toBe(8);
  });

  it("rejects non-finite input", () => {
    expect(() => zoomStep(Number.NaN, 1, DEFAULT_ISO_CAMERA)).toThrow(
      RangeError,
    );
  });
});
