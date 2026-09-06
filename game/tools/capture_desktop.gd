extends SceneTree

const DESKTOP_SIZE := Vector2i(1280, 720)


func _init() -> void:
	call_deferred("_capture")


func _capture() -> void:
	var arguments := OS.get_cmdline_user_args()
	if arguments.size() != 1:
		push_error("Pass an output PNG path after --")
		quit(1)
		return
	var viewport := SubViewport.new()
	viewport.size = DESKTOP_SIZE
	viewport.render_target_update_mode = SubViewport.UPDATE_ALWAYS
	root.add_child(viewport)
	var scene: Node = load("res://scenes/main.tscn").instantiate()
	viewport.add_child(scene)
	await process_frame
	scene.get_node("DeskHud").show_desk()
	await process_frame
	await RenderingServer.frame_post_draw
	var result := viewport.get_texture().get_image().save_png(arguments[0])
	if result != OK:
		push_error("Could not save desktop capture")
		quit(1)
		return
	print("DESKTOP_CAPTURE_OK: " + arguments[0])
	quit()
