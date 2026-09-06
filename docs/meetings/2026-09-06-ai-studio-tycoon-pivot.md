# Meeting — Honest AI studio tycoon pivot

**Date:** 2026-09-06  
**Who:** Nosh (founder), Fabrizio Cortell (planning / recording)  
**Topic:** Engine fit for the loft → product pivot away from virtual office

## What was said

Nosh asked whether Unity (then Godot) would be a better fit for the
Warewolf virtual office. Fabrizio said **no for this loft** — vanilla
HTML/canvas matches ADR 001; engines are the wrong weight class for an
internal iso pixel toy with HTML desk apps.

Nosh then floated a real pivot: a **mobile game** about building a
software company. Player customizes the studio, picks projects, hires
and fires, sets goals/milestones, and dispatches work. Real AI agents
would attempt the work. The player sees **state** (tests pass/fail,
rewards, failure copy) — **not** the generated source. An early beat
was “maybe the player never knows AI is involved.”

## Calls

1. **Kill stealth AI.** Ship an **honest AI studio tycoon** — hide the
   *code*, not the *nature of the labor*. Players know the floor is AI.
2. **Park the virtual office.** No new office feature work until Nosh
   reopens it after more investigation. Existing `office/` code stays;
   it is not deleted and not the vehicle for this bet.
3. **This is a new product thesis**, not a loft upgrade and not an
   engine migration of ADR 001.
4. Nosh will investigate further and return before build scope.

Locked as **ADR 007**.

## Engine note (not locked)

If this becomes a real mobile game later, Godot beats Unity for a 2D
indie studio sim — and still beats frankensteining the current loft.
No engine choice locked in this meeting.

## Open (Nosh investigating)

- Game vs Warewolf product-lab IP story (sandbox disposable vs opt-in
  real use of outstanding projects)
- Player fantasy (indie founder / CEO / other)
- Cost/latency model for real agent runs (async shifts assumed)
- Smallest web prototype before any App Store / Godot bet
