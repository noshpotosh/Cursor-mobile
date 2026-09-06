extends SceneTree

const SVG_EXPORTS := {
	"desktop-theme.svg": "desktop-theme.png",
	"desktop-symbols.svg": "desktop-symbols.png",
	"wallpaper.svg": "wallpaper-tile.png",
}

const PANEL_EXPORTS := {
	"bucks-chip-source.png": "bucks-chip.png",
	"window-chrome-source.png": "window-chrome.png",
	"taskbar-source.png": "taskbar.png",
}

const SYMBOL_ICON_STAMPS := {
	0: "icons/teams.png",
	1: "icons/directory.png",
}
const SYMBOL_CELL := 40


func _init() -> void:
	for source in SVG_EXPORTS:
		if not _export_svg(source, SVG_EXPORTS[source]):
			quit(1)
			return
	if not _stamp_symbol_icons():
		quit(1)
		return
	for source in PANEL_EXPORTS:
		if not _export_cropped_panel(source, PANEL_EXPORTS[source]):
			quit(1)
			return
	print("DESKTOP_ART_OK")
	quit()


func _export_svg(source: String, output_name: String) -> bool:
	var source_path := "res://art-source/ui/" + source
	var image := Image.load_from_file(source_path)
	if image == null:
		push_error("Could not read desktop source: " + source_path)
		return false
	var output_path := "res://assets/ui/" + output_name
	if image.save_png(output_path) != OK:
		push_error("Could not export desktop art: " + output_path)
		return false
	return true


func _stamp_symbol_icons() -> bool:
	var atlas_path := "res://assets/ui/desktop-symbols.png"
	var atlas := Image.load_from_file(atlas_path)
	if atlas == null:
		push_error("Could not read symbols atlas: " + atlas_path)
		return false
	for cell in SYMBOL_ICON_STAMPS:
		var icon_path: String = (
			"res://art-source/ui/" + SYMBOL_ICON_STAMPS[cell]
		)
		var icon := Image.load_from_file(icon_path)
		if icon == null:
			push_error("Could not read symbol icon: " + icon_path)
			return false
		if icon.get_width() != SYMBOL_CELL or icon.get_height() != SYMBOL_CELL:
			push_error("Symbol icon must be 40x40: " + icon_path)
			return false
		atlas.blit_rect(
			icon,
			Rect2i(0, 0, SYMBOL_CELL, SYMBOL_CELL),
			Vector2i(cell * SYMBOL_CELL, 0)
		)
	if atlas.save_png(atlas_path) != OK:
		push_error("Could not save stamped symbols atlas")
		return false
	return true


func _export_cropped_panel(source: String, output_name: String) -> bool:
	var source_path := "res://art-source/ui/" + source
	var image := Image.load_from_file(source_path)
	if image == null:
		push_error("Could not read UI panel source: " + source_path)
		return false
	var crop := _opaque_bounds(image)
	if crop.size.x <= 0 or crop.size.y <= 0:
		push_error("UI panel has no opaque pixels: " + source_path)
		return false
	var cropped := image.get_region(crop)
	var output_path := "res://assets/ui/" + output_name
	if cropped.save_png(output_path) != OK:
		push_error("Could not export UI panel: " + output_path)
		return false
	return true


func _opaque_bounds(image: Image) -> Rect2i:
	var width := image.get_width()
	var height := image.get_height()
	var min_x := width
	var min_y := height
	var max_x := -1
	var max_y := -1
	for y in height:
		for x in width:
			var color := image.get_pixel(x, y)
			if color.a < 0.03:
				continue
			if color.r + color.g + color.b < 0.04:
				continue
			min_x = mini(min_x, x)
			min_y = mini(min_y, y)
			max_x = maxi(max_x, x)
			max_y = maxi(max_y, y)
	if max_x < min_x:
		return Rect2i()
	return Rect2i(min_x, min_y, max_x - min_x + 1, max_y - min_y + 1)
