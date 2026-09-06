# Fabrizio — office sprite crispness plan

**Date:** 2026-09-06  
**Owner:** Fabrizio Cortell (plan)  
**Trigger:** Sprites feel jagged/blurry; question of bringing in a
2D pixel engine

## Idea in plain language

Make loft sprites look like intentional pixel art instead of soft,
blocky blobs — without rewriting the renderer as a game engine.

## Verdict

**Reshape it.** Do **not** bring in Pixi, Phaser, or any 2D engine.
Fix the crispness contract first (integer scale + true loft-pixel
sources). Engine is the wrong medicine for this symptom.

## What we found

Runtime is already custom canvas 2D under ADR 001 (vanilla static
HTML, no bundler):

- `sprites.js` draws with `imageSmoothingEnabled = false`
- `drawOffice.js` renders into a low-res scene buffer, then upscales
  with smoothing off
- `#office-canvas` already has `image-rendering: pixelated`
- Source crops are large soft atlases (e.g. idle figures ~200×490)
  drawn into tiny dest sizes (characters **26×60**, desk **98×94**)
- Art docs already admit sources are “not guaranteed pixel-perfect”
  and Maeve flagged GenerateImage soft edges
- `buildRoomView` uses a **continuous** fit scale (0.1–2), so buffer
  upscale is often a fractional factor → uneven NN pixels
- Floor/walls are still vector polygons (AA strokes) mixed with
  bitmap sprites

## Diagnosis

Jagged + blurry at once is expected from this stack: soft AI edges
downscaled with nearest-neighbor, then blown up by a non-integer
room scale. CSS/canvas nearest-neighbor knobs are mostly already on.
A new engine would not fix soft art or fractional zoom.

## Ranked bets

1. **Crisp scale lock** (smallest honest) — snap room scale to
   integer steps (1× / 2×); keep NN path; Cal checks DPR/viewports
2. **True 1× loft-pixel art re-cut** — Maeve locks density; Dex
   recrops/replaces atlases to art-direction sizes (~48–64 px tall
   figures); separate PR from #1
3. **Proof character sheet only** — one crew redo after #1 if still
   muddy (validates art before full kit redo)
4. **2D engine (Pixi/Phaser)** — kill for now; fights ADR 001 and
   doesn’t address root cause

## Crew next

- **Dex** builds bet #1
- **Cal** verifies crispness at common sizes / DPR
- **Maeve** only if #1 isn’t enough (art density / re-cut)
- **Reed** only if the scale change muddies `isoMath` / draw path

## PR-sized scope (bet #1)

One concern: integer loft zoom / crisp pixel scale contract.

In: `buildRoomView` integer scale steps; buffer→canvas exact integer
multiple; smoke notes for Cal (1280×720, laptop DPR, narrow width).

Out: new engine; full art redo; floor tile bitmap conversion; walk
animation sheets.

Nosh merges. Agents do not.
