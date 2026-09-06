// Named constants for the isometric starter loft renderer.

export const TILE_WIDTH_PX = 64;
export const TILE_HEIGHT_PX = 32;

export const CANVAS_WIDTH_PX = 960;
export const CANVAS_HEIGHT_PX = 640;

// Kept as fallbacks; the shell now sizes to the viewport.

export const FloorTileKind = {
  CARPET: "carpet",
  WOOD: "wood",
};

export const FurnitureKind = {
  DESK: "desk",
  BUBBLER: "bubbler",
};

export const FloorFill = {
  [FloorTileKind.CARPET]: "#c9b8a6",
  [FloorTileKind.WOOD]: "#8b6914",
};

export const FurnitureFill = {
  [FurnitureKind.DESK]: "#c4a484",
  [FurnitureKind.BUBBLER]: "#6b8f71",
};

export const PLAYER_DESK_ACCENT = "#d97706";
export const INK = "#1a1714";
export const BONE = "#f4efe6";
export const CHAIR_FILL = "#7a5c45";
export const SCREEN_FILL = "#86efac";

export const PLAYER_STAFF_ID = "nosh";
export const PLAYER_DESK_ID = "desk-nosh";

// Click-to-walk feel: brisk office stride, not a sprint.
export const PLAYER_MOVE_TILES_PER_SECOND = 3.25;

export const PLAYER_JACKET_FILL = PLAYER_DESK_ACCENT;
export const PLAYER_SKIN_FILL = "#e8c4a8";
export const PLAYER_PANTS_FILL = "#3d4f5f";
export const PLAYER_HAIR_FILL = "#2c1810";
export const PLAYER_SHOE_FILL = "#1a1714";

export const PATH_TARGET_FILL = "rgba(217, 119, 6, 0.28)";
export const PATH_TARGET_STROKE = "#d97706";

export const CARDINAL_STEPS = [
  { deltaX: 1, deltaY: 0 },
  { deltaX: -1, deltaY: 0 },
  { deltaX: 0, deltaY: 1 },
  { deltaX: 0, deltaY: -1 },
];

// Prefer standing just south of Nosh's desk when the loft loads.
export const SPAWN_SEARCH_OFFSETS = [
  { deltaX: 0, deltaY: 1 },
  { deltaX: 1, deltaY: 0 },
  { deltaX: -1, deltaY: 0 },
  { deltaX: 0, deltaY: -1 },
  { deltaX: 1, deltaY: 1 },
  { deltaX: -1, deltaY: 1 },
  { deltaX: 1, deltaY: -1 },
  { deltaX: -1, deltaY: -1 },
];
