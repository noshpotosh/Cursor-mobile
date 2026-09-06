# Maeve — loft doesn’t read as pixels (density call)

**Date:** 2026-09-06  
**Owner:** Maeve Quinn (product / design)  
**Branch:** `cursor/maeve-loft-pixel-density-call-0ece` (off `main`;
not stacked on Dex integer-zoom)

## Feedback (Nosh)

> Nothing really looks like pixels? Maybe the camera is too far?
> deskOS stuff looks awesome and pixelated tho.

Earlier “jagged / blurry” is a different villain (sampling / DPR).
This pour is **density + language**: loft doesn’t *feel* like pixel
art; deskOS does.

## Diagnosis (taste, not theater)

| Surface | What’s actually there | Why it reads |
| --- | --- | --- |
| **deskOS** | Hand SVG at ~40×40 with `crispEdges`; CSS shows glyphs ~80×80 + `image-rendering: pixelated` | Hard blocks, limited colors, intentional low-res *upscaled* so you can see the grid |
| **loft sprites** | Soft AI atlases (~200×490 crops) drawn at **26×60** chars / **98×94** desks via nearest-neighbor | Soft mush *downscaled* ~8× — NN can’t invent chunky pixels that were never authored |
| **loft floor / walls** | Continuous canvas polygons + grain (`drawRoom.js`) | Vector diorama next to bitmaps — hybrid that refuses to commit |
| **camera** | Fit-entire 10×8 room; scale often ~1.2–2.0 (cap 2) | On smaller viewports the room *is* a distant stage; on large ones size is fine — still soft. Camera is half the gut check, not the whole bottle |

**Verdict:** all of the above, ranked. Primary villain is **soft
source art + tiny intentional footprint**. Secondary is **vector
floor fighting bitmaps**. Tertiary is **fit-to-room framing** that
keeps the composition diorama-small on mid viewports. Integer zoom
(Dex) still matters for crisp *scaling* — it does **not** make soft
AI look like pixel art.

Art-direction already asked for characters **48–64 px tall** and
64×32 tile diamonds. Runtime height (~60) is in-range; the *source*
and the *floor language* never showed up to the party.

## Ranked fixes (smallest honest first)

1. **Re-cut runtime sprites at true 1× loft px** from the labeled
   sheets (`reference/sheets/`) — hard 1px ink, limited palette,
   no soft AI atlases as the hero. Same language as deskOS: author
   the pixels, then scale with nearest-neighbor / integer zoom.
2. **Floor zoom + draw-size lock with that art** — prefer integer
   scale floor of **2** when the viewport allows; keep characters in
   the 48–64 tall band (widen if silhouettes need it). If fit-all
   fights density, bias framing (slight crop / center walk) rather
   than shrinking below the pixel language.
3. **Swap vector floor for 64×32 tile bitmaps** from the tile atlas
   sheet so the room speaks the same dialect as the crew.

## Explicitly do NOT

- New 2D “pixel engine” (Fabrizio already killed it — correct)
- Nearest-neighbor upscale of soft AI mush and call it pixel art
- Zoom-only PR sold as the density fix
- Stack this product call onto the integer-zoom branch as code
- Another atmospheric hero mock before the hard cut lands

## Product call for Fabrizio / Dex

**Ship order:** keep integer loft zoom for crispness (Dex, separate
PR). Next density bet is **hard 1× sprite re-cut + draw sizes that
match the sheets**, then **tile floor**. Camera closer only as a
framing bias *after* the art speaks pixel — don’t chase zoom alone.

Success moment: stand in the loft and feel the same chunky pixel
grammar you get on the deskOS icons — without needing a tour guide
or a new renderer.

— Maeve
