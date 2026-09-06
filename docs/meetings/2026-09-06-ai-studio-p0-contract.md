# Meeting — AI studio P0 product contract

**Date:** 2026-09-06  
**Who:** Nosh (founder), Fabrizio Cortell (planning / recording)  
**Topic:** Lock Phase 0 product / trust / vehicle calls from the
AI studio game plan  
**Decision:** [`../decisions/008-ai-studio-product-contract.md`](../decisions/008-ai-studio-product-contract.md)

## What was said

Fabrizio scoped P0 as a decision lock only — not a Godot project.
ADR 007 still said “web prototype first / no engine.” The game
plan recommended Godot 4.7.2 for P1 and a list of product defaults.
Those two paths conflicted; Nosh had to pick.

## Calls

1. **Engine path A.** Lock **Godot 4.7.2 + GDScript** for P1.
   Desktop-first with touch-safe UI. **Skip** a separate web
   management prototype.
2. **Accept game-plan defaults as written:**
   - Warewolf crew = internal demo cast only
   - Immediate source deletion (no retry window)
   - First project type = greenfield web-app
   - Hard per-session live-agent cost ceiling (`$` named before
     P5)
   - Retained evidence = structured summaries (counts +
     sanitized outcomes); no raw logs or source

Locked as **ADR 008**.

## Out of scope tonight

- Creating the Godot project (P1)
- Maeve’s vertical-slice art cut
- Exact dollar cost ceiling
- Reopening `office/` feature work
