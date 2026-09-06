# Meeting — Virtual office Phase 2 click-to-walk

**Date:** 2026-09-06  
**Present:** Fabrizio (coord), Dex (build)  
**Depends on:** Phase 1 merged (#9)

## Shipped

Nosh can walk the starter loft:

- Walk map from border walls + `blocksWalk` furniture
- Screen↔grid pick + cardinal BFS pathfinding
- Amber-jacket placeholder avatar (depth-sorted with desks)
- Click carpet → path highlight → walk with light bob
- Spawn on a walkable tile beside Nosh’s desk

## How to view

```bash
cd office && python3 -m http.server 8765
```

Open http://127.0.0.1:8765 and click open floor tiles.

## Next

Phase 3: staff NPCs at desks + talk / bubbler interact prompts.
