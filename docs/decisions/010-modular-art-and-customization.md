# ADR 010 — Modular art catalog and character customization

**Status:** Proposed (awaiting Nosh lock)  
**Date:** 2026-09-06  
**Deciders:** Nosh + Fabrizio Cortell (proposed by Fabrizio)  
**Meeting:** [`../meetings/2026-09-06-art-customization-strategy.md`](../meetings/2026-09-06-art-customization-strategy.md)  
**Plan:** [`../ai-studio-game-plan.md`](../ai-studio-game-plan.md)  
**Art bible (carry forward):** [`../office/art-direction.md`](../office/art-direction.md)

## Decision (proposed)

1. **No runtime arbitrary art generation.** The shipping game does
   not invent unique characters, props, or animations on demand.
   Consistency comes from a finite catalog under one art bible —
   not from hoping a model stays on-style forever.
2. **Modular characters.** Founder (and later hireable) appearance
   is a layered compositor: body archetype, hair, top, bottom,
   optional accent. Gender presentation is a presentation choice
   over those slots, not a separate art pipeline.
3. **Recolor, don’t redraw.** Hair, skin, and outfit colors use
   palette / recolor maps on locked base sprites whenever possible.
4. **Shared animation sets.** Idle and walk cycles attach to body
   archetypes. Outfits and recolors do not each get unique
   animation sheets in v1.
5. **Props are kits.** Office furniture and decor stay as named
   catalog items (desk kit, chair tiers, plants, lamps, neon) that
   upgrade by swap — same language as the loft upgrade sheet.
6. **AI stays in authoring, not gameplay.** Image models may help
   draft candidate sprites offline (as we already did for loft
   atlases). Nothing ships until Maeve accepts it into the catalog
   with provenance. Players never press a button that invents a
   new silhouette mid-session.
7. **Depth comes from combinations.** “Deep customization” means
   enough slots and options that founders feel distinct — not an
   open prompt box. Exact slot counts are Maeve’s product cut
   before the first customization UI ships.

## Why

Nosh correctly flagged art production as the silent killer of the
tycoon bet. Generative consistency across characters, walk cycles,
and iso props is an unsolved production problem if we treat it as
runtime magic. Modular catalogs with recolor and shared anims are
how cozy management games actually ship deep customization. Our
existing palette, 2:1 iso contract, silhouette rules, and atlas
pipeline already point that direction — we should lean into them
instead of betting the product on open-ended generation.

## Non-goals (this ADR)

- Building the compositor in this PR (engineering comes after lock)
- Reopening `office/` web feature work
- Runtime text-to-sprite or text-to-prop tools for players
- Unique animation sheets per clothing item in v1
- Photoreal or 3D character pipelines

## Consequences (when locked)

- Game plan customization boundary stays bounded; “fully generated
  art” remains an explicit non-goal for the first versions
- Maeve owns the first founder slot sheet and option counts
- Dex implements compositor + recolor against that sheet
- Cal verifies silhouette readability at loft scale and that
  no runtime path invents uncatalogued sprites
- New art still flows through the existing acceptance / provenance
  pattern (`game/assets/MANIFEST.md` and art-prompt notes)
