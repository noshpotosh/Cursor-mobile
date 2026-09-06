extends SceneTree

const RUNTIME_ROOTS := ["res://scripts", "res://scenes", "res://assets"]
const REFERENCE_PATHS := [
	"res://art-source/", "office/assets/", "/reference/",
	"/_screenshot-crops/", "/_pixellab-attempts/",
]

var _failures := 0
var _texture_count := 0


func _init() -> void:
	for directory in RUNTIME_ROOTS:
		_check_directory(directory)
	_check(
		ProjectSettings.get_setting(
			"rendering/textures/canvas_textures/default_texture_filter"
		) == 0,
		"Project must default to nearest texture filtering"
	)
	if _failures == 0:
		print("ART_OK: %d textures checked" % _texture_count)
	quit(0 if _failures == 0 else 1)


func _check_directory(path: String) -> void:
	if FileAccess.file_exists(path.path_join(".gdignore")):
		return
	for directory in DirAccess.get_directories_at(path):
		_check_directory(path.path_join(directory))
	for filename in DirAccess.get_files_at(path):
		_check_file(path.path_join(filename))


func _check_file(path: String) -> void:
	var extension := path.get_extension()
	if extension == "png":
		_check_import(path)
	if extension in ["gd", "tscn", "tres"]:
		_check_references(path)
	if extension == "tres":
		_check_resource(load(path), path)
	if path.ends_with("-atlas.json"):
		_check_catalog(path)


func _check_import(path: String) -> void:
	_texture_count += 1
	var settings := ConfigFile.new()
	if settings.load(path + ".import") != OK:
		_check(false, "%s: missing import; run editor import first" % path)
		return
	_check(
		settings.get_value("params", "compress/mode", -1) == 0,
		"%s: use lossless compression" % path
	)
	_check(
		settings.get_value("params", "mipmaps/generate", true) == false,
		"%s: disable mipmaps" % path
	)
	_check(
		settings.get_value("params", "process/size_limit", -1) == 0,
		"%s: disable import size limit" % path
	)
	var texture := load(path) as Texture2D
	_check(texture != null, "%s: texture cannot load" % path)


func _check_references(path: String) -> void:
	var source := FileAccess.get_file_as_string(path)
	for forbidden_path in REFERENCE_PATHS:
		_check(
			not source.contains(forbidden_path),
			"%s: runtime depends on source/reference art" % path
		)


func _check_resource(resource: Resource, path: String) -> void:
	_check(resource != null, "%s: cannot load resource" % path)
	if resource is AtlasTexture:
		_check_atlas(resource, path)
	if resource is SpriteFrames:
		_check_animation(resource, path)
	if resource is StyleBoxTexture:
		_check_style(resource, path)


func _check_atlas(atlas: AtlasTexture, path: String) -> void:
	if atlas.atlas == null:
		_check(false, "%s: missing atlas texture" % path)
		return
	var bounds := Rect2(Vector2.ZERO, atlas.atlas.get_size())
	_check(
		atlas.region.has_area() and bounds.encloses(atlas.region),
		"%s: atlas region outside texture" % path
	)
	_check(atlas.filter_clip, "%s: enable atlas filter_clip" % path)


func _check_animation(frames: SpriteFrames, path: String) -> void:
	for animation in frames.get_animation_names():
		var count := frames.get_frame_count(animation)
		_check(count > 0, "%s: empty animation %s" % [path, animation])
		_check(
			frames.get_animation_speed(animation) > 0,
			"%s: animation speed must be positive" % path
		)
		for frame in count:
			var texture := frames.get_frame_texture(animation, frame)
			_check(texture is AtlasTexture, "%s: expected sheet frame" % path)
			if texture is AtlasTexture:
				_check_atlas(texture, path)


func _check_style(style: StyleBoxTexture, path: String) -> void:
	if style.texture == null:
		_check(false, "%s: missing nine-slice texture" % path)
		return
	var bounds := Rect2(Vector2.ZERO, style.texture.get_size())
	_check(
		bounds.encloses(style.region_rect),
		"%s: nine-slice region outside texture" % path
	)


func _check_catalog(path: String) -> void:
	var catalog: Variant = JSON.parse_string(
		FileAccess.get_file_as_string(path)
	)
	if not catalog is Dictionary:
		_check(false, "%s: invalid atlas catalog" % path)
		return
	for section in catalog.values():
		_check_catalog_section(section, path)


func _check_catalog_section(section: Dictionary, path: String) -> void:
	var texture_path := path.get_base_dir().path_join(section.texture)
	var texture := load(texture_path) as Texture2D
	if texture == null:
		_check(false, "%s: missing catalog texture" % path)
		return
	var bounds := Rect2(Vector2.ZERO, texture.get_size())
	for name in section.regions:
		var values: Array = section.regions[name]
		if values.size() != 4:
			_check(false, "%s: invalid region %s" % [path, name])
			continue
		var region := Rect2(values[0], values[1], values[2], values[3])
		_check(
			region.has_area() and bounds.encloses(region),
			"%s: %s region outside atlas" % [path, name]
		)


func _check(passed: bool, message: String) -> void:
	if passed:
		return
	_failures += 1
	push_error("ART_FAIL: " + message)
