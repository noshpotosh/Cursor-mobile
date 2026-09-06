# Reed review — virtual office JS (pre–UI art pass)

**Date:** 2026-09-06  
**Reviewer:** Reed Mallory  
**Scope:** `office/js/*` as of plan-complete branch  
**Trigger:** Gate readability before Maeve’s sprite / desk-kit UI pass

## Verdict

**pass-with-nits → rewrite-for-clarity on two files**  
**Grade: B−**

Module seams are mostly English. Domain names (`companyBucks`, `atDesk`, `purchaseOffice`) earn their keep. Constants file is doing real work. Two manuscripts bury the lede: `desktopOs.js` and `main.js`’s `startOfficeShell`, plus a pixel-offset junk drawer in `drawOffice.js` that will fight Maeve’s art pass if we don’t name the kit first.

Not a Cal bug hunt. Clarity only.

## Checklist

| Standard | Call |
| --- | --- |
| Names read like the business | Mostly pass |
| Comments explain *why* | Pass (sparse — good) |
| Function fits one screen | **Fail** — see below |
| Lines ≤ 80 | Pass |
| Whitespace groups steps | Pass |
| Nesting flattened | Soft fail in loft/NPC loops |
| File ≲ 800 lines | **Borderline** — `desktopOs.js` at 799 |
| No mystery numbers/strings | **Fail** in draw/audio/NPC timing |
| Dense expressions named | Soft fail in audio ternary |

## Blockers for clarity (before UI art)

1. **`desktopOs.js` → `renderLoftApp` (~199 lines)**  
   One function builds upgrades, office catalog, and history. Same card recipe three times. Split into named cooks: `renderUpgradeCard`, `renderOfficeCard`, `renderOfficeHistory` — then `renderLoftApp` is a short recipe.

2. **`desktopOs.js` → `renderTeamsApp` (~164 lines)**  
   Roster + thread + compose + bus subscribe in one sitting. Extract thread paint and roster row builders.

3. **`desktopOs.js` file at 799 lines**  
   Hits the house ceiling. After the loft/Teams splits, consider `desktopLoft.js` / `desktopTeams.js` if it still sprawls.

4. **`main.js` → `startOfficeShell` (~267 lines)**  
   Boot, desktop wiring, click routing, key routing, frame loop — one chapter. Extract at least: `wireDesktopCallbacks`, `handleCanvasClick`, `handleOfficeKeydown`, `createRenderLoop`.

5. **`drawOffice.js` mystery pixel offsets**  
   Dozens of bare `8`, `12`, `18`, `28` in draw helpers. Fine for a throwaway placeholder — **not** fine as the base Maeve paints sprites onto. Before desk-kit art: name desk geometry (`DESK_TOP_HALF_WIDTH_PX`, `MONITOR_WIDTH_PX`, …) or one `DeskKitLayout` map. Otherwise every art tweak is archaeology.

6. **`npcs.js` → `updateNpcs` (~129 lines) + mystery pacing**  
   State machine is readable enough if split (`tickBubblerDwell`, `startBubblerVisit`, `returnNpcToDesk`). Literals `2.4`, `0.6`, `0.8` need names (`NPC_MOVE_TILES_PER_SECOND`, visit jitter factors) — founder lesson: if the reader asks “what is 0.6?”, it fails.

7. **`audio.js` nested ternary frequencies**  
   `kind === "message" ? 660 : kind === "drink" ? 420 : 520` — map `UiBlipHz.MESSAGE` etc. Same for `0.04` / `0.12` / `200`.

## Nits (non-blocking)

- `occupancy[person.id] === false` — named `personIsAwayFromDesk` would read cleaner.
- Loft shop button labels `"Need more bucks"` / `"Installed"` are fine as UI copy; if reused, lift to constants.
- `player.walkBobPhase += deltaSeconds * 10` — name the `10`.

## What already reads well

- `economy.js` public API — goals/upgrades/offices as plain verbs
- `walkMap.js` / `pathfind.js` — short, obvious
- `constants.js` — UpgradeId / InteractKind / PresenceStatus as enum-like maps
- `interact.js` builders — one furniture kind → one target shape
- Guard-clause style in most small helpers

## Handback to Dex (before Maeve paints)

Minimum before calling the JS “clean enough for art”:

1. Split `renderLoftApp` + shrink `renderTeamsApp`
2. Carve `startOfficeShell` into named steps
3. Name desk/NPC/audio magic numbers that art or feel will touch
4. Keep `desktopOs.js` under the 800-line wire

Then Maeve’s desk kit / silhouettes land on named geometry instead of mystery rectangles.

— Reed
