# Coding standards (language-agnostic)

These are **not** separate philosophy from our principles — they are how we enforce **#1: easy-to-read, easy-to-understand code** and **KISS**.

Bind every language we touch. If a linter/formatter can enforce a rule, wire it up; humans (and agents) still own the judgment calls.

## 1. Names do the explaining

- Variables, functions, types, and modules should **say what they are / what they do**.
- Prefer names that model the **business domain**, not the implementation trivia.
- Code should **damn near read like English**. A sharp non-coder should be able to read a function and tell what it's doing.
- If you need a comment to explain *what* a well-named symbol already says, rename the symbol instead.

## 2. Comments explain why, never what

- Comments are for **intent, tradeoffs, constraints, and non-obvious why**.
- Do **not** restate what the code already says.
- If the code reads like a recipe, you don't narrate every step in the margins.

```text
// bad — what
// increment the counter by one
count = count + 1

// good — why (only when needed)
// Stripe webhooks can arrive twice; ignore duplicates so we don't double-charge.
```

## 3. Read like a recipe

- Top-to-bottom should feel like cooking instructions: gather, check, do, return.
- Prefer a short sequence of obvious steps over clever one-liners and dense combinators.
- Well-named domain code > commentary that apologizes for unclear code.

## 4. Functions fit on one screen

- A function should fit on a normal monitor **without scrolling**.
- If it doesn't, that's a signal: break it into **smaller, well-named pieces**.
- Each piece should do one job a human can name in a short phrase.

## 5. Lines stay ≤ 80 characters

- Hard preference: **no line over 80 characters**.
- A long line is a signal to extract **well-named intermediates**, wrap thoughtfully, or simplify the expression — not to shrink the font.
- Readable breaks beat horizontal scrolling.

## 6. Whitespace groups logical blocks

- Inside a function, group code into **logical sections** with blank lines between them.
- That is the entire point of whitespace: show the recipe's steps.
- Don't spray blank lines randomly; don't crush unrelated steps into a wall of text.

## 7. We hate nesting

- Nesting = complexity = harder to read. Minimize it.
- Prefer, in order:
  1. **Invert conditions** / flatten
  2. **Early returns** / guard clauses
  3. Extract the nested body into a **well-named function**
- Deep `if/else` pyramids are a defect against #1, not a style preference.

## 8. Files stay lean (~800 lines max)

- When a file drifts **over ~800 lines**, treat that as a signal to split into modules.
- Group common functionality together at a smaller level.
- A module should have one clear reason to change.

## Quick checklist (before you call it done)

- [ ] Names read like the business, not like the compiler
- [ ] Comments only for *why* (if needed at all)
- [ ] Function fits on one screen
- [ ] No line over 80 characters
- [ ] Logical blocks separated by whitespace
- [ ] Nesting flattened (guards / early returns / extraction)
- [ ] File not turning into a 800+ line junk drawer

Violations are real review findings — especially for Dex (build) and Cal (verify).
