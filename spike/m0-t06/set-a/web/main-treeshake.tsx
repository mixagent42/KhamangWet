// T4/T5: React 19 overlay + Babylon.js 9 scene using per-module (tree-shakable) imports.
import { Camera } from "@babylonjs/core/Cameras/camera";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { Engine } from "@babylonjs/core/Engines/engine";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { CreatePlane } from "@babylonjs/core/Meshes/Builders/planeBuilder";
import { Scene } from "@babylonjs/core/scene";
import { StrictMode, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

function App() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const engine = new Engine(canvas, true);
    const scene = new Scene(engine);
    const cam = new FreeCamera("iso", new Vector3(10, 10, -10), scene);
    cam.mode = Camera.ORTHOGRAPHIC_CAMERA;
    cam.setTarget(Vector3.Zero());
    new HemisphericLight("sky", new Vector3(0, 1, 0), scene);
    CreatePlane("quad", { width: 1, height: 2 }, scene);
    engine.runRenderLoop(() => scene.render());
    return () => engine.dispose();
  }, []);
  return <canvas ref={ref} width={640} height={360} />;
}

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
