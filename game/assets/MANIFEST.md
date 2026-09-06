# P1 Godot art pack — manifest

**Status:** Accepted for P1 vertical slice  
**Owner:** Maeve Quinn (brief); furniture atlas call by Nosh  
**Date:** 2026-09-06

## Provenance

| Asset | Source | Notes |
| --- | --- | --- |
| Floor tiles | Authored 64×32 diamonds | Art-direction palette (`carpet` / `clay` / `ink`). No `office/assets/tiles/` on main yet. |
| Desk + chair | `office/assets/furniture/desk-crt.png`, `loft-props.png` | Same atlases the parked web loft loads. Nosh chose these over hard 1× pipeline cuts for P1. |
| Nosh | Hard 1× `nosh-idle.png` | 34×56 native; keep until a crew atlas call says otherwise. |

Copies live under `game/assets/` so Godot does not depend on the web loft path at runtime. Crop rects match [`office/js/sprites.js`](../../office/js/sprites.js).

## Files

| Path | Atlas / size | Crop `[x,y,w,h]` | Draw size (web loft) | Role |
| --- | --- | --- | --- | --- |
| `tiles/floor-carpet.png` | 64×32 | full | 64×32 | Interior floor |
| `tiles/floor-wood-border.png` | 64×32 | full | 64×32 | Wood border |
| `furniture/desk-crt.png` | 1254×1254 | desk: `[140, 167, 983, 934]` | 98×94 | Player desk |
| `furniture/loft-props.png` | 1536×1024 | chair: `[138, 570, 291, 415]` | 31×43 | Desk chair |
| `characters/nosh-idle.png` | 34×56 | full | 34×56 | Player idle |

Nearest-neighbor sampling. Soft atlas → small draw size is known density debt (Maeve’s pixel-density call); P1 uses these because Nosh wants parity with the living loft furniture atlases.

## Layout for Dex

Trimmed starter loft: one Nosh desk + chair. Port occupancy ideas from
`office/data/starter-office.json` — do **not** live-load the web app.
Interaction cell = player desk → stub “Desk” HUD.
