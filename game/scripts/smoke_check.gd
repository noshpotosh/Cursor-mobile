extends SceneTree


func _init() -> void:
	call_deferred("_run")


func _run() -> void:
	var packed: PackedScene = load("res://scenes/main.tscn")
	if packed == null:
		push_error("SMOKE_FAIL: main.tscn missing")
		quit(1)
		return

	var scene: Node = packed.instantiate()
	root.add_child(scene)
	await process_frame
	await process_frame

	var world: Node = scene.get_node("World")
	if world == null:
		push_error("SMOKE_FAIL: World missing")
		quit(1)
		return

	if not world.has_signal("desk_used"):
		push_error("SMOKE_FAIL: desk_used missing")
		quit(1)
		return

	print("SMOKE_OK")
	quit(0)
