# Dex — office integer loft zoom (bet #1)

**Date:** 2026-09-06  
**Owner:** Dex Harlan (build)  
**Plan:** `2026-09-06-office-sprite-crispness-plan.md`  
**Branch:** `cursor/office-integer-loft-zoom-0ece`

## What changed

Snapped loft room scale to integer zoom so the scene buffer
upscales to the canvas by an exact nearest-neighbor multiple.

- `fitLoftZoom` / `buildRoomView` in `office/js/isoMath.js`
- Named blit sizes in `office/js/drawOffice.js` (still
  `imageSmoothingEnabled = false`)
- Tests assert integer scale + HUD gutters when fit ≥ 1×

## Scale contract

| Fit | Zoom |
| --- | --- |
| ≥ 1 | `floor(fit)` capped at 2× |
| < 1 | stay at **1×** (letterbox/clip, no fractional shrink) |

Origins snap to whole buffer pixels before upscale.

## Common viewports (both layouts)

| Viewport | starter | pack |
| --- | --- | --- |
| 1280×720 | 1× | 1× |
| 1920×1080 | 2× | 2× |
| 390×844 | 1× (overflow) | 1× (overflow) |
| 720×480 | 1× (tight/overflow) | 1× (overflow) |

Tiny widths keep crisp 1× pixels; HUD margin asserts skip when
continuous fit is below 1.

## Out of scope (still)

Art re-cut, engines, floor bitmaps, walk sheets.

## Follow-ups

- **Cal:** visual crispness at those sizes + laptop DPR
- **Maeve:** only if soft atlas edges still muddy after #1
- **Reed:** readability pass on `isoMath` / draw path if needed
