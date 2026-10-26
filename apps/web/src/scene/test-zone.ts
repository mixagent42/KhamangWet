// Graybox test zone for M1-T01: a 20 × 20 m ground and the three occluder
// types the depth-sorting spike needs (wall, tree, eave). Sizes are metres.
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder";
import { CreateCylinder } from "@babylonjs/core/Meshes/Builders/cylinderBuilder";
import { CreateGround } from "@babylonjs/core/Meshes/Builders/groundBuilder";
import { CreateSphere } from "@babylonjs/core/Meshes/Builders/sphereBuilder";
import type { Mesh } from "@babylonjs/core/Meshes/mesh";
import type { Scene } from "@babylonjs/core/scene";

export interface TestZone {
  dispose(): void;
}

export function buildTestZone(scene: Scene): TestZone {
  const meshes: Mesh[] = [];
  const materials: StandardMaterial[] = [];
  const material = (name: string, color: Color3) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = color;
    m.specularColor = Color3.Black();
    materials.push(m);
    return m;
  };
  const add = <T extends Mesh>(mesh: T, mat: StandardMaterial): T => {
    mesh.material = mat;
    meshes.push(mesh);
    return mesh;
  };

  const groundMat = material("ground", new Color3(0.32, 0.36, 0.3));
  const stoneMat = material("stone", new Color3(0.55, 0.53, 0.5));
  const woodMat = material("wood", new Color3(0.4, 0.28, 0.18));
  const leafMat = material("leaf", new Color3(0.2, 0.38, 0.22));
  const roofMat = material("roof", new Color3(0.45, 0.16, 0.12));

  add(CreateGround("ground", { width: 20, height: 20 }, scene), groundMat);

  const wall = add(
    CreateBox("occluder-wall", { width: 6, height: 2.5, depth: 0.3 }, scene),
    stoneMat,
  );
  wall.position = new Vector3(0, 1.25, -3);

  const trunk = add(
    CreateCylinder("occluder-tree-trunk", { height: 2, diameter: 0.4 }, scene),
    woodMat,
  );
  trunk.position = new Vector3(4, 1, 2);
  const canopy = add(
    CreateSphere("occluder-tree-canopy", { diameter: 2.4 }, scene),
    leafMat,
  );
  canopy.position = new Vector3(4, 2.8, 2);

  for (const [i, x] of [-5.5, -2.5].entries()) {
    const post = add(
      CreateCylinder(
        `occluder-eave-post-${i}`,
        { height: 2.4, diameter: 0.25 },
        scene,
      ),
      woodMat,
    );
    post.position = new Vector3(x, 1.2, 3);
  }
  const roof = add(
    CreateBox(
      "occluder-eave-roof",
      { width: 4.4, height: 0.25, depth: 2.6 },
      scene,
    ),
    roofMat,
  );
  roof.position = new Vector3(-4, 2.5, 3.4);

  const sky = new HemisphericLight("sky", new Vector3(0, 1, 0), scene);
  sky.intensity = 0.6;
  const sun = new DirectionalLight("sun", new Vector3(-0.5, -1, 0.3), scene);
  sun.intensity = 0.7;

  return {
    dispose() {
      for (const mesh of meshes) mesh.dispose();
      for (const m of materials) m.dispose();
      sky.dispose();
      sun.dispose();
    },
  };
}
