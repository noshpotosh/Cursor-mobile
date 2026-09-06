#!/usr/bin/env bash
set -euo pipefail

game_directory="$(cd "$(dirname "$0")/.." && pwd)"
godot_binary="${GODOT_BIN:-godot}"

"$godot_binary" --headless --path "$game_directory" \
  --script res://tools/export_desktop_art.gd
"$godot_binary" --headless --path "$game_directory" \
  --script res://tools/export_character_art.gd
"$godot_binary" --headless --path "$game_directory" --editor --quit
"$godot_binary" --headless --path "$game_directory" \
  --script res://tools/validate_art.gd
