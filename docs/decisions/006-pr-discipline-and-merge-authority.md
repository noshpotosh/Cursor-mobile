# ADR 006 — PR discipline & merge authority

**Status:** Locked (merge authority amended by ADR 009)  
**Date:** 2026-09-06  
**Deciders:** Nosh  
**Recorded / enforced by:** Fabrizio Cortell (not a Decider on
this ADR)

> **Amendment:** Merge authority in decision #1 below is
> superseded by
> [`009-merge-authority-nosh-or-fabrizio.md`](009-merge-authority-nosh-or-fabrizio.md)
> (Nosh **or** Fabrizio may merge). One-concern PR rules (#2–#5)
> still stand.

## Decision

1. ~~**Nosh alone has final say on every merge to `main`.**~~
   **Superseded by ADR 009.** Merge authority is now Nosh or
   Fabrizio. Other agents still do not merge unless a founder
   authorizes that specific PR. See ADR 009.
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
or change one thing without undoing three others. Merge
authority was later expanded in ADR 009; scoped-PR discipline
here is unchanged.

## Consequences

- Doctrine: [`../pr-discipline.md`](../pr-discipline.md)
- Always-on rule: `.cursor/rules/pr-discipline.mdc`
- One-concern rules remain binding for every agent
- Merge authority → ADR 009
- GitHub branch protection / required reviews can come later;
  behavior locks first
