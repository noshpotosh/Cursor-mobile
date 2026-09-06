# Virtual Office — Art Direction (v1)

**Owner:** Maeve Quinn  
**Status:** Draft lock for Phase 0  
**Date:** 2026-09-05

### Reference mocks (Phase 0)

| Mock | Path | Role |
| --- | --- | --- |
| Starter loft (wrong cast names) | [`starter-office-hero-mock.png`](../../office/assets/reference/starter-office-hero-mock.png) | Original kit/style lock — **Mara/Jory/etc. are wrong**; do not perpetuate those names |
| Starter loft + real pack | [`starter-office-hero-crew-mock.png`](../../office/assets/reference/starter-office-hero-crew-mock.png) | **Correct-cast lock** — Nosh, Fabrizio, Maeve, Dex, Cal, Reed at starter (~10×8) scale |
| Pack Loft | [`pack-office-hero-mock.png`](../../office/assets/reference/pack-office-hero-mock.png) | Bigger loft (~12×10 feel), same kit language + real crew |
| Decor upgrades sheet | [`office-decor-upgrades-sheet.png`](../../office/assets/reference/office-decor-upgrades-sheet.png) | Labeled before/after for catalog upgrades only (`desk-plants`, `desk-lamps`, `better-chairs`, `amber-neon`) |
| Crew outfit lineup | [`crew-outfit-lineup-mock.png`](../../office/assets/reference/crew-outfit-lineup-mock.png) | Silhouette-first outfit cues at loft-readable scale |
| Crew portraits sheet | [`crew-portraits-sheet.png`](../../office/assets/reference/crew-portraits-sheet.png) | Directory headshot lock — naming targets `characters/<id>-portrait.png` later |
| Desk desktop OS | [`desk-desktop-os-mock.png`](../../office/assets/reference/desk-desktop-os-mock.png) | Fake OS chrome lock |

Reference mocks stay under `office/assets/reference/` until playtest says the kit holds. Not runtime sprites.

## The vibe

Cozy isometric pixel office — warm, readable, a little lived-in. Not cyberpunk, not purple SaaS glow, not photoreal 3D. Think “tiny company that actually works here,” not a diorama flex.

Villain we’re defeating: sterile empty offices and unreadable clutter.

## Palette (named constants later in CSS)

| Token | Hex | Use |
| --- | --- | --- |
| `ink` | `#1A1714` | Outlines, text, taskbar |
| `bone` | `#F4EFE6` | Walls, desktop wallpaper base |
| `amber` | `#D97706` | Accents, CRT glow, Warewolf signal |
| `sage` | `#6B8F71` | Soft secondary (plants, UI success) |
| `clay` | `#C4A484` | Wood desks, trim |
| `carpet` | `#C9B8A6` | Floor field |
| `crt-green` | `#86EFAC` | Optional screen glow (sparse) |

No purple gradients. No glassmorphism. Amber is the brand spark — use it like salt.

## Camera + grid

- **Projection:** classic 2:1 isometric
- **Base tile:** 64×32 px diamond (logical); art may be drawn at 2× for crispness
- **Character height:** ~48–64 px tall so silhouettes read at room scale
- **Room fit:** entire starter office visible without pan on a 1280×720 viewport

## Floor kit

- Warm wood plank border
- Soft carpet field (not busy pattern)
- Walkable aisles between desks — pathing must stay obvious

## Desk kit (every human gets one)

Each desk includes:

1. Desk surface (clay wood)
2. Chair
3. Computer (laptop or chunky CRT — pick one kit and stay consistent for v1)
4. Nameplate space (readable at scale; can be UI overlay if pixel text fails)
5. Small personal prop slot (plant, mug, sticky notes) for upgrades later

**Nosh’s desk** is visually marked (slightly different mat/monitor sticker) so the “my PC” hotspot is obvious.

## Characters

| Person | Read cue (v1) |
| --- | --- |
| Nosh | Distinct jacket/color; player-readable at a glance |
| Fabrizio | Grounded co-founder energy |
| Maeve | Design-lead silhouette (sharp, a little glam) |
| Dex | Builder — practical |
| Cal | Verifier — sharper posture |
| Reed | Editor — calmer posture |

Keep faces simple. Silhouette > detail. Idle bob optional later.

## Living interactables (v1)

**Required:** bubbler / water cooler — Nosh can drink; NPCs sometimes walk up.

**Phase 8 loft life:** coffee station + whiteboard (E to sip / read rotating scribbles).

Later candidates: plant to water, couch.

## Desktop OS chrome

Fake OS when Nosh uses their PC:

- Bone wallpaper, subtle quiet pattern
- Ink taskbar + amber accents
- Chunky window chrome (readable titles)
- Icons at launch: **Teams**, **Directory** only
- Windows open/close/focus — one app focused at a time is fine for v1

### Teams app

- Sidebar roster with presence dots (Available / Away)
- Chat thread + compose box backed by the agent message bus
- Local persona replies now; remote Cursor provider later
- Presence driven by desk occupancy

### Employee Directory app

- Scrollable list of all staff
- Click → profile: avatar portrait, role, about, presence badge
- Grows as we hire — data-driven from `staff.json`

## Do / don’t

**Do**

- Warm, cozy, readable
- One clear composition per view
- Leave room for upgrades without redesigning the whole kit

**Don’t**

- Purple AI sludge
- Tiny unreadable pixel text for critical UI (prefer HTML overlays for Directory/Teams text)
- Clutter the hero room with vanity props

## Sign-off

Phase 0 visual lock candidate. Nosh + Fabrizio review mocks before Phase 1 renderer work.
