# Maeve — P1 Godot loft vertical slice brief

**Date:** 2026-09-06  
**Owner:** Maeve Quinn (product / design)  
**Branch:** `cursor/p1-loft-slice-art-0ece`  
**Contract:** [ADR 008](../decisions/008-ai-studio-product-contract.md)  
**Density call:** [2026-09-06-maeve-loft-pixel-density.md](2026-09-06-maeve-loft-pixel-density.md)

## User job

Stand in one cozy loft at 1280×720, walk with click/tap, and use
**one desk**. Feel chunky pixel grammar — not soft AI mush, not a
menu tour.

## Slice locks

| Lock | Choice |
| --- | --- |
| Loft | Starter only (10×8) — not pack loft |
| Player | Nosh (internal demo cast) |
| Furniture | One desk + one chair |
| Interaction | **Use desk** → stub “Desk” panel |
| Art | Desk/chair from loft furniture atlases (`desk-crt`, `loft-props`); hard 1× Nosh + authored floor tiles |

## Success moment

Room reads as pixels. Path to the desk is obvious. Opening the
desk panel is the only management chrome — no deskOS, no bubbler
side quest, no hire/fire.

## Art pack

See [`game/assets/MANIFEST.md`](../../game/assets/MANIFEST.md).

**Furniture:** Nosh locked P1 on the parked loft’s atlases —
`office/assets/furniture/desk-crt.png` and `loft-props.png`
(copied into `game/assets/furniture/`). Desk + chair crops match
`office/js/sprites.js`. This is deliberate parity with the living
web loft, not the hard 1× `desk-basic` / `chair-basic` pipeline
cuts.

**Floor:** authored 64×32 carpet + wood-border diamonds (no tile
folder on `main` yet).

**Player:** hard 1× `nosh-idle` for now.

Density note: soft furniture atlases drawn small still fail the
“reads as pixels like deskOS” bar. P1 ships them anyway per Nosh;
a later hard cut can replace without changing Dex’s crop API.

## Non-goals (Dex: do not build)

- Other crew, pack loft, portraits, upgrade overlays
- deskOS / SVG desktop migration
- Management loop, economy, save (P2)
- Reopening web `office/` features
- Hard 1× furniture pipeline cuts (`desk-basic`, etc.) — deferred;
  P1 uses `desk-crt` / `loft-props` per Nosh

## Handoff to Dex (PR B)

Godot 4.7.2 project in `game/`, consume this pack, walk-to-desk
proof. No `GameState` / save / task provider yet.
