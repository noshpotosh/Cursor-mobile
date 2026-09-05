# Dex style spot-check (JavaScript)

Small sample so you can judge readability **before** we build product #1.

**Author:** Dex Harlan  
**Sandwich rating:** 9.5/10 turkey club — still boring; less mysterious after founder red-pen.

Founder + Reed feedback folded in: named constants (no mystery `100` / `0.055` / `"USD"`), why-comment on tax, decomposed validation expressions.

## What to look for

- Names that read like English / the business
- Comments only for *why*
- Short functions, ≤80 char lines
- Early returns instead of nesting
- Whitespace between logical steps

## Run

```bash
node samples/dex-style-check/runDemo.js
```

No dependencies. Plain Node.
