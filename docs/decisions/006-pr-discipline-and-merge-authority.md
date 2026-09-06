# ADR 006 — PR discipline & merge authority

**Status:** Locked  
**Date:** 2026-09-06  
**Deciders:** Nosh  
**Recorded / enforced by:** Fabrizio Cortell (not a Decider)

## Decision

1. **Nosh alone has final say on every merge to `main`.** Agents
   — including Fabrizio — open scoped PRs. They do **not** merge,
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

Nosh called out sloppy multi-feature merges, mixed meetings, and
bot merges without his review. Scoped PRs exist so we can revert
or change one thing without undoing three others. Nosh's merge
authority is the last gate — not an agent co-vote.

## Consequences

- Doctrine: [`../pr-discipline.md`](../pr-discipline.md)
- Always-on rule: `.cursor/rules/pr-discipline.mdc`
- Culture "How we decide" names Nosh as sole merge authority
- Fabrizio documents this lock and enforces PR scope at planning
  time; he does not decide or merge
- Crew follows the rule at PR time
- GitHub branch protection / required reviews can come later;
  behavior locks first
