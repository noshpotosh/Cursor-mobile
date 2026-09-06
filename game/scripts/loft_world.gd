extends Node2D

signal desk_used

const PlayerScript = preload("res://scripts/player_actor.gd")

const LOFT_DATA := "res://data/starter_loft.json"
const FLOOR_CARPET := "res://assets/tiles/floor-carpet.png"
const FLOOR_WOOD := "res://assets/tiles/floor-wood-border.png"

const DESK_TEXTURE := "res://assets/furniture/desk-with-monitor.png"
const CHAIR_TEXTURE := "res://assets/furniture/chair-basic.png"
const BUBBLER_TEXTURE := "res://assets/furniture/bubbler.png"
const COFFEE_TEXTURE := "res://assets/furniture/coffee-station.png"
const WHITEBOARD_TEXTURE := "res://assets/furniture/whiteboard.png"

## Lift so sprite feet sit on the isometric diamond center (128 world).
const DESK_LIFT_PX := 32
const CHAIR_LIFT_PX := 24
const BUBBLER_LIFT_PX := 56
const COFFEE_LIFT_PX := 32
const WHITEBOARD_LIFT_PX := 40

var grid_width := 10
var grid_height := 8
var player_start := Vector2i(5, 4)
var desk_cell := Vector2i(8, 6)

var _blocked := {}
var _furniture_pieces: Array = []
var _astar := AStarGrid2D.new()
var _player = null
var _pending_desk := false

@onready var _floor: Node2D = $Floor
@onready var _furniture: Node2D = $Furniture
@onready var _actors: Node2D = $Actors


func _ready() -> void:
	y_sort_enabled = true
	_floor.y_sort_enabled = true
	_furniture.y_sort_enabled = true
	_actors.y_sort_enabled = true
	_load_loft()
	_build_floor()
	_build_pathfinding()
	_spawn_furniture()
	_spawn_player()


func handle_pointer(world_point: Vector2) -> void:
	if _player == null:
		return
	if _player.is_walking():
		return

	var local := to_local(world_point)
	var cell := IsoMath.screen_to_grid(local)
	if not _in_bounds(cell):
		return

	if cell == desk_cell or _is_beside_desk(cell):
		_go_use_desk()
		return

	if _blocked.has(cell):
		return

	_pending_desk = false
	_walk_to(cell)


func _go_use_desk() -> void:
	var stand := _desk_stand_cell()
	if stand == _player.grid_pos:
		desk_used.emit()
		return

	_pending_desk = true
	_walk_to(stand)


func _walk_to(goal: Vector2i) -> void:
	var start: Vector2i = _player.grid_pos
	if start == goal:
		return
	if not _astar.is_in_boundsv(goal):
		return
	if _astar.is_point_solid(goal):
		return

	var id_path := _astar.get_id_path(start, goal)
	if id_path.is_empty():
		return

	var cells: Array[Vector2i] = []
	for id in id_path:
		var cell: Vector2i = id
		if cell == start:
			continue
		cells.append(cell)

	_player.walk_path(cells)


func _on_player_arrived() -> void:
	if not _pending_desk:
		return
	_pending_desk = false
	if _is_beside_desk(_player.grid_pos):
		desk_used.emit()


func _load_loft() -> void:
	var file := FileAccess.open(LOFT_DATA, FileAccess.READ)
	if file == null:
		push_error("Missing loft data: %s" % LOFT_DATA)
		return

	var parsed: Variant = JSON.parse_string(file.get_as_text())
	if typeof(parsed) != TYPE_DICTIONARY:
		push_error("Invalid loft data: %s" % LOFT_DATA)
		return

	var data: Dictionary = parsed
	grid_width = int(data["gridWidth"])
	grid_height = int(data["gridHeight"])
	var start_data: Dictionary = data["playerStart"]
	player_start = Vector2i(
		int(start_data["gridX"]),
		int(start_data["gridY"])
	)

	_blocked.clear()
	_furniture_pieces.clear()
	for piece in data["furniture"]:
		var cell := Vector2i(
			int(piece["gridX"]),
			int(piece["gridY"])
		)
		if piece.get("blocksWalk", false):
			_blocked[cell] = true
		if piece.get("isPlayerDesk", false):
			desk_cell = cell
		_furniture_pieces.append(piece)


func _build_floor() -> void:
	var carpet := load(FLOOR_CARPET) as Texture2D
	var wood := load(FLOOR_WOOD) as Texture2D

	for y in grid_height:
		for x in grid_width:
			var on_edge := (
				x == 0
				or y == 0
				or x == grid_width - 1
				or y == grid_height - 1
			)
			var sprite := Sprite2D.new()
			sprite.texture = wood if on_edge else carpet
			sprite.texture_filter = (
				CanvasItem.TEXTURE_FILTER_NEAREST
			)
			sprite.centered = true
			sprite.position = IsoMath.grid_to_screen(x, y)
			sprite.z_index = x + y - 1000
			_floor.add_child(sprite)


func _build_pathfinding() -> void:
	_astar.region = Rect2i(0, 0, grid_width, grid_height)
	_astar.cell_size = Vector2(1, 1)
	_astar.diagonal_mode = AStarGrid2D.DIAGONAL_MODE_NEVER
	_astar.update()

	for cell in _blocked.keys():
		_astar.set_point_solid(cell, true)


func _spawn_furniture() -> void:
	for piece in _furniture_pieces:
		var kind := String(piece.get("kind", ""))
		var texture_path := _texture_for_kind(kind)
		if texture_path.is_empty():
			continue
		if not ResourceLoader.exists(texture_path):
			push_warning("Missing furniture art: %s" % texture_path)
			continue

		var cell := Vector2i(
			int(piece["gridX"]),
			int(piece["gridY"])
		)
		var sprite := _make_prop_sprite(texture_path)
		sprite.position = IsoMath.grid_to_screen(cell.x, cell.y)
		sprite.position.y -= _lift_for_kind(kind)
		sprite.z_index = cell.x + cell.y
		_furniture.add_child(sprite)


func _texture_for_kind(kind: String) -> String:
	match kind:
		"desk":
			return DESK_TEXTURE
		"chair":
			return CHAIR_TEXTURE
		"bubbler":
			return BUBBLER_TEXTURE
		"coffee":
			return COFFEE_TEXTURE
		"whiteboard":
			return WHITEBOARD_TEXTURE
		_:
			return ""


func _lift_for_kind(kind: String) -> int:
	match kind:
		"desk":
			return DESK_LIFT_PX
		"chair":
			return CHAIR_LIFT_PX
		"bubbler":
			return BUBBLER_LIFT_PX
		"coffee":
			return COFFEE_LIFT_PX
		"whiteboard":
			return WHITEBOARD_LIFT_PX
		_:
			return 0


func _make_prop_sprite(path: String) -> Sprite2D:
	var sprite := Sprite2D.new()
	sprite.texture = load(path) as Texture2D
	sprite.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	sprite.centered = true
	return sprite


func _spawn_player() -> void:
	_player = PlayerScript.new()
	_actors.add_child(_player)
	_player.setup(player_start)
	_player.arrived.connect(_on_player_arrived)


func _desk_stand_cell() -> Vector2i:
	var candidates: Array[Vector2i] = [
		Vector2i(desk_cell.x - 1, desk_cell.y),
		Vector2i(desk_cell.x - 1, desk_cell.y - 1),
		Vector2i(desk_cell.x, desk_cell.y + 1),
		Vector2i(desk_cell.x - 1, desk_cell.y + 1),
	]
	for cell in candidates:
		if not _in_bounds(cell):
			continue
		if _blocked.has(cell):
			continue
		return cell
	return player_start


func _is_beside_desk(cell: Vector2i) -> bool:
	return (
		absi(cell.x - desk_cell.x) <= 1
		and absi(cell.y - desk_cell.y) <= 1
		and cell != desk_cell
	)


func _in_bounds(cell: Vector2i) -> bool:
	return (
		cell.x >= 0
		and cell.y >= 0
		and cell.x < grid_width
		and cell.y < grid_height
	)
