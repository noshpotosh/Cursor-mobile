extends CanvasLayer

const Art = preload("res://scripts/desktop_art.gd")
const Directory = preload("res://scripts/desktop_directory.gd")
const WALLPAPER = preload("res://assets/ui/wallpaper-tile.png")
const WINDOW_BOUNDS := Rect2(318, 36, 910, 538)
const MAXIMIZED_BOUNDS := Rect2(8, 8, 1264, 596)
const TASKBAR_TOP := 614
const WINDOW_PAPER_INSET := Vector2(10, 70)
const WINDOW_PAPER_PADDING := Vector2(20, 84)
const DIRECTORY_WIDTH := 890
const TEAMS_CONTENT_INSET := Vector2(24, 30)
const WINDOW_CONTROLS_RIGHT_INSET := 180
const WINDOW_CONTROL_SPACING := 56

var _company_bucks := 0
var _loft_chrome: Control
var _bucks_label: Label
var _desktop: Control
var _app_window: Control
var _window_paper: Panel
var _window_buttons: Array[Button] = []
var _window_title: Label
var _window_icon: TextureRect
var _directory: Control
var _teams: Control
var _clock: Label
var _maximized := false


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
	Art.panel(_loft_chrome, Rect2(1096, 14, 160, 34), "button")
	_bucks_label = Art.label(
		_loft_chrome, "", Rect2(1096, 14, 160, 34),
		18, Color("e6b765")
	)
	_bucks_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER


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
	_app_window = Art.panel(_desktop, WINDOW_BOUNDS, "window")
	_app_window.name = "AppWindow"
	_app_window.mouse_filter = Control.MOUSE_FILTER_STOP
	_window_paper = Art.panel(
		_app_window, Rect2(
			WINDOW_PAPER_INSET, WINDOW_BOUNDS.size - WINDOW_PAPER_PADDING
		), "paper"
	)
	_window_icon = Art.icon(_app_window, "book", Rect2(24, 18, 48, 40))
	_window_title = Art.label(
		_app_window, "Employee Directory", Rect2(86, 14, 650, 50),
		38, Art.PAPER
	)
	_window_control("−", 0, _close_app_window, "Minimize")
	_window_control("□", 1, _toggle_maximize, "Maximize / restore")
	_window_control("×", 2, _close_app_window, "Close")
	_directory = Directory.new()
	_directory.name = "Directory"
	_directory.position = WINDOW_PAPER_INSET
	_app_window.add_child(_directory)
	_teams = Control.new()
	_teams.position = WINDOW_PAPER_INSET + TEAMS_CONTENT_INSET
	_app_window.add_child(_teams)
	Art.label(_teams, "Teams", Rect2(0, 0, 820, 60), 44)
	Art.label(
		_teams, "Your studio's conversations will live here.\n"
			+ "Messaging is not connected in this loft preview.",
		Rect2(0, 84, 820, 170), 30
	)


func _window_control(
	caption: String, index: int, action: Callable, hint: String
) -> void:
	var controls_left := WINDOW_BOUNDS.size.x - WINDOW_CONTROLS_RIGHT_INSET
	var left := controls_left + index * WINDOW_CONTROL_SPACING
	var button := Art.button(
		_app_window, caption, Rect2(left, 16, 48, 48), action,
		"button", 38
	)
	button.tooltip_text = hint
	_window_buttons.append(button)


func _toggle_maximize() -> void:
	_maximized = not _maximized
	var bounds := MAXIMIZED_BOUNDS if _maximized else WINDOW_BOUNDS
	_app_window.position = bounds.position
	_app_window.size = bounds.size
	_window_paper.size = bounds.size - WINDOW_PAPER_PADDING
	_directory.position.x = (bounds.size.x - DIRECTORY_WIDTH) / 2
	_teams.position.x = _directory.position.x + TEAMS_CONTENT_INSET.x
	var controls_left := bounds.size.x - WINDOW_CONTROLS_RIGHT_INSET
	for index in _window_buttons.size():
		var spacing := index * WINDOW_CONTROL_SPACING
		_window_buttons[index].position.x = controls_left + spacing


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
