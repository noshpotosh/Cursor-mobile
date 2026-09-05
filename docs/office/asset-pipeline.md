# Virtual Office — Asset pipeline

**Status:** Phase 0 convention lock  
**Date:** 2026-09-05

## Folders

```
office/assets/
  reference/     # mocks, moodboards (not loaded by the game)
  tiles/         # floor, walls
  furniture/     # desks, chairs, bubbler, upgrades
  characters/    # Nosh + staff sprites / portraits
  ui/            # desktop icons, window chrome if raster
  audio/         # later
```

## Naming

Use kebab-case. Include role in the name.

Examples:

- `tiles/floor-carpet.png`
- `furniture/desk-basic.png`
- `furniture/bubbler.png`
- `characters/nosh-idle.png`
- `characters/maeve-portrait.png`
- `ui/icon-teams.png`
- `ui/icon-directory.png`

## Grid contract

- Isometric diamond **64×32** logical tile
- Export sprites with transparent backgrounds (PNG)
- Keep a 1px ink outline where it helps silhouette
- Prefer atlases later; individual PNGs are OK for Phase 1–2

## UI text

Teams + Directory body text should be **HTML/CSS**, not baked into pixel bitmaps — readability wins (house principle #1).

## Reference vs runtime

Files in `reference/` are for humans (art lock). Runtime code must not depend on them.
