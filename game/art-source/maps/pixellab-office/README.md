# PixelLab starter office map art (128px)

Created 2026-09-06 via PixelLab MCP under
[ADR 010](../../../../docs/decisions/010-128px-world-art-standard.md).

Style references: office furniture-kit / tile mockups plus pixel-doubled
prior loft diamonds. PixelLab Map Workshop is square top-down only; this
loft is assembled in Godot from isometric tiles + 1-direction props.

No network call is required to rebuild runtime PNGs from this folder.

## Floor tiles

| Runtime | Source pick | PixelLab id |
| --- | --- | --- |
| `assets/tiles/floor-carpet.png` | `tiles/tile_0.png` | `6447bc3d-268a-444a-b67d-ee68a6288454` |
| `assets/tiles/floor-wood-border.png` | `tiles/tile_3.png` | same pack |

Size: **128×64** diamonds.

## Furniture props (128×128)

| Runtime | PixelLab object id |
| --- | --- |
| `furniture/desk-basic.png` | `55105992-9a47-40df-ba14-cd5e87b55601` |
| `furniture/chair-basic.png` | `a34a9b06-26e3-47bb-82ed-a359721aca06` |
| `furniture/monitor-crt.png` | `d59ab698-853f-4201-93ab-9c8252d2390f` |
| `furniture/bubbler.png` | `188eca89-3dec-4d05-ae40-eeda159063e8` |
| `furniture/coffee-station.png` | `78b4c8d9-b917-4e38-8758-bdfb840ccebd` |
| `furniture/whiteboard.png` | `5c18640f-4dcf-4de8-b782-9080729d20ad` |
| `furniture/desk-with-monitor.png` | local composite of desk + scaled CRT |

Tagged `warewolf-office-128` in PixelLab.
