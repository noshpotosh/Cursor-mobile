# Reed review — Dex JS style spot-check

**Date:** 2026-09-05  
**Reviewer:** Reed Mallory  
**Manuscript:** `samples/dex-style-check/`  
**Goal:** Align on readability principles before product #1 — not ship production code.

## Plain English: what this is

A tiny coffee-shop order summary: validate an order, price lines in cents, add tax, format dollars, return a readable summary (or an error).

## Readability verdict

**pass-with-nits**

**Grade:** **A-**

This already reads like our doctrine. Recipe-shaped. Early returns. Money stays in cents until display. Comments earn their keep. I’m not asking for a rewrite — I’m marking a few alignment nits so founder feedback has something sharp to bounce off.

## Standards checklist

| Standard | Status |
| --- | --- |
| Names read like the business | Pass |
| Comments = why, not what | Pass |
| Recipe top-to-bottom | Pass |
| Functions fit on one screen | Pass |
| Lines ≤ 80 | Pass |
| Whitespace groups steps | Pass |
| Nesting hated / guards used | Pass |
| File lean | Pass (tiny) |

## What already reads well (don’t “improve” these away)

- **`unitPriceInCents` / `formatDollars`** — the domain is obvious; no mystery floats.
- **`validateOrder` → early return errors** — fails loud, reads like a bouncer list.
- **`buildOrderSummary`** — gather, guard, compute, return. Textbook recipe.
- **Tax comment** — the one *why* in the file; correct use of a comment.
- **`runDemo.js`** — demo stays dumb and legible. Good.

## Findings

### Nits (not blockers)

1. **`validateOrder` buries a second recipe inside the loop.**  
   The item checks are clear, but extracting something like `validateOrderItem(item)` would keep each function as one named job and make the loop read as English: “for each item, validate it.” Same behavior; sharper outline.

2. **`validateOrder` returns `string | null`.**  
   It works. A name like `getOrderValidationError(order)` would make the return value’s meaning obvious at the call site without reading the body. Optional — style alignment, not a defect.

3. **File title comment is fine for a sample; don’t normalize file essays.**  
   Spot-check headers are OK. In product code, prefer module names + one *why* only when needed.

### Not in my lane

- Tax rate correctness, edge-case money rounding law — that’s Cal if we productize this.
- Whether “coffee shop” is the right demo domain — Maeve/founder taste.

## Handback to Dex (only if we tighten before alignment lock)

1. Optional: extract `validateOrderItem`.
2. Optional: rename `validateOrder` → `getOrderValidationError` (or keep + leave a one-line note in standards that `getXError` is our pattern for `string | null` validators).

Otherwise: **this is a fair house-style reference.**

## Reed’s alignment note for the founders

If we all sign off on this sample (plus founder notes), we should treat it as the **JS exemplar** next to `docs/coding-standards.md` — not sacred scripture, but the “point at this” file when someone drifts into clever mush.

— Reed
