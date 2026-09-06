# Meeting — Virtual office Phase 6 loft upgrades

**Date:** 2026-09-06  
**Present:** Fabrizio (coord), Dex (build)  
**Depends on:** Phase 5 merged (#13)

## Shipped

Spend company bucks on loft upgrades:

- `office/data/upgrades.json` catalog (plants, chairs, neon)
- Purchase + `ownedUpgradeIds` persist with economy `localStorage`
- **Loft** desktop shop app (buy / installed / need more bucks)
- Loft canvas reflects owned upgrades immediately
- Toast on install; balance HUD updates live

## How to view

```bash
cd office && python3 -m http.server 8765
```

Earn bucks via Goals, then open Loft and Buy an upgrade.
Leave the desk to see plants / chairs / neon on the floor.

## Next

Phase 7: wire real agent chat into Teams (still stubbed).
