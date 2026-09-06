# Runtime pixel art — September 2026

Built with the built-in image generation tool, using the existing reference
mockups as style guides. The accepted PNGs live in `office/assets/`, outside
`reference/`. No reference image is loaded by the app.

## Desk

Output: `office/assets/furniture/desk-crt.png`.

References: `sheets/furniture-kit-sheet.png` and
`starter-office-hero-crew-mock.png`.

Prompt:

> Create one isolated production game sprite, transparent alpha background,
> no text, no sheet, no labels. References are STYLE guides. A cozy finely
> detailed PIXEL ART wooden office desk with chunky beige CRT computer with
> dark green terminal, keyboard, small ceramic sage mug and black task lamp.
> NO CHAIR, NO PERSON, NO PLANTS. Match the exact lovely warm amber brown
> pixel art wood grain and chunky black outlines of the reference assets,
> crisp pixel clusters, no vector-flat appearance. Orthographic classic 2:1
> isometric camera, top face has corners roughly at left (12%,47%), back
> (62%,22%), right (92%,37%), front (42%,62%). Desk front apron and left
> wooden drawer pedestal visible, brown drawer fronts with brass pulls,
> right legs, monitor rises above back desktop. Lamp at back left, CRT
> center, mug right. Full sprite alone centered with generous transparent
> margins, no grounding floor tile, no cast ground shadow outside the
> furniture. Aim for a native game sprite at approximately 128 pixels wide
> x 128 pixels tall, enlarged nearest-neighbor in the output, limited warm
> 24-color pixel palette. Reference 1 is furniture silhouette/material
> reference; reference 2 is quality/style target. This is runtime furniture
> replacing primitive polygons, not another mood board. Save PNG with real
> transparency.

## Props

Output: `office/assets/furniture/loft-props.png`.

References: the same furniture sheet and starter crew mock.

Prompt:

> One PRODUCTION PIXEL ART GAME PROP ATLAS on real transparent alpha
> background. Exactly SIX isolated objects in regular 3 columns by 2 rows,
> equal cells with generous clear margins, no overlap, NO LABELS NO TEXT
> NO SHEET PANELS. Orthographic 2:1 isometric camera and lovely detailed
> warm pixel clusters matching references, dark ink outlines, restrained
> warm brown ochre cream teal palette, no smooth vector art. Row1 column1:
> classic cream water cooler with big blue water jug red and blue taps.
> Row1 column2: small dark wood coffee station cabinet with black drip
> coffee machine, glass carafe and two ceramic cream mugs. Row1 column3:
> freestanding wooden framed cream office noticeboard with little pinned
> notes, no legible text, two feet. Row2 column1: empty dark charcoal rolling
> office chair, three-quarter rear view, back of chair faces viewer, desk
> would be behind the chair toward upper left, five wheeled star feet,
> chunky upholstered square back. Row2 column2: leafy indoor fern in
> terracotta pot. Row2 column3: empty upgraded sage green rolling office
> chair in same orientation as other chair, higher upholstered back, arm
> rests. Each complete object no cast shadow or ground plane outside the
> sprite. Crisp sprite texture designed for game native 32-64 pixels wide
> by 48-64 pixels high, enlargement pixelated nearest neighbor. Output
> ideally1536x1024. References are style guides only. These will be used
> individually in runtime game cells. Transparent background genuinely
> clear, not baked checkerboard.

## Crew

Output: `office/assets/characters/crew-idle.png`.

Reference: `starter-office-hero-crew-mock.png`.

The initial atlas established six complete figures, three columns by two
rows, in this order: Nosh (amber hoodie), Fabrizio (blue grey overshirt),
Maeve (sage sweater, long brown hair), Dex (teal hoodie, glasses), Cal
(brick sweater), Reed (navy cardigan, glasses). All face three-quarter
left. The generator returned a baked checkerboard on the first atlas;
that version is not used by the app.

Final accepted cutout prompt, applied to that atlas:

> Make a transparent-background cutout PNG of these six characters. Remove
> the checkerboard. Use the transparent background output feature.
> Background must be transparent, all six people intact. No checkerboard
> in output pixels.

## Portraits

Output: `office/assets/characters/crew-portraits.png`.

References: `desk-desktop-os-mock.png` and the generated crew atlas.

Prompt:

> One 3 columns x 2 rows portrait atlas, SIX perfectly square
> head-and-shoulders portraits touching edges with no gutters, each cell
> independent opaque warm muted tan background. NO text NO borders. Match
> portrait pixel art technique from the Employee Directory mock first
> reference: detailed readable dark 1px ink lines, expressive human faces,
> lovely pixel clusters, native portrait resolution around96x96 per cell,
> not vector polygon people. Use second reference ONLY to match
> identity/outfits. All face the camera in slight three-quarter view, heads
> and shoulders fill about85% of each square, hair fully in frame. Top left
> Nosh short dark hair amber hoodie; top middle Fabrizio short dark brown
> hair blue grey overshirt; top right Maeve long wavy dark brown hair sage
> green sweater small gold earrings; bottom left Dex messy black hair
> round glasses teal hoodie; bottom middle Cal short dark hair brick red
> sweater; bottom right Reed neatly parted brown hair glasses navy
> cardigan. Each avatar is a separate square, equally sized, no seams or
> objects crossing cell boundaries. Final image should be landscape3:2
> containing six squares. This is a runtime Directory portrait atlas. Do
> not draw UI around them. Cute warm serious retro game pixel art closely
> matching Maeve's illustrated portrait in first reference.

## Integration

`office/js/sprites.js` names source rectangles for the accepted artwork.
The renderer samples sprites into the logical room canvas without image
smoothing. Portraits use a 96×96 canvas. Idle figures are clipped at the
chair when seated; they remain separate from furniture while walking.

The generated sources are larger than the runtime pixels. They are art
sources, not guaranteed pixel-perfect atlases at their original size.
