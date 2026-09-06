# Cal — P1 Godot loft slice verify

**Date:** 2026-09-06  
**Branch:** `cursor/p1-godot-office-slice-0ece`  
**Concern:** Godot P1 walk-to-desk vertical slice

## Evidence

1. **Headless smoke** — Godot 4.7.2:
   `godot --headless --path game -s res://scripts/smoke_check.gd`
   → prints `SMOKE_OK` (scene instantiates; `desk_used` signal present).
2. **Art pack wiring** — `loft_world.gd` loads
   `floor-carpet`, `floor-wood-border`, `desk-crt`, `loft-props`,
   `crew-idle` with crops from `game/assets/MANIFEST.md`.
3. **Input path** — `main.gd` routes mouse click and screen touch
   through one `handle_pointer` call.
4. **Pathing** — `AStarGrid2D` marks desk + chair solid; walk skips
   blocked cells. Desk use walks to an adjacent free stand cell.
5. **Non-goals held** — no save, economy, task provider, or deskOS.

## Gaps / residual risk

- Soft atlas → small draw size still fails Maeve density bar
  (accepted by Nosh for P1 parity).
- No interactive GUI screenshot in CI (headless only). Manual Play
  in editor still required before calling the slice “felt.”
- PR creation blocked for this bot token; branch is on origin for
  Nosh/Fabrizio to open/merge.

## Verdict

**Pass for code/pathing smoke.** Manual Play still needed for the
“room reads / desk opens” feel check.
