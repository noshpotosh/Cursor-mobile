# Godot game art pipeline

This is the contributor entry point for art in `game/`. The parked `office/`
project has a separate pipeline. Its accepted art and mockups may inform new
assets, but the Godot runtime must be self-contained.

## Choose the right asset

PNG is our lossless runtime image format. A sprite sheet is a PNG containing
multiple frames; an atlas contains named regions, often with different sizes.
Neither requires replacing every individual image with a sheet.

- Characters: transparent, fixed-size frame sheets and native Godot
  `SpriteFrames` resources, played by `AnimatedSprite2D`.
- Related UI icons: atlas regions, with names at the point of consumption.
- Window and button borders: a theme sheet sliced with `StyleBoxTexture`.
  Nine-slice borders keep their authored corners when a panel grows.
- Wallpaper: a separate seamless repeating tile.
- World tiles: 64×32 logical isometric diamonds. Standalone tiles remain
  valid; migrate to `TileSetAtlasSource` when tile authoring needs it.
- Text, buttons, lists, layout, and state: live Godot Controls. Never bake
  the desktop screenshot, names, balances, or body text into a texture.

These choices use Godot's standard [sprite animation][animation],
[nine-slice styling][nine-slice], and [image import][import] facilities.
Keep sheets grouped by purpose; a giant universal atlas complicates editing
and does not guarantee faster rendering.

## Source, export, runtime

- `game/art-source/`: editable source artwork and generation provenance.
  Its `.gdignore` keeps source images out of the import/runtime asset tree.
- `game/tools/export_*_art.gd`: deterministic source-to-runtime exports.
- `game/assets/`: committed runtime PNGs, `.tres` resources, fonts/licenses,
  and `.import` settings. `assets/MANIFEST.md` records provenance and use.
- `game/.godot/`: disposable local import cache; never commit it.
- Reference mocks and rejected generations are never runtime dependencies.
  Existing `_screenshot-crops` and `_pixellab-attempts` are ignored by Godot.

Use kebab-case filenames that describe the subject and purpose. Preserve
editable SVG for the existing UI pixel-art system; use Aseprite or another
layered pixel-art source for hand-authored character work when available.
Generated PNG source is acceptable with its prompt and reference recorded.
Do not call a flattened generated image a layered source file.

## Pixel and animation contract

Author at the logical pixel size. Export without smoothing; set texture import
compression to Lossless, mipmaps off, and size limit to zero. Use nearest
filtering in the project and on sprite/UI consumers. Retain alpha; an image
with a painted checkerboard fails even if it looks transparent in a preview.

Keep coordinates and crop rectangles integral. Do not rotate packed sprites.
Do not trim animation frames independently at runtime. Each frame has the
same cell dimensions and origin; changing limbs must not move the actor's
pathfinding origin. Keep clear padding inside cell edges and enable
`AtlasTexture.filter_clip` to prevent neighboring cells leaking into a frame.
If a future asset needs linear filtering or mipmaps, define edge extrusion
and revalidate it as a separate import contract.

Nosh uses 48×96 cells with foot pivot `(24, 74)`, one idle frame and six
running frames at 10 fps. The current art provides a left-facing view mirrored
for rightward travel, including diagonal routes. It does not claim four
distinct directional drawings. Running is driven by actual route movement;
arrival restores idle immediately. Preserve the loop across tile boundaries.
The taller transparent cells retain the generated source's faint alpha fringe
without clipping. The visible character remains approximately 60 pixels tall.

The legacy desk/chair sprites still shrink larger accepted images into loft
sizes. Packing them would not remove that pixel-density debt. Replace them
only when properly authored art is available, with matched pivots and scale.

## Add or replace an asset

1. Read this document, the asset manifest, and the relevant runtime consumer.
   Pick an existing category and preserve its scale, palette, and pivot.
2. Save editable source under `art-source/`. Record author/tool, reference,
   prompt if generated, license/permission where applicable, and crop rules.
3. Add or update the smallest relevant exporter. Exports must work without
   a network service or paid editor. If using Aseprite, also retain exported
   frames and describe the exact Aseprite CLI export command/version.
4. Export the PNG and resource. Use native `SpriteFrames` for animation,
   `AtlasTexture` for named sprites, and nine-slice margins for UI borders.
   Keep the native resource or exporter as the single owner of frame order
   and timing; avoid duplicate crop arrays in gameplay code.
5. Update `assets/MANIFEST.md` with source, output, dimensions, frames,
   pivot/timing, and consumer. Leave reference art out of runtime paths.
6. Run export and validation, inspect the imported image at native size and
   an integer zoom, and test its real scene. Repeat export and ensure outputs
   are unchanged. Commit source, output, resources, and import settings
   together in a scoped art change.

## Rebuild and verify

From the repository root with Godot 4.7.2 on PATH:

```bash
bash game/tools/export_art.sh
godot --headless --path game --script res://scripts/animation_check.gd
godot --headless --path game --script res://scripts/smoke_check.gd
```

If the executable has another name or location:

```bash
GODOT_BIN=/path/to/godot bash game/tools/export_art.sh
```

`ART_OK` verifies imported texture settings, resource loading, frame bounds,
and exclusion of source/reference dependencies. It is a structural check,
not an art-quality approval. Export failures must exit nonzero.

For desktop changes, capture the running game at 1280×720 with Directory
open and compare with `office/assets/reference/desk-desktop-os-mock.png`.
With a working graphical display (omit `--headless`), generate that view:

```bash
godot --path game --script res://tools/capture_desktop.gd -- /tmp/desktop.png
```

Check wallpaper density, icon scale, window position/borders, typography,
portrait, and taskbar before calling the mock matched. Exercise close,
minimize/restore, maximize, search/selection, Esc, and return to the loft.

For character changes, inspect a complete loop in both facing directions,
turns, stopping, and desk arrival. Check for matte backgrounds, clipped limbs,
foot sliding, changes in body size, frame bleed, and ordering behind furniture.
Screenshots and animation previews are review evidence, not runtime art.

[animation]: https://docs.godotengine.org/en/stable/tutorials/2d/2d_sprite_animation.html
[nine-slice]: https://docs.godotengine.org/en/stable/classes/class_styleboxtexture.html
[import]: https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_images.html
