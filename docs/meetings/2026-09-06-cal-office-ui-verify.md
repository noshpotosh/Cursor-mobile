# Cal verification — Maeve UI + clarity loft

**Date:** 2026-09-06  
**Reviewer:** Cal Rook  
**Scope:** `cursor/maeve-office-ui-3431` on clarity `main`  
**Mode:** Adversarial / evidence-first

## Claimed

Maeve UI on Reed-cleared JS: desk mass, silhouettes, aisle/island
floor, loft chrome HUD, pictogram desktop, loft-shop swatches,
soft motion with reduced-motion respect.

## Verdict

**Pass with nits — not a clean ship.**  
Happy path holds. One lying surface and one Reed-gate file size
issue before anyone stamps “done.”

## Confirmed working

- Load + canvas loft; no console import failures on module graph
- Walk / E-interact: talk, bubbler, coffee, whiteboard, desk PC
- Desk kit reads as furniture (legs, monitor mass, Nosh mat, chairs)
- Staff silhouettes keyed per id (jacket + hair/posture map match
  `staff.json`)
- Aisle vs island floor fills distinct
- Loft chrome HUD (title + bucks + mute) one strip
- Desktop pictogram icons + warmer wallpaper
- Loft Shop rows with swatches; broke-state CTA disabled at 0 bucks
- Teams / Directory / Goals / Loft open and close; Leave desk works
- Mute toggles; lamp/steam/idle bob gated on `prefers-reduced-motion`

## Broken / dishonest

### Medium — *The Checkbox That Lied* (Goals)

Goals copy implies real proof (“Talk to three teammates,” “Take a
drink from the bubbler”), but `renderGoalsApp` just exposes
**Mark done** → `completeGoal` with **zero** action checks.

Repro:
1. Open desk PC → Goals  
2. Click **Mark done** on “Stay hydrated” without touching the bubbler  
3. Balance jumps; shop unlocks  

Expected: either auto-complete from interact events, or honest copy
(“Claim reward”) until tracking exists.

### Medium — Reed file gate

`office/js/drawOffice.js` ≈ **1038** lines (house soft max ~800).
Maeve art grew the manuscript. Split draw helpers before the next
art slice piles on.

## Untested / thin

- Upgrade purchase → live loft redraw with earned bucks (blocked by
  lying goals; economy APIs exist and look sane)
- Narrow/mobile layout beyond a glance
- Extended animation soak
- Teams “two real replies” goal path end-to-end

## Minimum before “shipped”

1. Stop lying about Goals — wire interact→goal progress, or relabel
   buttons until then  
2. Carve `drawOffice.js` under ~800 (Dex/Reed)

Everything else Maeve claimed visually: holds.

— Cal
