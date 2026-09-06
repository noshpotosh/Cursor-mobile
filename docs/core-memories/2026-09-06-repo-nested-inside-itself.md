# Memory — Repo nested inside itself

**Date:** 2026-09-06
**Who:** Nosh (caught it); Fabrizio (triaged + cleaned)
**Why it sticks:** One bad clone path almost made us gaslight
ourselves about a broken company repo

## What happened

Cursor was rooted at `/home/nosh/repo/ware-wolf/ware-wolf` —
a full second clone sitting as an untracked directory inside the
real repo. Parent `main` was fine and matched origin. The nest
held one local-only Maeve branch (loft pixel-density call) that
would have died if we'd deleted blind.

We pushed that branch to origin, moved the agent root back to
`/home/nosh/repo/ware-wolf`, then deleted the nested clone.

## What we carry forward

- If the path looks like `repo/repo`, stop — check for a nested
  `.git` before "fixing" anything
- Salvage unique local commits to origin before deleting a nest
- Real company root is `/home/nosh/repo/ware-wolf`, not a child
  with the same name
