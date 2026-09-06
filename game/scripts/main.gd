extends Node2D

@onready var _world: Node2D = $World
@onready var _camera: Camera2D = $Camera2D
@onready var _hud: CanvasLayer = $DeskHud


func _ready() -> void:
	_world.desk_used.connect(_hud.show_desk)
	_camera.position = IsoMath.grid_to_screen(4, 3)
	_camera.make_current()


func _unhandled_input(event: InputEvent) -> void:
	if _hud.is_open():
		return

	if event is InputEventMouseButton:
		var mouse := event as InputEventMouseButton
		if (
			mouse.pressed
			and mouse.button_index == MOUSE_BUTTON_LEFT
		):
			_world.handle_pointer(get_global_mouse_position())
			get_viewport().set_input_as_handled()
		return

	if event is InputEventScreenTouch:
		var touch := event as InputEventScreenTouch
		if touch.pressed:
			var inverse := get_canvas_transform().affine_inverse()
			var world_point: Vector2 = inverse * touch.position
			_world.handle_pointer(world_point)
			get_viewport().set_input_as_handled()
