extends SceneTree

const Player := preload("res://scripts/player_actor.gd")

var _arrivals := 0
var _failures: Array[String] = []


func _initialize() -> void:
	call_deferred("_run")


func _run() -> void:
	_check_sheet_padding()
	var player := Player.new()
	root.add_child(player)
	player.set_physics_process(false)
	player.setup(Vector2i.ZERO)
	player.arrived.connect(func(): _arrivals += 1)
	_check_idle(player)
	_check_run_and_arrival(player)
	_check_turn_and_cancel(player)
	player.queue_free()
	await process_frame
	if not _failures.is_empty():
		for failure in _failures:
			push_error("ANIMATION_FAIL: " + failure)
		quit(1)
		return
	print("ANIMATION_OK")
	quit()


func _check_idle(player: Player) -> void:
	var body: AnimatedSprite2D = player.body
	_check(body.animation == &"idle", "starts idle")
	_check(not body.is_playing(), "idle is stopped")
	var pivot: Vector2 = body.sprite_frames.get_meta("foot_pivot")
	_check(body.offset == -pivot, "foot pivot follows art metadata")
	_check(pivot == Vector2(24, 74), "exported foot pivot")
	_check(body.sprite_frames.get_frame_count("run") == 6, "six poses")


func _check_run_and_arrival(player: Player) -> void:
	var body: AnimatedSprite2D = player.body
	player.walk_path([Vector2i(1, 0), Vector2i(2, 0)])
	player._physics_process(0.1)
	_check(body.animation == &"run", "movement starts run")
	_check(body.flip_h, "rightward motion mirrors left-facing art")
	_check(is_equal_approx(player.position.length(), 12), "speed unchanged")
	body.set_frame_and_progress(3, 0.5)
	player._physics_process(1.0)
	_check(body.frame == 3, "tile arrival preserves animation frame")
	_check(is_equal_approx(body.frame_progress, 0.5), "preserves progress")
	_check(_arrivals == 0, "no arrival event between tiles")
	player._physics_process(1.0)
	_check(player.grid_pos == Vector2i(2, 0), "reaches final grid cell")
	_check(_arrivals == 1, "arrival event emitted once")
	_check(body.animation == &"idle", "arrival selects idle")
	_check(body.frame == 0 and not body.is_playing(), "arrival resets")
	player._physics_process(1.0)
	_check(_arrivals == 1, "idle does not repeat arrival")


func _check_turn_and_cancel(player: Player) -> void:
	var body: AnimatedSprite2D = player.body
	player.walk_path([Vector2i(1, 0)])
	player._physics_process(0.01)
	_check(not body.flip_h, "leftward motion uses authored facing")
	player.walk_path([])
	_check(body.animation == &"idle", "cancelled path becomes idle")
	_check(not player.is_walking(), "cancelled path stops walking")

func _check(passed: bool, description: String) -> void:
	if not passed:
		_failures.append(description)


func _check_sheet_padding() -> void:
	var path := ProjectSettings.globalize_path(
		"res://assets/characters/nosh-motion.png"
	)
	var sheet := Image.load_from_file(path)
	for index in 8:
		var frame := sheet.get_region(Rect2i(index * 48, 0, 48, 96))
		var bounds := frame.get_used_rect()
		var has_padding := (
			bounds.position.x > 0 and bounds.position.y > 0
			and bounds.end.x < 48 and bounds.end.y < 96
		)
		_check(has_padding, "transparent gutter on frame %d" % index)
