extends SceneTree

const EXPORTS := {
	"desktop-theme.svg": "desktop-theme.png",
	"desktop-symbols.svg": "desktop-symbols.png",
	"wallpaper.svg": "wallpaper-tile.png",
}


func _init() -> void:
	for source in EXPORTS:
		var source_path: String = "res://art-source/ui/" + source
		var image := Image.load_from_file(source_path)
		if image == null:
			push_error("Could not read desktop source: " + source_path)
			quit(1)
			return
		var output_path: String = "res://assets/ui/" + EXPORTS[source]
		if image.save_png(output_path) != OK:
			push_error("Could not export desktop art: " + output_path)
			quit(1)
			return
	print("DESKTOP_ART_OK")
	quit()
