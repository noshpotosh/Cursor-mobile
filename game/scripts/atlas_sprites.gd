# Crops loft atlases using the web loft sprite sheet rects.
class_name AtlasSprites
extends RefCounted

const NOSH_CROP := Rect2(252, 3, 202, 493)
const DESK_CROP := Rect2(140, 167, 983, 934)
const CHAIR_CROP := Rect2(138, 570, 291, 415)

const NOSH_DRAW := Vector2(26, 60)
const DESK_DRAW := Vector2(98, 94)
const CHAIR_DRAW := Vector2(31, 43)


static func make_sprite(
	path: String,
	crop: Rect2,
	draw_size: Vector2
) -> Sprite2D:
	var texture := load(path) as Texture2D
	var atlas := AtlasTexture.new()
	atlas.atlas = texture
	atlas.region = crop

	var sprite := Sprite2D.new()
	sprite.texture = atlas
	sprite.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	sprite.centered = true
	sprite.scale = Vector2(
		draw_size.x / crop.size.x,
		draw_size.y / crop.size.y
	)
	return sprite
