extends CanvasLayer

const Art = preload("res://scripts/desktop_art.gd")
const Directory = preload("res://scripts/desktop_directory.gd")
const WALLPAPER = preload("res://assets/ui/wallpaper-tile.png")
const WINDOW_BOUNDS := Rect2(150, 36, 980, 538)
const MAXIMIZED_BOUNDS := Rect2(8, 8, 1264, 596)
const TASKBAR_TOP := 614
const DIRECTORY_WIDTH := 890
const TEAMS_CONTENT_INSET := Vector2(24, 30)
const BUCKS_CHIP_BOUNDS := Rect2(1070, 14, 186, 48)
const WINDOW_CONTROL_HIT := Vector2(40, 40)
const WINDOW_CONTROL_HINTS := [
	"Minimize", "Maximize / restore", "Close",
]

var _company_bucks := 0
var _loft_chrome: Control
var _bucks_label: Label
var _desktop: Control
var _app_window: Control
var _window_buttons: Array[Button] = []
var _window_title: Label
var _window_icon: TextureRect
var _directory: Control
var _teams: Control
var _clock: Label
var _maximized := false
var _inset_left: float = Art.atlas.window_chrome.content_insets[0]
var _inset_top: float = Art.atlas.window_chrome.content_insets[1]
var _inset_right: float = Art.atlas.window_chrome.content_insets[2]
var _chrome_size: Vector2 = Art.bounds("window_chrome", "frame").size
var _control_rects: Array = Art.atlas.window_chrome.controls


func _ready() -> void:
	_build_loft_chrome()
	_build_desktop_os()
	_desktop.visible = false
	_refresh_bucks_label()


func show_desk() -> void:
	_loft_chrome.visible = false
	_desktop.visible = true
	_open_directory_app()


func hide_desk() -> void:
	_desktop.visible = false
	_loft_chrome.visible = true


func is_open() -> bool:
	return _desktop != null and _desktop.visible


func set_company_bucks(amount: int) -> void:
	_company_bucks = amount
	_refresh_bucks_label()


func _process(_delta: float) -> void:
	if not is_open():
		return
	var now := Time.get_datetime_dict_from_system()
	var hour: int = now.hour % 12
	if hour == 0:
		hour = 12
	var period := "AM" if now.hour < 12 else "PM"
	_clock.text = "%d:%02d %s\n%02d / %02d / %d" % [
		hour, now.minute, period, now.month, now.day, now.year,
	]


func _input(event: InputEvent) -> void:
	if is_open() and event.is_action_pressed("ui_cancel"):
		hide_desk()
		get_viewport().set_input_as_handled()


func _build_loft_chrome() -> void:
	_loft_chrome = Control.new()
	_loft_chrome.name = "LoftChrome"
	_loft_chrome.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(_loft_chrome)
	Art.label(
		_loft_chrome, "◆  WAREWOLF · STARTER LOFT",
		Rect2(24, 18, 600, 32), 18, Art.PAPER
	)
	Art.texture_rect(
		_loft_chrome,
		Art.region(Art.bucks_chip, Art.bounds("bucks_chip", "chip")),
		BUCKS_CHIP_BOUNDS
	)
	_bucks_label = Art.label(
		_loft_chrome, "", BUCKS_CHIP_BOUNDS, 18, Art.BUCKS_GOLD
	)
	_bucks_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	_bucks_label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER


func _build_desktop_os() -> void:
	_desktop = Control.new()
	_desktop.name = "DesktopOs"
	_desktop.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	add_child(_desktop)
	var wallpaper := TextureRect.new()
	wallpaper.texture = WALLPAPER
	wallpaper.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	wallpaper.stretch_mode = TextureRect.STRETCH_TILE
	wallpaper.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	wallpaper.mouse_filter = Control.MOUSE_FILTER_IGNORE
	_desktop.add_child(wallpaper)
	_desktop_icon("Teams", "teams", Vector2(64, 54), _open_teams_app)
	_desktop_icon(
		"Directory", "directory", Vector2(64, 276),
		_open_directory_app
	)
	_build_app_window()
	_build_taskbar()


func _desktop_icon(
	caption: String, symbol: String, origin: Vector2, action: Callable
) -> void:
	var button := Art.button(
		_desktop, "", Rect2(origin - Vector2(16, 4), Vector2(152, 180)),
		action, "paper"
	)
	button.add_theme_stylebox_override("normal", StyleBoxEmpty.new())
	Art.icon(button, symbol, Rect2(16, 4, 120, 120))
	var width := 152 if caption == "Directory" else 120
	var left := 0 if caption == "Directory" else 16
	Art.panel(button, Rect2(left, 130, width, 48), "paper")
	var label := Art.label(
		button, caption, Rect2(left, 130, width, 48), 30
	)
	label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER


func _build_taskbar() -> void:
	var taskbar := Art.panel(
		_desktop, Rect2(0, TASKBAR_TOP, 1280, 106), "window"
	)
	var home := Art.button(
		taskbar, "", Rect2(16, 14, 82, 76), hide_desk
	)
	home.tooltip_text = "Leave desk (Esc)"
	Art.icon(home, "loft", Rect2(14, 10, 54, 54))
	_taskbar_app(taskbar, "Teams", "teams", 118, 160, _open_teams_app)
	_taskbar_app(
		taskbar, "Directory", "directory", 290, 192,
		_open_directory_app
	)
	Art.icon(taskbar, "chevron", Rect2(838, 30, 40, 40))
	Art.icon(taskbar, "wifi", Rect2(900, 28, 46, 46))
	Art.icon(taskbar, "sound", Rect2(972, 28, 46, 46))
	_clock = Art.label(
		taskbar, "", Rect2(1044, 12, 216, 84), 30, Art.PAPER
	)
	_clock.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER


func _taskbar_app(
	parent: Node, caption: String, symbol: String,
	left: int, width: int, action: Callable
) -> void:
	var button := Art.button(
		parent, "", Rect2(left, 14, width, 76), action
	)
	Art.icon(button, symbol, Rect2(12, 18, 40, 40))
	Art.label(
		button, caption, Rect2(60, 16, width - 66, 44), 24, Art.PAPER
	)


func _build_app_window() -> void:
	_app_window = Art.window_panel(_desktop, WINDOW_BOUNDS)
	_app_window.name = "AppWindow"
	_window_icon = Art.icon(
		_app_window, "book", Rect2(_inset_left, 10, 32, 28)
	)
	_window_title = Art.label(
		_app_window, "Employee Directory",
		Rect2(_inset_left + 40, 8, 520, 32), 28, Art.PAPER
	)
	_window_title.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	_window_control(0, _close_app_window)
	_window_control(1, _toggle_maximize)
	_window_control(2, _close_app_window)
	_directory = Directory.new()
	_directory.name = "Directory"
	_place_window_content(_directory, Vector2.ZERO)
	_app_window.add_child(_directory)
	_teams = Control.new()
	_place_window_content(_teams, TEAMS_CONTENT_INSET)
	_app_window.add_child(_teams)
	Art.label(_teams, "Teams", Rect2(0, 0, 820, 60), 44)
	Art.label(
		_teams, "Your studio's conversations will live here.\n"
			+ "Messaging is not connected in this loft preview.",
		Rect2(0, 84, 820, 170), 30
	)
	_layout_window_content(WINDOW_BOUNDS.size)


func _place_window_content(node: Control, extra_inset: Vector2) -> void:
	node.position = Vector2(
		_inset_left + extra_inset.x,
		_inset_top + extra_inset.y
	)


func _window_control(index: int, action: Callable) -> void:
	var hit := _control_hit_bounds(WINDOW_BOUNDS.size, index)
	var button := Art.invisible_button(
		_app_window, hit, action, WINDOW_CONTROL_HINTS[index]
	)
	_window_buttons.append(button)


func _control_hit_bounds(window_size: Vector2, index: int) -> Rect2:
	var native: Array = _control_rects[index]
	var native_rect := Rect2(
		native[0], native[1], native[2], native[3]
	)
	var from_right := _chrome_size.x - native_rect.position.x
	var center := Vector2(
		window_size.x - from_right + native_rect.size.x * 0.5,
		native_rect.position.y + native_rect.size.y * 0.5
	)
	return Rect2(center - WINDOW_CONTROL_HIT * 0.5, WINDOW_CONTROL_HIT)


func _toggle_maximize() -> void:
	_maximized = not _maximized
	var bounds := MAXIMIZED_BOUNDS if _maximized else WINDOW_BOUNDS
	_app_window.position = bounds.position
	_app_window.size = bounds.size
	_layout_window_content(bounds.size)
	for index in _window_buttons.size():
		var hit := _control_hit_bounds(bounds.size, index)
		_window_buttons[index].position = hit.position


func _layout_window_content(window_size: Vector2) -> void:
	var parchment_width: float = (
		window_size.x - _inset_left - _inset_right
	)
	var directory_left: float = (
		_inset_left + (parchment_width - DIRECTORY_WIDTH) / 2.0
	)
	_directory.position = Vector2(directory_left, _inset_top)
	_teams.position = _directory.position + TEAMS_CONTENT_INSET


func _open_teams_app() -> void:
	_window_title.text = "Teams"
	_window_icon.texture = Art.region(
		Art.symbols, Art.bounds("symbols", "teams")
	)
	_directory.visible = false
	_teams.visible = true
	_app_window.visible = true


func _open_directory_app() -> void:
	_window_title.text = "Employee Directory"
	_window_icon.texture = Art.region(
		Art.symbols, Art.bounds("symbols", "book")
	)
	_directory.visible = true
	_teams.visible = false
	_app_window.visible = true


func _close_app_window() -> void:
	_app_window.visible = false


func _refresh_bucks_label() -> void:
	if _bucks_label != null:
		_bucks_label.text = "%d bucks" % _company_bucks
