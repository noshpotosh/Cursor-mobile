# Meeting — Founder style feedback on Dex sample

**Date:** 2026-09-05  
**Present:** User (founder), Fabrizio, Dex (patch), Reed (prior review)  
**Artifact:** `samples/dex-style-check/orderSummary.js`

## Founder notes (accepted)

1. **`100` is a mystery number** — name it (`CENTS_PER_DOLLAR`). Reader shouldn't guess.
2. **`"USD"` should be a named constant / enum-like map** — room to grow currencies later without hunting string literals.
3. **`0.055` is a mystery number** — and the old comment explained *what* (WI demo rate) without a real *why*. Named constant + why-comment.
4. **Compound price check is too dense inline** — decompose into named booleans.

## What we locked into doctrine

Added to `docs/coding-standards.md`:

- **§9 No mystery numbers or mystery strings**
- **§10 Decompose complex expressions**

Also folded Reed's earlier optional nits into the sample:

- `getOrderValidationError` / `getOrderItemValidationError`

## Status

Sample patched. Standards updated. Still open for any remaining founder feedback before we call style alignment done and start product #1.
