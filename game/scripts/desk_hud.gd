extends CanvasLayer

@onready var _panel: PanelContainer = $Panel
@onready var _title: Label = $Panel/Margin/Column/Title
@onready var _body: Label = $Panel/Margin/Column/Body
@onready var _close: Button = $Panel/Margin/Column/Close


func _ready() -> void:
	_panel.visible = false
	_close.pressed.connect(hide_desk)
	_title.text = "Desk"
	_body.text = (
		"Stub desk panel for P1. "
		+ "Full deskOS comes later."
	)


func show_desk() -> void:
	_panel.visible = true


func hide_desk() -> void:
	_panel.visible = false


func is_open() -> bool:
	return _panel.visible
