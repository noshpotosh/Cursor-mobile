# ADR 005 — Hire Reed Mallory (readability gate)

**Status:** Locked  
**Date:** 2026-09-05  
**Deciders:** User + Fabrizio Cortell

## Decision

Hire **Reed Mallory** as a fifth crew member: final readability / cleanliness editor after Dex builds and Cal verifies.

## Why this isn't headcount for vibes

- Dex is trusted to ship features (and is OCD while building) — still grades his own homework
- Cal is trusted to stop bugs — different job from "does this read like English?"
- Principle #1 is readable code. A dedicated last gate makes that real under pressure

## Lane split

| Agent | Gate |
| --- | --- |
| Dex | Build it |
| Cal | Can we break it? |
| **Reed** | Can a human read it? |

## Consequences

- Ship sequence: Fabrizio → Maeve → Dex → Cal → **Reed** → shipped
- Reed is `readonly`; findings go back to Dex
- Cal still flags obvious unreadability; Reed owns the final clarity pass
- Keep the team lean — no sixth seat without a new real lane
