# ADR 009 — Merge authority: Nosh or Fabrizio

**Status:** Locked  
**Date:** 2026-09-06  
**Deciders:** Nosh (call)  
**Recorded / co-enforcing:** Fabrizio Cortell

## Amends

Supersedes the **merge-authority** portion of
[`006-pr-discipline-and-merge-authority.md`](006-pr-discipline-and-merge-authority.md).
One-concern PR rules in ADR 006 still stand.

## Decision

1. **Only Nosh or Fabrizio may merge a PR to `main`.** Either
   founder may land a scoped, honest PR.
2. **All other agents do not merge.** Maeve, Dex, Cal, Reed, and
   any other agent open/update PRs only. They do **not** merge,
   approve-and-merge, or auto-merge — including Cursor cloud /
   `app/cursor` merges — unless **Nosh or Fabrizio** explicitly
   authorizes that specific PR.
3. **No auto-merge by default.** Cursor auto-merge / `app/cursor`
   merge stays off unless a founder turns it on for a named PR.
4. **One-off agent merges need a founder.** Either Nosh or
   Fabrizio may authorize another agent to merge one specific PR.
   Blanket permission does not exist.
5. **Scope still wins.** Fabrizio may merge; he does not rubber-
   stamp kitchen-sinks. Scoped PRs (ADR 006) remain binding.
   Nosh can still override Fabrizio as partner when they disagree.

## Why

Nosh expanded the merge gate so co-founder capacity can land
work without waiting on a single button — while keeping the crew
and bots out of the merge seat by default.

## Consequences

- Doctrine: [`../pr-discipline.md`](../pr-discipline.md)
- Always-on rule: `.cursor/rules/pr-discipline.mdc`
- Culture "How we decide" names Nosh or Fabrizio as merge
  authority
- Fabrizio may merge; he still sizes and enforces PR scope
- Crew (except Fabrizio) follows the no-merge rule at PR time
