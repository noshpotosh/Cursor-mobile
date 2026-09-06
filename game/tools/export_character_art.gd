extends SceneTree

const MANIFEST := "res://art-source/characters/nosh-motion.json"


func _initialize() -> void:
	var parsed: Variant = JSON.parse_string(
		FileAccess.get_file_as_string(MANIFEST)
	)
	if not _valid_manifest(parsed):
		_fail("Invalid character manifest")
		return
	var manifest: Dictionary = parsed
	var source := Image.load_from_file(manifest.source)
	var expected := Vector2i(manifest.source_size[0], manifest.source_size[1])
	if source == null or source.get_size() != expected:
		_fail("Character source missing or wrong dimensions")
		return
	if not source.detect_alpha():
		_fail("Character source needs transparency")
		return
	if not _valid_crops(manifest, expected):
		_fail("Character crop is outside the source")
		return

	var cell := Vector2i(manifest.cell_size[0], manifest.cell_size[1])
	var sheet := _pack_sheet(manifest, source, cell)
	if sheet.save_png(manifest.sheet) != OK:
		_fail("Could not save character sheet")
		return
	_save_frames(manifest, cell)


func _valid_manifest(value: Variant) -> bool:
	if not value is Dictionary:
		return false
	for key in ["source", "sheet", "resource"]:
		if not value.get(key) is String:
			return false
	for key in ["source_size", "cell_size", "pivot"]:
		if not value.get(key) is Array or value[key].size() != 2:
			return false
		for number in value[key]:
			if not _positive_number(number) or number != int(number):
				return false
	if not _positive_number(value.get("scale_divisor")):
		return false
	if not _positive_number(value.get("frames_per_second")):
		return false
	return _valid_animations(value)


func _valid_animations(manifest: Dictionary) -> bool:
	var crops: Variant = manifest.get("crops")
	var animations: Variant = manifest.get("animations")
	if not crops is Array or crops.is_empty():
		return false
	if not animations is Dictionary or animations.is_empty():
		return false
	for name in animations:
		if not animations[name] is Array or animations[name].is_empty():
			return false
		for index in animations[name]:
			if not (index is float or index is int):
				return false
			if index != int(index) or index < 0 or index >= crops.size():
				return false
	return true


func _positive_number(value: Variant) -> bool:
	return (value is float or value is int) and value > 0


func _valid_crops(manifest: Dictionary, source_size: Vector2i) -> bool:
	var bounds := Rect2i(Vector2i.ZERO, source_size)
	var cell: Array = manifest.cell_size
	var divisor: float = manifest.scale_divisor
	for crop in manifest.crops:
		if not crop is Array or crop.size() != 4:
			return false
		for value in crop:
			if not (value is float or value is int) or value != int(value):
				return false
		var rect := Rect2i(crop[0], crop[1], crop[2], crop[3])
		if not rect.has_area() or not bounds.encloses(rect):
			return false
		var size := Vector2(rect.size) / divisor
		if size.x > cell[0] or size.y > cell[1]:
			return false
		if size.x < 1 or size.y < 1:
			return false
	return true


func _pack_sheet(
	manifest: Dictionary, source: Image, cell: Vector2i
) -> Image:
	var sheet := Image.create(
		cell.x * manifest.crops.size(), cell.y, false, Image.FORMAT_RGBA8
	)
	for index in manifest.crops.size():
		var crop: Array = manifest.crops[index]
		var frame := source.get_region(
			Rect2i(crop[0], crop[1], crop[2], crop[3])
		)
		frame.resize(
			crop[2] / manifest.scale_divisor,
			crop[3] / manifest.scale_divisor,
			Image.INTERPOLATE_NEAREST
		)
		var offset := Vector2i(
			index * cell.x + (cell.x - frame.get_width()) / 2, 0
		)
		sheet.blit_rect(frame, Rect2i(Vector2i.ZERO, frame.get_size()), offset)
	return sheet


func _save_frames(manifest: Dictionary, cell: Vector2i) -> void:
	# A path reference keeps the native resource linked to the PNG import.
	var texture := ImageTexture.new()
	texture.resource_path = manifest.sheet
	texture.set_id_for_path(manifest.resource, "NoshSheet")
	var frames := SpriteFrames.new()
	frames.remove_animation("default")
	frames.set_meta("foot_pivot", Vector2(manifest.pivot[0], manifest.pivot[1]))
	for animation in manifest.animations:
		frames.add_animation(animation)
		frames.set_animation_speed(animation, manifest.frames_per_second)
		frames.set_animation_loop(animation, animation == "run")
		for index in manifest.animations[animation]:
			var frame := AtlasTexture.new()
			frame.resource_scene_unique_id = "NoshFrame%d" % index
			frame.atlas = texture
			frame.region = Rect2(index * cell.x, 0, cell.x, cell.y)
			frame.filter_clip = true
			frames.add_frame(animation, frame)
	if ResourceSaver.save(frames, manifest.resource) != OK:
		_fail("Could not save SpriteFrames")
		return
	print("CHARACTER_ART_OK")
	quit()


func _fail(message: String) -> void:
	push_error(message)
	quit(1)
