# ADR 007 — Honest AI studio tycoon (office on hold)

**Status:** Locked  
**Date:** 2026-09-06  
**Deciders:** Nosh + Fabrizio Cortell  
**Meeting:** [`../meetings/2026-09-06-ai-studio-tycoon-pivot.md`](../meetings/2026-09-06-ai-studio-tycoon-pivot.md)

## Decision

1. **Active product direction:** explore an **honest AI studio
   tycoon** — a company-builder where the player runs a software
   studio, customizes the company, chooses projects, manages staff
   (hire/fire), sets goals and milestones, and dispatches work to AI
   employees/tools that attempt real tasks.
2. **Honesty is mandatory.** Players know AI is in the loop. We do
   **not** ship a stealth-AI con. Hide generated **source** from the
   player if we want; never hide the **nature of the labor**.
3. **Player sees state, not the repo.** Outcomes surface as build /
   test health, rewards, and failure/postmortem texture — not as a
   downloadable codebase in the default fantasy (CEO, not IDE).
4. **Virtual office is on hold.** ADR 001’s loft remains a parked
   internal artifact. No new office feature work until Nosh reopens
   it. Do not delete `office/`; do not treat it as this game’s
   shipping vehicle without a fresh lock.
5. **No build yet.** Nosh is investigating. No engine, mobile shell,
   monetization, or agent-orchestration implementation is authorized
   by this ADR — only the product thesis and the hold.

## Why

The loft answered a different question (internal pack HQ). The tycoon
fantasy is a different product: real agent outcomes as game state,
player agency on roadmap and staffing, classic mobile management
loops. Stealth AI would break trust when latency, cost, or weird
failures show up. Parking the office avoids burning crew time on a
vehicle we are not driving.

## Non-goals (this ADR)

- Choosing Unity vs Godot vs web
- App Store launch plan
- IP harvest / product-lab ToS (still open — decide before any
  “we keep the code” productization)
- Implementing the game in this repository yet

## Consequences

- Office docs and README mark the loft **on hold**
- New work waits on Nosh’s follow-up investigation
- Smallest later slice (when unblocked): web prototype, one project
  type, one async agent milestone → pass/fail UI — not a mobile
  launch
- Engine choice only after the thesis survives that slice
