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
| Art | Hard 1× pack under `game/assets/` |

## Success moment

Room reads as pixels. Path to the desk is obvious. Opening the
desk panel is the only management chrome — no deskOS, no bubbler
side quest, no hire/fire.

## Art pack

See [`game/assets/MANIFEST.md`](../../game/assets/MANIFEST.md).

Hero sources were the labeled loft-scale sheets under
`office/assets/reference/sheets/`. Character + furniture PNGs
match the sheet pipeline names at native pixel size. Floor
diamonds are authored 64×32 tiles in the art-direction palette
(sheet guides are labeled composites, not croppable atlases).

## Non-goals (Dex: do not build)

- Other crew, pack loft, portraits, upgrade overlays
- deskOS / SVG desktop migration
- Management loop, economy, save (P2)
- Soft AI atlases as Godot hero art
- Reopening web `office/` features

## Handoff to Dex (PR B)

Godot 4.7.2 project in `game/`, consume this pack, walk-to-desk
proof. No `GameState` / save / task provider yet.
