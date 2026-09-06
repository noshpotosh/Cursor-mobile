# Warewolf AI Studio — Godot client

**Engine:** Godot **4.7.2** (ADR 008)  
**Slice:** P1 loft walk-to-desk

## Run

1. Install Godot 4.7.2 stable.
2. Open `game/project.godot` (or import the `game/` folder).
3. Press Play (`F5`). Window is 1280×720.

## P1 proof

- Starter loft floor from tile PNGs
- Click or tap a floor cell to walk (shared input path)
- Click/tap the desk (or walk beside it) to open the stub **Desk** panel
- Nearest-neighbor filtering; y-sorted actors

## Layout

| Path | Role |
| --- | --- |
| `assets/` | Art pack from Maeve’s P1 brief |
| `data/starter_loft.json` | Trimmed 10×8 loft (desk + chair) |
| `scenes/main.tscn` | Main scene |
| `scripts/` | Iso math, loft world, player, HUD |

No save, economy, or task provider yet (P2+).
