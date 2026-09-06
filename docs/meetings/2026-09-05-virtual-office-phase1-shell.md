# Meeting — Virtual office Phase 1 shell

**Date:** 2026-09-05  
**Present:** Fabrizio (coord), Dex (build)  
**Depends on:** Phase 0 merged (#8)

## Shipped

Dead office shell under `office/`:

- `index.html` + art-bible CSS tokens
- Isometric floor renderer (carpet field, wood border)
- Desk + bubbler placeholders with staff nameplates
- Layout data: `data/starter-office.json`
- Staff contract remains `data/staff.json`

No walking yet — Phase 2.

## How to view

```bash
cd office && python3 -m http.server 8765
```

## Next

Phase 2: Nosh sprite + click-to-walk + walkability.
