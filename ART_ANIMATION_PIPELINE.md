# Art, Character and Animation Pipeline

## 1. Visual Direction
Thai occult dark fantasy with readable silhouettes and a consistent palette. Use Thai architectural and material references thoughtfully: timber, old plaster, weathered stone, brass, cloth, incense smoke, sacred geometric motifs and fictionalized yantra-inspired effects. Keep UI legible and avoid visual effects that hide attack telegraphs.

## 2. Character Pipeline
1. Define a character scale standard, foot pivot, sprite bounds, facing convention and export format.
2. Create a neutral reference sheet and approved palette.
3. Choose runtime: evaluate Spine or another skeletal/sprite runtime against licensing, browser performance, authoring workflow and integration support.
4. Build required states: idle, walk, run, basic attack, skill cast, dodge, hit, death, interact.
5. Establish 4-direction prototype first; expand to 8-direction only if art/time budget supports it.
6. Use animation events for effects, but server combat timing remains authoritative.
7. Create fallback animation when an asset/state is missing.

## 3. 2D-on-3D Rules
- Use a consistent ground anchor at the feet.
- Align sprite scale with world units.
- Test occlusion behind walls, trees, roof edges and other characters.
- Decide which objects can occlude characters and which should fade/cut away.
- Ensure sprite lighting/shading visually matches the 3D environment.
- Use controlled shadow blobs or projected shadows if full 2D lighting is unsuitable.
- Validate camera angle and zoom with characters, not empty terrain alone.

## 4. Environment Pipeline
- Model low/medium-detail assets in Blender with consistent units and pivots.
- Define collision proxies separate from decorative geometry.
- Keep walkable surfaces and navigation data explicit.
- Use LOD/instancing where supported and needed by profiling.
- Pack textures and compress assets for web delivery.
- Use zone-based asset loading and disposal.
- Maintain source files separately from runtime exports.

## 5. VFX System
VFX categories:
- cast anticipation
- projectile/trail
- impact
- area telegraph
- area resolution
- status aura
- cleanse/ward
- death/banish
Use shared reusable templates, pooled particles and strict lifetime limits. Every hostile area VFX must be readable before damage resolves.

## 6. Asset Manifest
Every asset record should include:
- stable id
- source path
- runtime path
- type
- dimensions/format
- pivot/scale convention
- license/provenance
- owning feature
- loading group/zone
- fallback asset
Never use assets without known usage rights for distribution.

## 7. Performance Checks
- Test on target browsers and representative hardware.
- Profile draw calls, texture memory, particle count, animation update cost and scene load.
- Do not optimize based only on subjective FPS; record repeatable test scenes and conditions.
