// Browser entry point: the M1-T01 graybox scene with the fixed iso camera.
import { Engine } from "@babylonjs/core/Engines/engine";
import { Color4 } from "@babylonjs/core/Maths/math.color";
import { Scene } from "@babylonjs/core/scene";
import { applyViewHeight, createIsoCamera } from "./camera/iso-camera.js";
import { DEFAULT_ISO_CAMERA, zoomStep } from "./camera/iso-camera-math.js";
import { buildTestZone } from "./scene/test-zone.js";

function start(canvas: HTMLCanvasElement): () => void {
  const engine = new Engine(canvas, true);
  const scene = new Scene(engine);
  scene.clearColor = new Color4(0.07, 0.07, 0.09, 1);

  const config = { ...DEFAULT_ISO_CAMERA };
  const camera = createIsoCamera(scene, config);
  const zone = buildTestZone(scene);

  const refresh = () =>
    applyViewHeight(camera, config.viewHeight, engine.getAspectRatio(camera));
  const onResize = () => {
    engine.resize();
    refresh();
  };
  const onWheel = (event: WheelEvent) => {
    event.preventDefault();
    config.viewHeight = zoomStep(config.viewHeight, event.deltaY, config);
    refresh();
  };
  window.addEventListener("resize", onResize);
  canvas.addEventListener("wheel", onWheel, { passive: false });

  refresh();
  engine.runRenderLoop(() => scene.render());

  return () => {
    window.removeEventListener("resize", onResize);
    canvas.removeEventListener("wheel", onWheel);
    zone.dispose();
    scene.dispose();
    engine.dispose();
  };
}

const canvas = document.querySelector<HTMLCanvasElement>("#scene");
if (!canvas) throw new Error('Missing <canvas id="scene"> in index.html');
const stop = start(canvas);
import.meta.hot?.dispose(stop);
