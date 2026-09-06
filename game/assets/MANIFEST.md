# P1 Godot art pack — manifest

**Status:** Accepted for P1 vertical slice  
**Owner:** Maeve Quinn  
**Date:** 2026-09-06

Hard 1× sprites for the Godot client. Soft AI atlases under
`office/assets/` stay in the parked web loft and are **not** this
hero set.

## Provenance

| Asset | Guide / source | Notes |
| --- | --- | --- |
| Floor tiles | `office/assets/reference/sheets/tile-atlas-sheet.png` | Sheet is a labeled 1280×720 guide. Runtime diamonds authored at **64×32** with art-direction palette (`carpet` / `clay` / `ink`). |
| Desk + chair | `office/assets/reference/sheets/furniture-kit-sheet.png` | Pipeline names `desk-basic`, `chair-basic` at native px. |
| Nosh | `office/assets/reference/sheets/character-sprites-sheet.png` | `nosh-idle` ~48–64 px tall (file is 34×56). |

## Files

| Path | Size (px) | Draw size | Role |
| --- | --- | --- | --- |
| `tiles/floor-carpet.png` | 64×32 | 64×32 | Interior floor diamond |
| `tiles/floor-wood-border.png` | 64×32 | 64×32 | Wood border diamond |
| `furniture/desk-basic.png` | 80×70 | 80×70 (1×) | Player desk |
| `furniture/chair-basic.png` | 28×36 | 28×36 (1×) | Desk chair |
| `characters/nosh-idle.png` | 34×56 | 34×56 (1×) | Player idle |

Nearest-neighbor only. Do not upscale mush; integer zoom later is
crispness, not density.

## Layout for Dex

Trimmed starter loft: one Nosh desk + chair occupancy. Port from
`office/data/starter-office.json` ideas — do **not** live-load the
web app JSON. Interaction cell = player desk → stub “Desk” HUD.
