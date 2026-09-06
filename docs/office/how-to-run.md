# Virtual Office — How to run

**On hold** (2026-09-06): active product priority moved to the honest
AI studio tycoon thesis — see
[`../decisions/007-honest-ai-studio-tycoon.md`](../decisions/007-honest-ai-studio-tycoon.md).
Existing loft still runs; do not treat this as the current build
target.

Serve the `office/` folder over HTTP. Browsers block ES module `fetch` from `file://`.

```bash
cd office
python3 -m http.server 8765
```

Open http://127.0.0.1:8765.

## What you should see

- Isometric starter loft with six desks, bubbler, coffee, whiteboard
- Nosh (amber jacket) walks on click
- Staff idle at desks and occasionally visit the bubbler
- Clicking a staff desk walks Nosh over, then opens talk toast
- Nosh’s PC opens the fake desktop: Teams, Directory, Goals, Loft
- Teams presence follows desk occupancy (Away while at the bubbler)
- Loft shop sells upgrades and larger offices; history is listed in Loft

## Accessibility

- Desktop windows are keyboard-closable with Escape
- Mute button / `M` toggles UI blips
- `prefers-reduced-motion: reduce` snaps travel and camera
