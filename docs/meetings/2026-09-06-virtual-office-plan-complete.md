# Meeting — Virtual office plan completion

**Date:** 2026-09-06  
**Owners:** Dex (impl) · Maeve (feel) · Cal (flows) · Reed (readability)

## Shipped

Closed the remaining plan gaps on top of Phases 0–8:

- Soft camera follow with reduced-motion snap
- Click desk → walk-then-talk
- NPC bubbler visits + Teams/Directory Away when off-desk
- Desk lamps upgrade + office catalog / Pack Loft / history in Loft
- Message-bus aliases (`sendMessage` / `getThread`) kept as seam
- Mute toggle + docs how-to-run

## Cal notes

- Presence reads `atDesk`, not a hard-coded Available
- Office purchase deducts once; move-in on owned offices does not re-bill
- Walk goals reject blocked tiles; furniture clicks path to an adjacent seat

## Reed notes

- Vanilla modules stay under `office/js/` with named constants
- No bundler; open via static server only

## Next

Pixel art pass when Maeve locks sprites; live Cursor agent provider behind the existing bus seam.
