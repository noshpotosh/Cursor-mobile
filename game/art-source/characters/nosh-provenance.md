# Nosh motion source

Created 2026-09-06 with the built-in OpenAI image-generation tool, using
`game/assets/characters/crew-idle.png` as the identity reference. The first
result had a painted checkerboard and was rejected. The second result has
real RGBA transparency and is retained unchanged as `nosh-motion-source.png`.
Its actual dimensions are 2172×724; the tool did not honor the requested
1024×128 grid. `nosh-motion.json` records the measured mechanical crops.

No paid art tool or image-generation service is needed to rebuild the
accepted runtime sheet. Regeneration is an art revision requiring visual
review, not a deterministic build step.

## Initial generation prompt

Use case: identity-preserve. Create a production pixel-art animation sprite
sheet for the FIRST character (top left) in the reference: Nosh, black
tousled hair, amber yellow hoodie, blue jeans and brown shoes. ONLY this
character. Transparent background with real alpha, no colored ground, no
glow, no shadows outside sprite. Exactly 8 equal cells in ONE horizontal
row, full canvas 1024x128, each cell 128x128. Same character scale, center X
and feet baseline in every cell. All face LEFT with slight three-quarter
back angle matching reference. Cell 1 neutral standing idle hands at sides.
Cells 2 through 7 six sequential RUN cycle poses: left contact, compression,
passing/flight, right contact, compression, passing/flight; visible
alternating bent knees and opposite swinging bent arms, feet airborne on
flight frames. Cell 8 duplicate idle. Coherent loop, unchanged clothing and
head proportions. Character should occupy about 58 pixels height if
downscaled to 64x64 cell; clean 1px outlines and intentionally chunky pixel
clusters. Native low-resolution pixel-art, limited palette, no antialias,
no blur, no labels, no gridlines, no watermark. Keep every figure entirely
inside its own evenly spaced cell with ample transparent margins.

## Transparency correction prompt

Use case: background-extraction. Remove the checkerboard entirely. Return
these same eight Nosh character poses as an actual transparent PNG with an
alpha channel. The checkerboard MUST NOT be painted in the image, it must
be transparency. Preserve all eight character silhouettes, clothing,
colors, outlines, faces, pose sequence and their locations. No ground
shadow or other background. Also tightly frame the row: each of eight
equal cells is 128 wide x128 high, total 1024x128. Each figure fits inside
one cell. Transparent padding. This is a runtime sprite sheet, no display
mockup.
