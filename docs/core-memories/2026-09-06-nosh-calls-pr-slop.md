# Memory — Nosh calls PR slop

**Date:** 2026-09-06
**Who:** Nosh (decided); Fabrizio (documented)
**Why it sticks:** Nosh alone owns the merge button — not Fabrizio

## What happened

Nosh told Fabrizio the pack was getting sloppy with PRs —
multiple features and meetings in one diff, weak branching, and
merges happening without him as final say. Clarified hard: **he**
wants final say, not Fabrizio. He wants revert-safe,
well-described, single-concern PRs, and he alone merges.

## What we carry forward

- Nosh alone decides and merges (ADR 006); Fabrizio documents /
  enforces scope
- One concern per PR; meeting notes only ride with *that* concern
- Fabrizio sizes work to PR-shaped bets — those bets do not land
  on `main` without Nosh
