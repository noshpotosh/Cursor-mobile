# PixelLab desk UI panels

Downloaded 2026-09-06 for the loft desk HUD. Full transparent
padding is kept in the `*-source.png` files; `export_desktop_art.gd`
crops to opaque content for runtime.

| Runtime | PixelLab name / job | Asset id | Source size |
| --- | --- | --- | --- |
| `bucks-chip.png` | `warewolf-bucks-chip` | `7b389af3-65f0-4b94-9987-3ffde04fdde1` | 512×192 |
| `window-chrome.png` | `warewolf-desktop-window-chrome` | `7c3cc0d8-c799-4372-b7e2-abff9d481c9b` | 320×256 |
| `taskbar.png` | `warewolf-desktop-taskbar` | `a29d1066-b2dd-448e-942f-654ac4cf2f67` | 512×192 |
| `desktop-symbols.png` cell `teams` | pixen `icons/teams.png` | `1a795064-d81f-462b-910f-826c56858712` | 40×40 |
| `desktop-symbols.png` cell `directory` | pixen `icons/directory.png` | `f3676859-4678-46cc-852e-845b012f843c` | 40×40 |

Rejected: Teams pixen `1b98a2a1-36c3-45ca-87ef-b60550d48a50` (purple badge).

Export stamps `art-source/ui/icons/{teams,directory}.png` into atlas
cells 0 and 1 after rasterizing `desktop-symbols.svg`. No network call
is required to rebuild. Regeneration is an art revision, not a
deterministic export step.
