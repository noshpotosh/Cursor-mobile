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

	var hud: Node = scene.get_node("DeskHud")
	if hud == null:
		push_error("SMOKE_FAIL: DeskHud missing")
		quit(1)
		return

	if not hud.has_method("show_desk"):
		push_error("SMOKE_FAIL: show_desk missing")
		quit(1)
		return

	if not hud.has_method("set_company_bucks"):
		push_error("SMOKE_FAIL: set_company_bucks missing")
		quit(1)
		return

	hud.call("set_company_bucks", 1280)
	hud.call("show_desk")
	await process_frame

	if not bool(hud.call("is_open")):
		push_error("SMOKE_FAIL: desk did not open")
		quit(1)
		return

	hud.call("hide_desk")
	await process_frame

	if bool(hud.call("is_open")):
		push_error("SMOKE_FAIL: desk did not close")
		quit(1)
		return

	print("SMOKE_OK")
	quit(0)
