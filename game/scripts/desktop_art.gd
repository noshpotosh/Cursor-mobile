extends RefCounted

const FONT = preload("res://assets/fonts/pixelify-sans.ttf")
const INK := Color("302b20")
const PAPER := Color("f8edcf")
const BUCKS_GOLD := Color("e6b765")
static var atlas: Dictionary = JSON.parse_string(
	FileAccess.get_file_as_string("res://assets/ui/desktop-atlas.json")
)
static var symbols := load_texture("symbols")
static var chrome := load_texture("chrome")
static var bucks_chip := load_texture("bucks_chip")
static var window_chrome := load_texture("window_chrome")


static func load_texture(group: String) -> Texture2D:
	var filename: String = atlas[group].texture
	return load("res://assets/ui/".path_join(filename)) as Texture2D


static func bounds(group: String, name: String) -> Rect2:
	var values: Array = atlas[group].regions[name]
	return Rect2(values[0], values[1], values[2], values[3])


static func region(texture: Texture2D, bounds: Rect2) -> AtlasTexture:
	var result := AtlasTexture.new()
	result.atlas = texture
	result.region = bounds
	result.filter_clip = true
	return result


static func style(kind: String) -> StyleBoxTexture:
	var box := StyleBoxTexture.new()
	box.texture = region(chrome, bounds("chrome", kind))
	var chrome_settings: Dictionary = atlas.chrome
	var margins: Array = chrome_settings.margin_overrides.get(
		kind, chrome_settings.nine_slice_margins
	)
	for side in 4:
		box.set_texture_margin(side, margins[side])
	box.set_content_margin_all(4)
	return box


static func window_chrome_style() -> StyleBoxTexture:
	var settings: Dictionary = atlas.window_chrome
	var box := StyleBoxTexture.new()
	box.texture = region(window_chrome, bounds("window_chrome", "frame"))
	var margins: Array = settings.nine_slice_margins
	for side in 4:
		box.set_texture_margin(side, margins[side])
	var insets: Array = settings.content_insets
	box.content_margin_left = insets[0]
	box.content_margin_top = insets[1]
	box.content_margin_right = insets[2]
	box.content_margin_bottom = insets[3]
	return box


static func panel(parent: Node, bounds: Rect2, kind: String) -> Panel:
	var result := Panel.new()
	result.position = bounds.position
	result.size = bounds.size
	result.add_theme_stylebox_override("panel", style(kind))
	result.mouse_filter = Control.MOUSE_FILTER_IGNORE
	parent.add_child(result)
	return result


static func window_panel(parent: Node, bounds: Rect2) -> Panel:
	var result := Panel.new()
	result.position = bounds.position
	result.size = bounds.size
	result.add_theme_stylebox_override("panel", window_chrome_style())
	result.mouse_filter = Control.MOUSE_FILTER_STOP
	parent.add_child(result)
	return result


static func texture_rect(
	parent: Node, texture: Texture2D, bounds: Rect2
) -> TextureRect:
	var result := TextureRect.new()
	result.texture = texture
	result.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	result.stretch_mode = TextureRect.STRETCH_SCALE
	result.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	result.position = bounds.position
	result.size = bounds.size
	result.mouse_filter = Control.MOUSE_FILTER_IGNORE
	parent.add_child(result)
	return result


static func label(
	parent: Node, text: String, bounds: Rect2,
	font_size: int = 28, color: Color = INK
) -> Label:
	var result := Label.new()
	result.text = text
	result.clip_text = true
	result.position = bounds.position
	result.size = bounds.size
	result.add_theme_font_override("font", FONT)
	result.add_theme_font_size_override("font_size", font_size)
	result.add_theme_color_override("font_color", color)
	result.mouse_filter = Control.MOUSE_FILTER_IGNORE
	parent.add_child(result)
	return result


static func icon(parent: Node, name: String, bounds: Rect2) -> TextureRect:
	var result := TextureRect.new()
	result.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	result.texture = region(symbols, bounds("symbols", name))
	result.position = bounds.position
	result.size = bounds.size
	result.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	result.mouse_filter = Control.MOUSE_FILTER_IGNORE
	parent.add_child(result)
	return result


static func button(
	parent: Node, text: String, bounds: Rect2, action: Callable,
	kind: String = "button", font_size: int = 28
) -> Button:
	var result := Button.new()
	result.text = text
	result.clip_text = true
	result.position = bounds.position
	result.size = bounds.size
	result.add_theme_font_override("font", FONT)
	result.add_theme_font_size_override("font_size", font_size)
	var text_color := PAPER if kind == "button" else INK
	result.add_theme_color_override("font_color", text_color)
	result.add_theme_color_override("font_hover_color", INK)
	result.add_theme_color_override("font_pressed_color", INK)
	result.add_theme_stylebox_override("normal", style(kind))
	result.add_theme_stylebox_override("hover", style("selected"))
	result.add_theme_stylebox_override("pressed", style("selected"))
	result.pressed.connect(action)
	parent.add_child(result)
	return result


static func invisible_button(
	parent: Node, bounds: Rect2, action: Callable, hint: String
) -> Button:
	var result := Button.new()
	result.text = ""
	result.position = bounds.position
	result.size = bounds.size
	result.tooltip_text = hint
	result.add_theme_stylebox_override("normal", StyleBoxEmpty.new())
	result.add_theme_stylebox_override("hover", StyleBoxEmpty.new())
	result.add_theme_stylebox_override("pressed", StyleBoxEmpty.new())
	result.add_theme_stylebox_override("focus", StyleBoxEmpty.new())
	result.pressed.connect(action)
	parent.add_child(result)
	return result
