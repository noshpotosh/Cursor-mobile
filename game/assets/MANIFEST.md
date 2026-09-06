# Godot runtime art manifest

All runtime paths are relative to `game/assets/`; the game never loads the
parked office project. Preserve source, export, import settings, and runtime
consumer together when changing art.

## Character animation

- `characters/nosh-motion.png`: 384×96 RGBA sheet; eight 48×96 cells.
- `characters/nosh-frames.tres`: native SpriteFrames; idle cell 0, run cells
  1–6 at 10 fps, looping. Cell 7 is an unused alternate idle.
- Origin: foot pivot `(24,74)` in each cell. One authored left-facing view,
  mirrored for rightward travel. Six changing limb poses; no four-view claim.
- Source: `art-source/characters/nosh-motion-source.png`, generated from
  Nosh's accepted amber-hoodie appearance. Original RGBA retained unchanged.
- Measured crops/export settings: `art-source/characters/nosh-motion.json`.
- Tool and full prompts: `art-source/characters/nosh-provenance.md`.
- Export: `tools/export_character_art.gd`; consumer: `scripts/player_actor.gd`.

## Desktop OS

- `ui/desktop-symbols.png`: 520×40 atlas; thirteen 40×40 cells, in order:
  Teams, Directory, loft, book, search, person, people, building, star,
  available, chevron, Wi-Fi, sound.
- `ui/desktop-theme.png`: 160×32 atlas; five 32×32 nine-slice cells, in order:
  window, paper, selected, button, input. Default border margin is 5 native
  pixels; window overrides it to 10. `ui/desktop-atlas.json` owns texture
  paths, named regions, and margins consumed by `desktop_art.gd`.
- `ui/wallpaper-tile.png`: seamless 80×80 cream diamond wallpaper.
- Editable pixel SVG source: `art-source/ui/`. Existing Teams, Directory,
  loft, and wallpaper art originated in the accepted `office/assets/ui/`
  SVG kit; theme and supporting symbols are newly authored for Godot.
- Export: `tools/export_desktop_art.gd`; named regions and styles:
  `scripts/desktop_art.gd`. UI consumers: `desk_hud.gd`, `desktop_directory.gd`.
- `characters/crew-portraits.png`: accepted 1536×1024 crew portrait atlas,
  copied unchanged from `office/assets/characters/crew-portraits.png`.
  Six 512×512 cells: Nosh, Fabrizio, Maeve / Dex, Cal, Reed.
  Maeve's accepted ponytail portrait differs from the reference mock's hair.
- `fonts/pixelify-sans.ttf`: bundled from the office kit under the adjacent
  SIL Open Font License (`fonts/OFL.txt`). No remote font dependency.

The comparison reference is `office/assets/reference/desk-desktop-os-mock.png`.
The desktop is composed from live Controls and separate art. The screenshot
and its fragments are never runtime textures. Text, clock, search, employee
selection, and window controls remain live; Teams messaging is not connected.

## Existing world art

- `tiles/floor-carpet.png` and `floor-wood-border.png`: authored 64×32
  diamonds in the art-direction carpet/clay/ink palette; displayed 1:1.
- `furniture/desk-crt.png`: 1254×1254 accepted office atlas; desk region
  `[140,167,983,934]`, displayed 98×94.
- `furniture/loft-props.png`: 1536×1024 accepted office atlas; chair region
  `[138,570,291,415]`, displayed 31×43.
- Consumer: `scripts/loft_world.gd`; legacy furniture regions remain in
  `scripts/atlas_sprites.gd`.
- `characters/crew-idle.png`: 1536×1024 accepted office crew atlas, retained
  as Nosh's identity reference. The player now consumes the motion sheet.

The older world atlases were accepted for the first vertical slice. Their
large-image-to-small-sprite scaling remains known pixel-density debt, not a
pattern to copy when authoring new assets.
