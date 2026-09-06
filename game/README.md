# Warewolf AI Studio — Godot client

**Engine:** Godot **4.7.2** (ADR 008)  
**Slice:** P1 loft walk-to-desk

**Adding art:** read the [Godot asset pipeline](../docs/game-asset-pipeline.md)
and [runtime manifest](assets/MANIFEST.md). Rebuild exported art with
`bash game/tools/export_art.sh` (set `GODOT_BIN` if Godot is not on PATH).

## Run (exact steps)

1. Install **Godot 4.7.2** stable (standard build, not .NET / Mono):
   https://godotengine.org/download
2. In the Project Manager, click **Import**.
3. Choose this file — not the repo root:

   `game/project.godot`

4. Open the project. First open reimports textures (a few seconds).
5. Press Play (`F5`). Window is 1280×720.

### Do not

- Open / import the **repo root** (`ware-wolf/`). There is no
  `project.godot` there — Godot will fail or hang looking for one.
- Use Godot 4.3 / 4.4 / 4.5 / 4.6. This project tags `4.7` features.
- Use the **.NET** Godot build unless you know you need C# (we don’t).

## If import / open fails

| Symptom | Fix |
| --- | --- |
| “No project.godot” / import does nothing | Select `game/project.godot`, not the parent folder |
| Version / features warning | Install Godot **4.7.2** and open with that binary |
| Pink textures / missing assets | Delete `game/.godot/` (local cache), reopen project |
| Scripts show errors on first open | Wait for import to finish; then **Project → Reload Current Project** |
| Still broken after that | From `game/`: run headless smoke (below) and paste the log |

### Headless smoke

```bash
godot --headless --path game -s res://scripts/smoke_check.gd
godot --headless --path game -s res://scripts/animation_check.gd
```

Expect `SMOKE_OK` and `ANIMATION_OK`.

## P1 proof

- Starter loft floor from tile PNGs
- Click or tap a floor cell to walk (shared input path); Nosh uses an
  idle/run sprite sheet with mirrored left-facing art
- Click/tap the desk (or walk beside it) to open **desk desktop OS**
  (wallpaper, Teams/Directory icons, taskbar, loft bucks chrome)
- Esc or Leave desk to return to the loft
- Nearest-neighbor filtering; y-sorted actors

## Layout

| Path | Role |
| --- | --- |
| `assets/` | Art pack from Maeve’s P1 brief |
| `data/starter_loft.json` | Trimmed 10×8 loft (desk + chair) |
| `scenes/main.tscn` | Main scene |
| `scripts/` | Iso math, loft world, player, HUD |

No save, economy, or task provider yet (P2+).
