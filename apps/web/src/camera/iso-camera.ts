// Fixed orthographic isometric camera (DEC-027: the camera never rotates).
// TargetCamera has no input handlers, so players cannot orbit it.
import { Camera } from "@babylonjs/core/Cameras/camera";
import { TargetCamera } from "@babylonjs/core/Cameras/targetCamera";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import type { Scene } from "@babylonjs/core/scene";
import {
  cameraOffset,
  orthoBounds,
  type IsoCameraConfig,
} from "./iso-camera-math.js";

const CAMERA_DISTANCE = 60;

export function createIsoCamera(
  scene: Scene,
  config: IsoCameraConfig,
  target: Vector3 = Vector3.Zero(),
): TargetCamera {
  const offset = cameraOffset(config.pitchDeg, config.yawDeg, CAMERA_DISTANCE);
  const camera = new TargetCamera(
    "iso-camera",
    new Vector3(target.x + offset.x, target.y + offset.y, target.z + offset.z),
    scene,
  );
  camera.mode = Camera.ORTHOGRAPHIC_CAMERA;
  camera.minZ = 0.1;
  camera.maxZ = CAMERA_DISTANCE * 3;
  camera.setTarget(target);
  return camera;
}

export function applyViewHeight(
  camera: TargetCamera,
  viewHeight: number,
  aspect: number,
): void {
  const bounds = orthoBounds(viewHeight, aspect);
  camera.orthoTop = bounds.top;
  camera.orthoBottom = bounds.bottom;
  camera.orthoLeft = bounds.left;
  camera.orthoRight = bounds.right;
}
