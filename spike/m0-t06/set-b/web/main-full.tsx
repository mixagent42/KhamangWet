// T5 comparison: same scene, but importing the whole @babylonjs/core barrel.
import * as BABYLON from "@babylonjs/core";
import { StrictMode, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

function App() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);
    const cam = new BABYLON.FreeCamera("iso", new BABYLON.Vector3(10, 10, -10), scene);
    cam.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
    cam.setTarget(BABYLON.Vector3.Zero());
    new BABYLON.HemisphericLight("sky", new BABYLON.Vector3(0, 1, 0), scene);
    BABYLON.CreatePlane("quad", { width: 1, height: 2 }, scene);
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
