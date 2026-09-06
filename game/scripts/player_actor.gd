extends CharacterBody2D

signal arrived

const MOVE_SPEED := 120.0

var grid_pos := Vector2i.ZERO
var _path: Array[Vector2i] = []


func setup(start: Vector2i) -> void:
	grid_pos = start
	position = IsoMath.grid_to_screen(start.x, start.y)
	z_index = start.x + start.y


func walk_path(cells: Array[Vector2i]) -> void:
	_path = cells.duplicate()


func is_walking() -> bool:
	return not _path.is_empty()


func _physics_process(delta: float) -> void:
	if _path.is_empty():
		return

	var next_cell: Vector2i = _path[0]
	var target := IsoMath.grid_to_screen(next_cell.x, next_cell.y)
	var step := MOVE_SPEED * delta

	if position.distance_to(target) <= step:
		position = target
		grid_pos = next_cell
		z_index = grid_pos.x + grid_pos.y
		_path.pop_front()
		if _path.is_empty():
			arrived.emit()
		return

	position = position.move_toward(target, step)
