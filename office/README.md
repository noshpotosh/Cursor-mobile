# Warewolf Virtual Office

Internal isometric pixel office for Warewolf.

## Status

Plan complete through Phase 6 polish:

- Phase 0 — art + product lock
- Phase 1 — static shell + isometric loft
- Phase 2 — Nosh click-to-walk + camera follow
- Phase 3 — staff NPCs, walk-then-talk, living bubbler
- Phase 4 — desk desktop OS (Teams, Directory, Goals, Loft)
- Phase 5 — company bucks, goals, upgrades, office catalog + history
- Phase 6 — mute / reduced-motion / docs how-to-run

## Run

Serve this folder over HTTP (ES modules + `fetch` need it):

```bash
cd office
python3 -m http.server 8765
```

Open [http://127.0.0.1:8765](http://127.0.0.1:8765).

### Controls

- Click floor to walk
- Click a desk / prop to walk over, then interact
- `E` — interact when prompted
- `M` — mute / unmute UI blips
- Desk PC → desktop apps (Teams, Directory, Goals, Loft)
- `Esc` — close window / leave desk

`prefers-reduced-motion: reduce` snaps walks and disables soft camera follow.

## Docs

- [Product scope ADR](../docs/office/decisions/001-virtual-office-scope.md)
- [Art direction](../docs/office/art-direction.md)
- [Asset pipeline](../docs/office/asset-pipeline.md)
- [How to run](../docs/office/how-to-run.md)

## Reference mocks

- [Starter office hero](assets/reference/starter-office-hero-mock.png) (style lock; wrong cast names)
- [Starter office + real crew](assets/reference/starter-office-hero-crew-mock.png) (correct-cast lock)
- [Pack Loft hero](assets/reference/pack-office-hero-mock.png)
- [Office decor upgrades sheet](assets/reference/office-decor-upgrades-sheet.png)
- [Crew outfit lineup](assets/reference/crew-outfit-lineup-mock.png)
- [Crew portraits sheet](assets/reference/crew-portraits-sheet.png) (Directory art lock)
- [Desk desktop OS](assets/reference/desk-desktop-os-mock.png)

### Implementation cut sheets (1× loft px)

- [Tile atlas](assets/reference/sheets/tile-atlas-sheet.png)
- [Furniture kit](assets/reference/sheets/furniture-kit-sheet.png)
- [Character sprites](assets/reference/sheets/character-sprites-sheet.png)
- [Upgrade overlays](assets/reference/sheets/upgrade-overlays-sheet.png)
