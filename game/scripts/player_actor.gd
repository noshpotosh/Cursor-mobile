extends CharacterBody2D

signal arrived

const MOVE_SPEED := 120.0
const FRAMES := preload("res://assets/characters/nosh-frames.tres")

var grid_pos := Vector2i.ZERO
var body := AnimatedSprite2D.new()
var _path: Array[Vector2i] = []


func _ready() -> void:
	body.name = "Body"
	body.sprite_frames = FRAMES
	body.centered = false
	var foot_pivot: Vector2 = FRAMES.get_meta("foot_pivot")
	body.offset = -foot_pivot
	body.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	add_child(body)
	_idle()


func setup(start: Vector2i) -> void:
	grid_pos = start
	position = IsoMath.grid_to_screen(start.x, start.y)
	z_index = start.x + start.y


func walk_path(cells: Array[Vector2i]) -> void:
	_path = cells.duplicate()
	if _path.is_empty():
		_idle()


func is_walking() -> bool:
	return not _path.is_empty()


func _physics_process(delta: float) -> void:
	if _path.is_empty():
		return

	var next_cell: Vector2i = _path[0]
	var target := IsoMath.grid_to_screen(next_cell.x, next_cell.y)
	var step := MOVE_SPEED * delta
	_run_toward(target)

	if position.distance_to(target) <= step:
		position = target
		grid_pos = next_cell
		z_index = grid_pos.x + grid_pos.y
		_path.pop_front()
		if _path.is_empty():
			_idle()
			arrived.emit()
		return

	position = position.move_toward(target, step)


func _run_toward(target: Vector2) -> void:
	if not is_equal_approx(target.x, position.x):
		body.flip_h = target.x > position.x
	if body.animation != &"run":
		body.play(&"run")


func _idle() -> void:
	body.animation = &"idle"
	body.stop()
