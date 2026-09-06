# Meeting — Virtual office Phase 3 NPCs + interact

**Date:** 2026-09-06  
**Present:** Fabrizio (coord), Dex (build)  
**Depends on:** Phase 2 merged (#10)

## Shipped

Staff inhabit the starter loft:

- Non-player NPCs seated at desks (distinct jacket colors)
- Proximity prompts when Nosh stands next to a desk or bubbler
- Press **E** to talk (stub line) or drink from the bubbler
- Toast feedback; prompt clears when you walk away

## How to view

```bash
cd office && python3 -m http.server 8765
```

Open http://127.0.0.1:8765 — walk beside a desk or the bubbler, press E.

## Next

Phase 4: desk PC → fake desktop OS (Teams + Employee Directory stubs).
