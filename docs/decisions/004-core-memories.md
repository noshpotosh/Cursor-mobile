# ADR 004 — Core memories

**Status:** Locked  
**Date:** 2026-09-05  
**Deciders:** User + Fabrizio Cortell

## Decision

Add **`docs/core-memories/`** for short markdown memories of crazy moments, memorable interactions, and lessons we'd be stupid to forget.

Agents write here **proactively** — not only when told.

## Why

Meetings capture "what we discussed." Decisions capture "what we locked." Neither captures the *charge* of a moment — the joke that became culture, the near-miss, the bar-energy call that defined us. Personas evolve; core memories are the shared scrapbook that keeps the pack continuous across sessions.

## Guardrails

1. **High bar.** Only write if it's memorable, defining, or "holy shit." Routine chatter stays out.
2. **Proactive.** Any agent may add a memory when something lands. Don't wait for an order.
3. **Short.** One moment per file. Title + date + who + what stuck + what we carry forward.
4. **True.** No invented drama. No fanfic. If you're unsure it happened, don't write it.
5. **Not doctrine.** Memories don't override `culture.md`, coding standards, or ADRs — they color them.
6. **No README sprawl.** No per-folder README. Map stays in `docs/index.md`.
7. **Filename:** `YYYY-MM-DD-short-slug.md`

## Consequences

- Meetings = transcript energy. Decisions = locks. Core memories = the scars and trophies.
- Agents get an explicit lane to drop memories without being asked.
- If the folder gets noisy, raise the bar — don't add process theater.
