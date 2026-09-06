# ADR 008 — AI studio product contract (P0)

**Status:** Locked  
**Date:** 2026-09-06  
**Deciders:** Nosh + Fabrizio Cortell  
**Meeting:** [`../meetings/2026-09-06-ai-studio-p0-contract.md`](../meetings/2026-09-06-ai-studio-p0-contract.md)  
**Thesis:** [`007-honest-ai-studio-tycoon.md`](007-honest-ai-studio-tycoon.md)  
**Plan:** [`../ai-studio-game-plan.md`](../ai-studio-game-plan.md)

## Decision

1. **Player promise.** This is an honest AI studio tycoon — a game
   about running a software studio. Players know AI is the labor.
   They receive verified build state, consequences, and rewards.
   It is not a coding service and must be described that way
   wherever it is sold or pitched.
2. **Engine and client.** Shipping vehicle is **Godot 4.7.2**
   stable with **GDScript**. Desktop-first at **1280×720**. Click
   and tap share one interaction path; management controls stay
   touch-safe. There is **no** separate web management prototype
   before Godot.
3. **Build authorization.** This ADR authorizes creating the
   Godot project in **P1**. It does not include that project. No
   live-agent backend, monetization, or App Store work is
   authorized here.
4. **Cast.** Warewolf crew names and personas stay **internal
   demo cast only**. Public builds use fictional role archetypes
   unless a later lock makes the crew part of the public brand.
5. **Source deletion.** Generated source is **deleted immediately**
   after task completion or expiry. Players never receive it. No
   short retry window that keeps source around.
6. **First project type.** First supported live and simulated
   project type is **greenfield web-app** only.
7. **Live-agent cost.** Hard **per-session** cost ceiling. Exact
   dollar amount is a named constant locked before **P5**. The
   Godot client never holds provider credentials and never
   executes generated code.
8. **Retained evidence.** Keep only structured game state:
   - User-approved brief and milestones
   - Task-state transitions
   - Passing and failing check **counts**
   - Sanitized blocker and outcome summaries
   - Agent cost and elapsed game or wall time
   - Reward and progression events  
   Do **not** retain generated source, secrets, or raw logs.

## Why

ADR 007 locked the thesis and parked the loft. Open vehicle and
trust questions blocked P1. Nosh chose Godot desktop-first over a
web prototype, accepted immediate source deletion, and locked the
first project type and evidence boundary so trust and scope are
settled before any engine project lands.

## Non-goals (this ADR)

- Creating the Godot project (that is P1)
- Reopening virtual-office feature work in `office/`
- Exact `$` session cost (name before P5)
- App Store / phone layout commitment
- Multiple project types, currencies, or life-sim staff systems
- Keeping or selling generated source

## Consequences

- Implementation plan follows ADR 008; P1 may start after merge
- ADR 007 thesis remains; its “web first / no engine” build
  guidance is superseded here
- Loft stays **on hold** as a web toy; P1 may migrate accepted
  art into Godot with provenance intact
- Game API / disposable workers (P5+) must enforce deletion and
  the evidence list above
