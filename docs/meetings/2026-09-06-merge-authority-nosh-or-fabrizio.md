# Meeting — Merge authority expands to Fabrizio

**Date:** 2026-09-06  
**Who:** Nosh (call), Fabrizio Cortell (recording / co-enforcing)  
**Topic:** Expand merge gate from Nosh-alone to Nosh or Fabrizio

## What was said

Earlier the same day, ADR 006 locked Nosh as sole merge
authority. Nosh later decided to widen that gate: co-founder
Fabrizio may also merge to `main`, so founder capacity is not a
single bottleneck. Crew agents and Cursor auto-merge stay out by
default.

## Call

**Nosh decided.** Locked as **ADR 009**. Merge authority is
**Nosh or Fabrizio**. Maeve / Dex / Cal / Reed and other agents
do not merge unless either founder explicitly authorizes that
specific PR. One-concern PR rules from ADR 006 still stand.
Doctrine + always-on rule + culture updated.

## Open

- None for this call — behavior lock first; branch protection
  still later if needed
