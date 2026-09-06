# Meeting — Virtual office Phase 4 desk desktop OS

**Date:** 2026-09-06  
**Present:** Fabrizio (coord), Dex (build), Maeve (feel)  
**Depends on:** Phase 3 merged (#11)

## Shipped

Nosh’s desk PC opens a fake desktop:

- Bone wallpaper + ink taskbar with amber accents
- Desktop icons: **Teams** and **Directory** only
- Window chrome with open / close / Escape
- Teams: roster + presence dots + stub chat compose
- Directory: staff list + profile from `staff.json`
- Presence: NPCs Available at desks; Nosh Available while at PC
- Leave desk / Escape returns to the loft

## How to view

```bash
cd office && python3 -m http.server 8765
```

Walk next to Nosh’s desk → Press E → open Teams / Directory.

## Next

Phase 5: company bucks + goals, or real agent chat behind Teams.
