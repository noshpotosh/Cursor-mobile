// Named constants for the isometric starter loft renderer.

export const TILE_WIDTH_PX = 64;
export const TILE_HEIGHT_PX = 32;

export const CANVAS_WIDTH_PX = 960;
export const CANVAS_HEIGHT_PX = 640;

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
