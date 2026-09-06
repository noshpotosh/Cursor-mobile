# Meeting — Art consistency and deep character customization

**Date:** 2026-09-06  
**Who:** Nosh (founder), Fabrizio Cortell (planning / recording)  
**Topic:** How we ship consistent characters, animations, props, and
deep founder customization without drowning in art  
**Proposal:** [`../decisions/010-modular-art-and-customization.md`](../decisions/010-modular-art-and-customization.md)

## What was said

Nosh loves the AI studio tycoon bet but flagged the real production
risk: generating characters, animations, office props, and deep
player customization (clothes, hair color, gender presentation)
that all stay consistent with the loft kit we already have.

The fear was correct. “Arbitrary generative art that always matches”
is not a system we can trust as a shipping dependency.

## Fabrizio’s call

**Reshape it.** Do not build a runtime “generate anything” art
model. Pull this off the Sims / Stardew way:

1. **Finite modular catalog** under the existing art bible
2. **Layered character compositor** (body, hair, clothes, accents)
3. **Recolor maps** for hair / skin / outfit tints
4. **Shared animation sets** per body archetype, not per outfit
5. **Offline AI only as an authoring assistant** — candidates enter
   the catalog after an acceptance gate with provenance, same
   instinct as today’s loft / Godot atlas workflow

Deep customization means combinatorial depth from locked parts, not
infinite one-off sprites.

## Alignment with existing plan and recent Godot art

The game plan already called “customize everything” an infinite
scope trap and listed fully generated art / employees as a
non-goal for v1. This meeting sharpens that into an explicit art
system: modular catalog first, generative authoring later, never
runtime arbitrary generation as the source of truth.

Checked against the recent Godot upgrades:

| Upgrade | Fits ADR 010? | Why |
| --- | --- | --- |
| Desktop reusable atlases (#37) | Yes | Finite kit, named regions, art-source → export, live UI text |
| Accepted world / crew atlases + MANIFEST | Yes | Catalog + provenance; density debt explicitly not the future pattern |
| Nosh idle/run motion sheet (#38 stack) | Yes | Shared anim set on one identity; offline gen + provenance |
| Pipeline / validate tools (#39 stack) | Yes | Institutionalizes the authoring gate ADR 010 assumes |

Gap (expected): we still ship whole-character sheets today, not
layered hair/clothes slots. That is the *next* product cut after
lock — not a contradiction.

## Open for Nosh

- Lock ADR 010 as proposed, or push back
- When Maeve specs founder slots: how deep is “deep” for the
  first public customization screen (slot counts, not vibes)
