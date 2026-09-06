# Reed review — office JS clarity pass 2

**Date:** 2026-09-06  
**Reviewer:** Reed Mallory  
**Scope:** `cursor/office-js-clarity-3431` after Dex handback  
**Prior:** `2026-09-06-reed-office-js-pre-ui-review.md` (B− / blockers)

## Verdict

**Green light.**  
**Grade: B+**

Dex cleared the pre–UI blockers. Maeve can paint on named desk geometry
now. Soft leftovers below are nits, not gates.

## Blocker recap

| Prior blocker | Status |
| --- | --- |
| Split `renderLoftApp` / loft cards | **Done** — `desktopLoftApp.js` |
| Shrink `renderTeamsApp` | **Done** — thread/roster helpers |
| Keep `desktopOs.js` under ~800 | **Done** — ~522 lines |
| Carve `startOfficeShell` | **Done** — ~132 lines + named wires |
| Name desk / NPC / audio literals | **Done** — kit + blip + move constants |
| Name walk-bob rate | **Done** — `PLAYER_WALK_BOB_RATE` |

## Checklist

| Standard | Call |
| --- | --- |
| Names read like the business | Pass |
| Comments explain *why* | Pass |
| Function fits one screen | Soft — see nits |
| Lines ≤ 80 | Pass |
| Whitespace groups steps | Pass |
| Nesting flattened | Pass |
| File ≲ 800 lines | Pass (`drawOffice.js` ~969 is geometry-heavy; ok for art base) |
| No mystery numbers/strings | Pass on kit / timing Maeve will touch |
| Dense expressions named | Pass |

## Soft nits (non-blocking for Maeve)

1. **`updateNpcs` (~130 lines)** — still one state machine. Readable;
   split later if visit logic grows (`tickBubblerDwell`, etc.).
2. **`renderTeamsApp` (~116 lines)** — under the old pain threshold;
   further split only if Teams UI expands.
3. **`drawWorldEntities` (~87 lines)** — draw orchestration; fine while
   Maeve is reshaping primitives underneath.
4. **`occupancy[person.id] === false`** — still a tiny readability bump
   (`personIsAwayFromDesk`); not art-blocking.

## Green light for Maeve

Named kit constants (`DESK_TOP_*`, `MONITOR_*`, lamp fills, Nosh accent)
are the contract. Desk kit + silhouettes should extend those names, not
reintroduce bare pixel magic in draw helpers.

Ship it.

— Reed
