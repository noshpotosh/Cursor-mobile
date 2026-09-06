# ADR 006 — PR discipline & merge authority

**Status:** Locked  
**Date:** 2026-09-06  
**Deciders:** User (Nosh) + Fabrizio Cortell

## Decision

1. **The human founder (Nosh) has final say on every merge to
   `main`.** Agents open scoped PRs. Agents do **not** merge,
   approve-and-merge, or auto-merge — including Cursor cloud /
   `app/cursor` merges — unless Nosh explicitly says so for that PR.
2. **One concern per PR.** A concern is one feature, one decision
   (ADR), one meeting topic, or one tightly coupled fix. If two
   things could be reverted independently, they are two PRs.
3. **Honest titles and bodies.** The title names the one concern.
   The body says what changed, why, and how to verify. No
   "docs:" titles that hide code. No kitchen-sink summaries.
4. **Branch = that concern.** Descriptive `cursor/<slug>-…`
   branches. Do not pile unrelated work onto an open branch just
   because the agent session is still running.
5. **Meeting notes ride with their concern** when they document
   that same change. Unrelated meetings, ADRs, or features get
   their own PRs.

## Why

We got sloppy: multi-feature merges, mixed meetings, and bot
merges without founder review. Scoped PRs exist so we can revert
or change one thing without undoing three others. Founder merge
authority is the last gate.

## Consequences

- Doctrine: [`../pr-discipline.md`](../pr-discipline.md)
- Always-on rule: `.cursor/rules/pr-discipline.mdc`
- Culture "How we decide" names Nosh as merge authority
- Fabrizio enforces scope at planning time; crew follows the rule
  at PR time
- GitHub branch protection / required reviews can come later;
  behavior locks first
