# ADR 007 — Honest AI studio tycoon (office on hold)

**Status:** Locked (vehicle / build guidance amended by
[ADR 008](008-ai-studio-product-contract.md))  
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
5. **No build in this ADR.** This decision locks thesis and hold
   only. Engine, platform, source-deletion policy, and P1 build
   authorization live in
   [ADR 008](008-ai-studio-product-contract.md).

## Why

The loft answered a different question (internal pack HQ). The tycoon
fantasy is a different product: real agent outcomes as game state,
player agency on roadmap and staffing, classic mobile management
loops. Stealth AI would break trust when latency, cost, or weird
failures show up. Parking the office avoids burning crew time on a
vehicle we are not driving.

## Non-goals (this ADR)

- App Store launch plan
- Implementing the game in this ADR (see ADR 008 for vehicle)

## Amended by ADR 008

ADR 008 supersedes the earlier “web prototype first / no engine
yet” guidance: Godot 4.7.2 desktop-first is the shipping vehicle,
immediate source deletion is locked, and P1 may create the Godot
project. The loft remains on hold as a web toy; accepted art may
migrate into Godot with provenance.

## Consequences

- Office docs and README mark the loft **on hold**
- Product thesis here; contract and vehicle in ADR 008
- Implementation plan:
  [`../ai-studio-game-plan.md`](../ai-studio-game-plan.md)
