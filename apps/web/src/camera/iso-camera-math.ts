// Pure math for the fixed isometric camera (docs/ASSET_PIPELINE.md §4).
// World units are metres, the ground is the XZ plane and Y points up.
// No Babylon imports here, so the numbers are testable in Node.

export interface IsoCameraConfig {
  /** Degrees above the ground plane. */
  pitchDeg: number;
  /** Degrees around the Y axis, measured from +X towards +Z. */
  yawDeg: number;
  /** Visible world height in metres at the current zoom. */
  viewHeight: number;
  minViewHeight: number;
  maxViewHeight: number;
}

/**
 * Graybox defaults until ADR-009 locks the camera (M1-T11, DEC-041):
 * true isometric pitch (atan(1/√2) ≈ 35.26°), yaw 45°, 16 m view height at
 * default zoom, zooming in 2× (8 m) and out 1.5× (24 m).
 */
export const DEFAULT_ISO_CAMERA: IsoCameraConfig = {
  pitchDeg: 35.26,
  yawDeg: 45,
  viewHeight: 16,
  minViewHeight: 8,
  maxViewHeight: 24,
};

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface OrthoBounds {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

const toRadians = (deg: number) => (deg * Math.PI) / 180;

function requireFinite(value: number, name: string): void {
  if (!Number.isFinite(value)) {
    throw new RangeError(`${name} must be a finite number, got ${value}`);
  }
}

/** Offset from the camera target to the camera position. */
export function cameraOffset(
  pitchDeg: number,
  yawDeg: number,
  distance: number,
): Vec3 {
  requireFinite(pitchDeg, "pitchDeg");
  requireFinite(yawDeg, "yawDeg");
  requireFinite(distance, "distance");
  const pitch = toRadians(pitchDeg);
  const yaw = toRadians(yawDeg);
  const horizontal = distance * Math.cos(pitch);
  return {
    x: horizontal * Math.cos(yaw),
    y: distance * Math.sin(pitch),
    z: horizontal * Math.sin(yaw),
  };
}

/** Orthographic frustum for a view height and an aspect ratio (width / height). */
export function orthoBounds(viewHeight: number, aspect: number): OrthoBounds {
  requireFinite(viewHeight, "viewHeight");
  requireFinite(aspect, "aspect");
  if (viewHeight <= 0 || aspect <= 0) {
    throw new RangeError("viewHeight and aspect must be positive");
  }
  const halfHeight = viewHeight / 2;
  const halfWidth = halfHeight * aspect;
  return {
    top: halfHeight,
    bottom: -halfHeight,
    left: -halfWidth,
    right: halfWidth,
  };
}

/** One mouse-wheel step: 10% per notch, kept inside the configured zoom range. */
export function zoomStep(
  viewHeight: number,
  wheelDeltaY: number,
  config: Pick<IsoCameraConfig, "minViewHeight" | "maxViewHeight">,
): number {
  requireFinite(viewHeight, "viewHeight");
  requireFinite(wheelDeltaY, "wheelDeltaY");
  const factor = wheelDeltaY > 0 ? 1.1 : wheelDeltaY < 0 ? 1 / 1.1 : 1;
  return Math.min(
    Math.max(viewHeight * factor, config.minViewHeight),
    config.maxViewHeight,
  );
}
