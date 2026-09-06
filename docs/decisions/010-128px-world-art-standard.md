# ADR 010 — 128px world art standard

**Status:** Locked  
**Date:** 2026-09-06  
**Deciders:** Nosh (call)

## Decision

1. **World art authoring size is 128.** Floor diamonds are
   **128×64**. Furniture and loft props are **128×128** square
   canvases (subject sits on the diamond footprint).
2. **Runtime matches authoring.** Godot loads these PNGs 1:1 with
   nearest filtering. `IsoMath` tile size is **128×64**
   (`TILE_WIDTH` / `TILE_HEIGHT`).
3. **Viewport fit stays 1280×720.** The starter loft remains fully
   visible without pan via camera zoom (~0.5), not by downscaling
   art.
4. **Characters follow next.** Current Nosh motion (~48×96 cells)
   is temporarily scaled ×2 in the loft so silhouettes match the
   new tile. A later art pass regenerates crew at the 128 world
   scale; that is not this ADR.
5. **UI chrome is separate.** Desktop OS atlases keep their own
   cell sizes; this ADR does not resize HUD art.

## Why

Nosh preferred 128 as the loft standard over the prior mixed
64/128 PixelLab kit. Art direction already allowed 2× authoring
for crispness; locking 128 removes ambiguity and matches what we
want to see on screen.

## Consequences

- Update [`../office/art-direction.md`](../office/art-direction.md)
  and [`../game-asset-pipeline.md`](../game-asset-pipeline.md).
- Regenerate loft tiles and furniture at 128; retire 64×64 prop
  canvases for new world art.
- Do not invent a second “logical 64 / display 128” pipeline —
  one size in files, one size in `IsoMath`.
