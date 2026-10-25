// T5 (Node part): Babylon.js 9 ES module imports, NullEngine, orthographic camera,
// and glTF loader registration.
import { Camera } from "@babylonjs/core/Cameras/camera";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { NullEngine } from "@babylonjs/core/Engines/nullEngine";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { CreatePlane } from "@babylonjs/core/Meshes/Builders/planeBuilder";
import { Scene } from "@babylonjs/core/scene";
import { expect, it } from "vitest";

it("T5 renders an orthographic isometric scene on NullEngine", () => {
  const engine = new NullEngine();
  const scene = new Scene(engine);
  const cam = new FreeCamera("iso", new Vector3(10, 10, -10), scene);
  cam.mode = Camera.ORTHOGRAPHIC_CAMERA;
  cam.setTarget(Vector3.Zero());
  const halfH = 8;
  cam.orthoTop = halfH;
  cam.orthoBottom = -halfH;
  cam.orthoLeft = (-halfH * 16) / 9;
  cam.orthoRight = (halfH * 16) / 9;
  CreatePlane("quad", { width: 1, height: 2 }, scene);
  scene.render();
  expect(scene.meshes.length).toBe(1);
  expect(scene.activeCamera?.mode).toBe(Camera.ORTHOGRAPHIC_CAMERA);
  engine.dispose();
});

it("T5 registers the glTF loader for .glb", async () => {
  await import("@babylonjs/loaders/glTF");
  const loader = await import("@babylonjs/core/Loading/sceneLoader");
  expect(loader.SceneLoader.IsPluginForExtensionAvailable(".glb")).toBe(true);
});
