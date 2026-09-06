extends Control

const Art = preload("res://scripts/desktop_art.gd")
const PORTRAITS = preload("res://assets/characters/crew-portraits.png")
const PORTRAIT_CELL_SIZE := Vector2(512, 512)
const STAFF := [
	{
		"name": "Maeve Quinn", "role": "Product and design",
		"portrait": Vector2(2, 0),
		"about": "I design and build tools that help teams "
			+ "collaborate and create. Big fan of clear "
			+ "communication, good coffee, and isometric floor plans.",
	},
	{
		"name": "Nosh", "role": "Co-founder",
		"portrait": Vector2(0, 0),
		"about": "Keeps the pack honest and the product moving.",
	},
	{
		"name": "Fabrizio Cortell", "role": "Co-founder and planner",
		"portrait": Vector2(1, 0),
		"about": "Vets ideas, coordinates the crew, and keeps it 100.",
	},
	{
		"name": "Dex Harlan", "role": "Lead builder",
		"portrait": Vector2(0, 1),
		"about": "Ships working software. Obsessed with readable code.",
	},
	{
		"name": "Cal Rook", "role": "Adversarial verifier",
		"portrait": Vector2(1, 1),
		"about": "Breaks builds on purpose. Evidence over vibes.",
	},
	{
		"name": "Reed Mallory", "role": "Readability editor",
		"portrait": Vector2(2, 1),
		"about": "Final clarity gate. Treats diffs like manuscripts.",
	},
]

var _profile: Control
var _results: Control
var _search: LineEdit
var _favorite_index := -1
var _selected := 0


func _ready() -> void:
	_build_sidebar()
	_profile = Control.new()
	_profile.position = Vector2(284, 10)
	_profile.size = Vector2(596, 432)
	add_child(_profile)
	_results = Control.new()
	_results.position = _profile.position
	_results.size = _profile.size
	add_child(_results)
	_show_profile(0)


func _build_sidebar() -> void:
	var divider := ColorRect.new()
	divider.color = Color("b8a27a")
	divider.position = Vector2(272, 0)
	divider.size = Vector2(2, 450)
	add_child(divider)
	Art.icon(self, "search", Rect2(22, 14, 36, 36))
	Art.label(self, "Directory", Rect2(74, 8, 190, 50), 32)
	_search = LineEdit.new()
	_search.position = Vector2(14, 72)
	_search.size = Vector2(248, 50)
	_search.placeholder_text = "Search people..."
	_search.add_theme_font_override("font", Art.FONT)
	_search.add_theme_font_size_override("font_size", 25)
	_search.add_theme_color_override("font_color", Art.INK)
	_search.add_theme_color_override("font_placeholder_color", Art.INK)
	_search.add_theme_stylebox_override("normal", Art.style("input"))
	_search.add_theme_stylebox_override("focus", Art.style("selected"))
	_search.text_changed.connect(_search_people)
	add_child(_search)
	_sidebar_item("All Employees", "person", 140, _show_people, true)
	_sidebar_item("Teams", "people", 198, _show_teams)
	_sidebar_item("Locations", "building", 254, _show_locations)
	_sidebar_item("Favorites", "star", 310, _show_favorites)


func _sidebar_item(
	text: String, symbol: String, top: int, action: Callable,
	selected: bool = false
) -> void:
	var button := Art.button(
		self, "", Rect2(10, top, 258, 56), action, "selected"
	)
	if not selected:
		button.add_theme_stylebox_override("normal", StyleBoxEmpty.new())
	Art.icon(button, symbol, Rect2(14, 10, 34, 34))
	Art.label(button, text, Rect2(64, 4, 185, 48), 28)


func _clear(control: Control) -> void:
	for child in control.get_children():
		control.remove_child(child)
		child.queue_free()


func _show_profile(index: int) -> void:
	_selected = index
	_results.visible = false
	_profile.visible = true
	_clear(_profile)
	Art.panel(_profile, Rect2(0, 0, 596, 432), "paper")
	var staff: Dictionary = STAFF[index]
	_add_portrait(staff)
	_add_profile_header(staff)
	_add_about(staff.about)


func _add_portrait(staff: Dictionary) -> void:
	var portrait := TextureRect.new()
	portrait.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	portrait.texture = Art.region(
		PORTRAITS, Rect2(
			staff.portrait * PORTRAIT_CELL_SIZE, PORTRAIT_CELL_SIZE
		)
	)
	portrait.position = Vector2(26, 24)
	portrait.size = Vector2(172, 180)
	portrait.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	_profile.add_child(portrait)


func _add_profile_header(staff: Dictionary) -> void:
	var name_size := 36 if staff.name.length() > 15 else 48
	Art.label(
		_profile, staff.name, Rect2(224, 27, 360, 68), name_size
	)
	Art.label(_profile, staff.role, Rect2(224, 96, 360, 42), 28)
	var rule := ColorRect.new()
	rule.color = Color("b8a27a")
	rule.position = Vector2(224, 145)
	rule.size = Vector2(328, 2)
	_profile.add_child(rule)
	Art.icon(_profile, "available", Rect2(224, 164, 40, 40))
	Art.label(
		_profile, "Available", Rect2(274, 164, 275, 42),
		30, Color("52733a")
	)


func _add_about(text: String) -> void:
	Art.label(_profile, "About", Rect2(24, 222, 500, 42), 30)
	var about := Art.label(
		_profile, text, Rect2(24, 268, 535, 150), 28
	)
	about.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	about.size = Vector2(535, 150)


func _show_people() -> void:
	_search.clear()
	_search_people("")


func _search_people(query: String) -> void:
	_begin_results("Employees")
	var row := 0
	for index in STAFF.size():
		var staff: Dictionary = STAFF[index]
		var searchable: String = staff.name + " " + staff.role
		if not query.to_lower() in searchable.to_lower():
			continue
		Art.button(
			_results, staff.name, Rect2(20, 65 + row * 56, 556, 48),
			_show_profile.bind(index), "paper", 28
		)
		row += 1
	if row == 0:
		Art.label(
			_results, "No people found.", Rect2(24, 80, 540, 50)
		)


func _begin_results(title: String) -> void:
	_profile.visible = false
	_results.visible = true
	_clear(_results)
	Art.panel(_results, Rect2(0, 0, 596, 432), "paper")
	Art.label(_results, title, Rect2(24, 12, 545, 48), 32)


func _show_teams() -> void:
	_begin_results("Studio team")
	Art.label(
		_results, "6 people · Starter loft", Rect2(24, 80, 540, 48)
	)
	Art.button(
		_results, "View team members", Rect2(24, 146, 540, 56),
		_show_people, "paper"
	)


func _show_locations() -> void:
	_begin_results("Locations")
	Art.label(
		_results, "Starter loft\nAll 6 people work here.",
		Rect2(24, 80, 540, 120)
	)


func _show_favorites() -> void:
	_begin_results("Favorites")
	var selected_name: String = STAFF[_selected].name
	var is_favorite := _favorite_index == _selected
	var action := "Remove " if is_favorite else "Add "
	Art.label(
		_results, "Pin the selected person for this desk visit.",
		Rect2(24, 74, 550, 60), 24
	)
	Art.button(
		_results, action + selected_name, Rect2(24, 148, 548, 56),
		_toggle_favorite, "paper", 28
	)
	if _favorite_index >= 0:
		var favorite_name: String = STAFF[_favorite_index].name
		Art.button(
			_results, favorite_name, Rect2(24, 226, 548, 56),
			_show_profile.bind(_favorite_index), "selected", 28
		)


func _toggle_favorite() -> void:
	_favorite_index = -1 if _favorite_index == _selected else _selected
	_show_favorites()
