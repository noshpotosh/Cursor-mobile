import {
  PLAYER_DESK_ID,
  SPAWN_SEARCH_OFFSETS,
} from "./constants.js";

function isBorderTile(gridX, gridY, gridWidth, gridHeight) {
  const onLeft = gridX === 0;
  const onRight = gridX === gridWidth - 1;
  const onTop = gridY === 0;
  const onBottom = gridY === gridHeight - 1;

  return onLeft || onRight || onTop || onBottom;
}

function cellKey(gridX, gridY) {
  return `${gridX},${gridY}`;
}

// Border wood reads as walls; furniture with blocksWalk is solid.
export function buildWalkMap(office) {
  const blocked = new Set();

  for (let gridY = 0; gridY < office.gridHeight; gridY += 1) {
    for (let gridX = 0; gridX < office.gridWidth; gridX += 1) {
      const onBorder = isBorderTile(
        gridX,
        gridY,
        office.gridWidth,
        office.gridHeight
      );

      if (onBorder) {
        blocked.add(cellKey(gridX, gridY));
      }
    }
  }

  for (const piece of office.furniture) {
    if (!piece.blocksWalk) {
      continue;
    }

    blocked.add(cellKey(piece.gridX, piece.gridY));
  }

  return {
    gridWidth: office.gridWidth,
    gridHeight: office.gridHeight,
    blocked,
  };
}

export function isWalkable(walkMap, gridX, gridY) {
  const outsideWidth =
    gridX < 0 || gridX >= walkMap.gridWidth;
  const outsideHeight =
    gridY < 0 || gridY >= walkMap.gridHeight;

  if (outsideWidth || outsideHeight) {
    return false;
  }

  return !walkMap.blocked.has(cellKey(gridX, gridY));
}

export function findPlayerDesk(office) {
  for (const piece of office.furniture) {
    if (piece.id === PLAYER_DESK_ID) {
      return piece;
    }
  }

  return null;
}

export function findSpawnNearPlayerDesk(office, walkMap) {
  const desk = findPlayerDesk(office);

  if (!desk) {
    return { gridX: 1, gridY: 1 };
  }

  for (const offset of SPAWN_SEARCH_OFFSETS) {
    const gridX = desk.gridX + offset.deltaX;
    const gridY = desk.gridY + offset.deltaY;

    if (isWalkable(walkMap, gridX, gridY)) {
      return { gridX, gridY };
    }
  }

  for (let gridY = 0; gridY < walkMap.gridHeight; gridY += 1) {
    for (let gridX = 0; gridX < walkMap.gridWidth; gridX += 1) {
      if (isWalkable(walkMap, gridX, gridY)) {
        return { gridX, gridY };
      }
    }
  }

  return {
    gridX: desk.gridX,
    gridY: desk.gridY,
  };
}
