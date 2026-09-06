# Maeve — loft-scale pixel implementation sheets

**Date:** 2026-09-06  
**Owner:** Maeve Quinn (design)  
**Branch:** `cursor/office-pixel-impl-sheets-1f67` (off `main`; not stacked on PR #23)

## Villain

Atmospheric mocks that feel great and still don’t cut. Dex can’t
trace a mood-board hero into `furniture/desk-basic.png` without
guessing scale, silhouette, and filename.

## What shipped

Four labeled cut sheets under `office/assets/reference/sheets/`:

1. **tile-atlas-sheet** — aisle carpet, desk island, wood border,
   64×32 rulers, seam strip
2. **furniture-kit-sheet** — desk kit + bubbler/coffee/whiteboard +
   assembled row
3. **character-sprites-sheet** — six idle sprites (48–64 px) + Nosh
   walk frames; jacket colors from runtime cues
4. **upgrade-overlays-sheet** — before → overlay → after for catalog
   IDs only (`desk-plants`, `desk-lamps`, `better-chairs`, `amber-neon`)

Docs: art-direction links, asset-pipeline note that `reference/sheets/`
= cut guides (still not loaded by the game).

## Explicitly not this PR

- No runtime wiring / canvas JS
- No PNGs dropped into `tiles/`, `furniture/`, or `characters/`
- Not the atmospheric mock pack (PR #23) — separate concern

## Caveat for Dex

GenerateImage softens true 1:1 pixels (JPEG-in-PNG). Treat sheets as
the best loft-scale cut guide: labels + rulers + silhouette contracts
matter as much as the painted pixels. Cut at 1× loft px; optional 2×
art source later if we want cleaner edges.

— Maeve
