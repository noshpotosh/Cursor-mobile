import { TILE_HEIGHT_PX, TILE_WIDTH_PX } from "./constants.js";

// Convert grid coords to canvas coords (2:1 isometric).
export function gridToScreen(gridX, gridY) {
  const screenX = (gridX - gridY) * (TILE_WIDTH_PX / 2);
  const screenY = (gridX + gridY) * (TILE_HEIGHT_PX / 2);

  return { screenX, screenY };
}

// Origin shift so the whole room sits centered on the canvas.
export function measureRoomBounds(gridWidth, gridHeight) {
  const corners = [
    gridToScreen(0, 0),
    gridToScreen(gridWidth, 0),
    gridToScreen(0, gridHeight),
    gridToScreen(gridWidth, gridHeight),
  ];

  let minX = corners[0].screenX;
  let maxX = corners[0].screenX;
  let minY = corners[0].screenY;
  let maxY = corners[0].screenY;

  for (const corner of corners) {
    if (corner.screenX < minX) {
      minX = corner.screenX;
    }

    if (corner.screenX > maxX) {
      maxX = corner.screenX;
    }

    if (corner.screenY < minY) {
      minY = corner.screenY;
    }

    if (corner.screenY > maxY) {
      maxY = corner.screenY;
    }
  }

  return {
    minX,
    maxX,
    minY,
    maxY,
    width: maxX - minX + TILE_WIDTH_PX,
    height: maxY - minY + TILE_HEIGHT_PX,
  };
}

export function buildRoomOrigin(
  gridWidth,
  gridHeight,
  canvasWidth,
  canvasHeight
) {
  const bounds = measureRoomBounds(gridWidth, gridHeight);

  const originX =
    (canvasWidth - bounds.width) / 2 - bounds.minX;
  const originY =
    (canvasHeight - bounds.height) / 2 - bounds.minY;

  return { originX, originY };
}
