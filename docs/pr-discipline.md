# PR discipline

How Warewolf ships changes. Scoped PRs locked in
[`decisions/006-pr-discipline-and-merge-authority.md`](decisions/006-pr-discipline-and-merge-authority.md).
Merge authority locked in
[`decisions/009-merge-authority-nosh-or-fabrizio.md`](decisions/009-merge-authority-nosh-or-fabrizio.md).

## Merge authority

**Only Nosh or Fabrizio may merge to `main`.**

Maeve, Dex, Cal, Reed, and any other agent may open and update
PRs. They do not merge unless Nosh or Fabrizio explicitly
authorizes that specific PR. "Looks good" from a non-founder
agent is not a merge. Cursor auto-merge / `app/cursor` merge is
not allowed by default. Either founder may authorize a one-off
agent merge for a named PR. Fabrizio may merge; he still enforces
scoped PRs and does not rubber-stamp kitchen-sinks. Nosh can
still override Fabrizio as partner when they disagree.

## One concern per PR

| Do | Don't |
| --- | --- |
| One feature / phase / fix | Kitchen-sink "complete the plan" dumps |
| One ADR (or one tightly coupled ADR pair only when inseparable) | Bundle unrelated decisions |
| Meeting note for *this* change | Stuff three meetings into a feature PR |
| Honest title matching the diff | `docs:` title with app code inside |

**Test:** Could we revert this PR without also undoing unrelated
work we still want? If no → split.

Meeting notes that document the same concern may land in that PR.
Unrelated meetings → separate PR.

## Branching

- New branch per concern off current `main`
- Name it for the concern (`cursor/<short-slug>-…`)
- Don't keep stacking unrelated commits on a live agent branch
- Prefer rebase/update from `main` over merging foreign concerns
  into your branch

## PR description (minimum)

1. **What** — one concern, plain language
2. **Why** — the reason it exists
3. **How to check** — commands, clicks, or "docs-only"
4. **Links** — meeting / ADR paths when relevant

## Agent behavior

- Fabrizio: split work into scoped PR-sized bets at plan time;
  document and enforce scope; **may merge** as co-founder merge
  authority (ADR 009) — still no kitchen-sink rubber stamps
- Maeve / Dex / Cal / Reed: ship only their assigned concern on
  that branch; open a second PR if scope creeps; do not merge
  unless Nosh or Fabrizio authorizes that specific PR
- Nobody outside Nosh/Fabrizio merges to `main` without explicit
  founder authorization for that PR
