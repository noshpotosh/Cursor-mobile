# Godot runtime art manifest

Contributor workflow: [Godot asset pipeline](../../docs/game-asset-pipeline.md).
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
  available, chevron, Wi-Fi, sound. Teams and Directory cells are PixelLab
  pixen stamps (`art-source/ui/icons/`); remaining cells stay SVG-authored.
- `ui/desktop-theme.png`: 160×32 atlas; five 32×32 nine-slice cells, in order:
  window, paper, selected, button, input. Default border margin is 5 native
  pixels; window overrides it to 10. Used for buttons, paper panels, and
  Directory chrome — not the main app window frame or taskbar.
- `ui/bucks-chip.png`: cropped PixelLab loft bucks plate (298×77). Live
  Label shows `"%d bucks"`; HUD displays it at 186×48.
- `ui/window-chrome.png`: cropped PixelLab app window frame (276×211).
  Nine-slice margins `[19,40,71,15]` keep the title-bar control cluster
  fixed on the right. Matching content insets place Directory / Teams on
  the parchment without covering that right strip. Live transparent
  hit-targets cover the orange controls; title and icon stay live.
- `ui/taskbar.png`: cropped PixelLab desk taskbar (483×161). Nine-slice
  margins `[16,10,16,10]`; displayed at `Rect2(0, 614, 1280, 106)`. Idle
  bar only — loft/home, app captions, tray icons, and clock stay live.
- `ui/desktop-atlas.json` owns texture paths, named regions, margins,
  content insets, and control rects for `desktop_art.gd`.
- `ui/wallpaper-tile.png`: seamless 80×80 cream diamond wallpaper.
- Editable pixel SVG source: `art-source/ui/` for symbols/theme/wallpaper.
  PixelLab panel sources: `bucks-chip-source.png`,
  `window-chrome-source.png`, `taskbar-source.png` with
  `pixellab-ui-provenance.md`.
- Export: `tools/export_desktop_art.gd` (SVG rasterize + opaque crop for
  PixelLab panels); named regions and styles: `scripts/desktop_art.gd`.
  UI consumers: `desk_hud.gd`, `desktop_directory.gd`.
- `characters/crew-portraits.png`: accepted 1536×1024 crew portrait atlas,
  copied unchanged from `office/assets/characters/crew-portraits.png`.
  Six 512×512 cells: Nosh, Fabrizio, Maeve / Dex, Cal, Reed.
  Maeve's accepted ponytail portrait differs from the reference mock's hair.
- `fonts/pixelify-sans.ttf`: bundled from the office kit under the adjacent
  SIL Open Font License (`fonts/OFL.txt`). No remote font dependency.

The comparison reference is `office/assets/reference/desk-desktop-os-mock.png`.
Runtime app-window chrome intentionally drifts from that mock to the
PixelLab frame. The desktop is composed from live Controls and separate
art. Screenshots and fragments are never runtime textures. Text, clock,
search, employee selection, and window controls remain live; Teams
messaging is not connected.

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
