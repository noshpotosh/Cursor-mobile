# ADR 010 — Modular art catalog and character customization

**Status:** Proposed (awaiting Nosh lock)  
**Date:** 2026-09-06  
**Deciders:** Nosh + Fabrizio Cortell (proposed by Fabrizio)  
**Meeting:** [`../meetings/2026-09-06-art-customization-strategy.md`](../meetings/2026-09-06-art-customization-strategy.md)  
**Plan:** [`../ai-studio-game-plan.md`](../ai-studio-game-plan.md)  
**Art bible (carry forward):** [`../office/art-direction.md`](../office/art-direction.md)  
**Runtime provenance:** [`../../game/assets/MANIFEST.md`](../../game/assets/MANIFEST.md)

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
4. **Shared animation sets.** Idle and walk/run cycles attach to
   body archetypes. Outfits and recolors do not each get unique
   animation sheets in v1.
5. **Props and UI are kits.** Office furniture and decor stay as
   named catalog items that upgrade by swap. Desktop chrome stays
   as reusable atlas regions / nine-slice theme cells — same kit
   instinct as the loft upgrade sheet.
6. **AI stays in authoring, not gameplay.** Image models may help
   draft candidate sprites offline. Nothing ships until it is
   accepted into the catalog with provenance recorded in
   `game/assets/MANIFEST.md` (and art-source notes when present).
   Players never press a button that invents a new silhouette
   mid-session.
7. **Depth comes from combinations.** “Deep customization” means
   enough slots and options that founders feel distinct — not an
   open prompt box. Exact slot counts are Maeve’s product cut
   before the first customization UI ships.

## Why

Nosh correctly flagged art production as the silent killer of the
tycoon bet. Generative consistency across characters, walk cycles,
and iso props is an unsolved production problem if we treat it as
runtime magic. Modular catalogs with recolor and shared anims are
how cozy management games actually ship deep customization.

Recent Godot art work already moves this way:

- **Desktop rebuild (#37, on `main`):** finite UI atlas + metadata
  regions + nine-slice theme + `art-source/` SVG → export →
  runtime PNGs. Live Controls for text/state. No screenshot crops
  as gameplay art.
- **World / character pack:** accepted loft atlases with crop
  contracts in `MANIFEST.md`; known soft-atlas density debt is
  labeled as debt, not a pattern to copy.
- **Motion + pipeline stack (#38 / #39, stacked follow-ups):**
  shared idle/run sheet for one body identity, mirrored facing,
  offline generation with provenance, then export/validate tools.
  That is shared animation + authoring-gate in practice.

ADR 010 does not replace that kit work. It says the next depth
layer (clothes / hair / presentation) builds **on top of** the
catalog + compositor pattern those upgrades proved — not a
runtime “generate anything” detour.

## Non-goals (this ADR)

- Building the compositor in this PR (engineering comes after lock)
- Reopening `office/` web feature work
- Runtime text-to-sprite or text-to-prop tools for players
- Unique animation sheets per clothing item in v1
- Photoreal or 3D character pipelines
- Pretending soft large-atlas → tiny draw-size world art is the
  long-term character authoring pattern

## Consequences (when locked)

- Game plan customization boundary stays bounded; “fully generated
  art at runtime” remains an explicit non-goal for early versions
- Maeve owns the first founder slot sheet and option counts
- Dex implements compositor + recolor against that sheet, using
  the Godot art-source / export / MANIFEST path we already started
- Cal verifies silhouette readability at loft scale and that
  no runtime path invents uncatalogued sprites
- New character parts should be authored at native loft pixel
  density when practical — do not multiply the soft-atlas debt
