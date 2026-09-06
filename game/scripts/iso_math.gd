# Iso grid helpers — same 2:1 math as the parked web loft.
class_name IsoMath
extends RefCounted

const TILE_WIDTH := 64
const TILE_HEIGHT := 32


static func grid_to_screen(grid_x: int, grid_y: int) -> Vector2:
	var screen_x := (grid_x - grid_y) * (TILE_WIDTH / 2.0)
	var screen_y := (grid_x + grid_y) * (TILE_HEIGHT / 2.0)
	return Vector2(screen_x, screen_y)


static func screen_to_grid(screen: Vector2) -> Vector2i:
	var half_w := TILE_WIDTH / 2.0
	var half_h := TILE_HEIGHT / 2.0
	var grid_x := (screen.x / half_w + screen.y / half_h) / 2.0
	var grid_y := (screen.y / half_h - screen.x / half_w) / 2.0
	return Vector2i(roundi(grid_x), roundi(grid_y))
