import { CARDINAL_STEPS } from "./constants.js";
import { isWalkable } from "./walkMap.js";

function cellKey(gridX, gridY) {
  return `${gridX},${gridY}`;
}

function rebuildPath(cameFrom, startKey, goalKey) {
  const path = [];
  let currentKey = goalKey;

  while (currentKey !== startKey) {
    const [gridXText, gridYText] = currentKey.split(",");
    path.push({
      gridX: Number(gridXText),
      gridY: Number(gridYText),
    });
    currentKey = cameFrom.get(currentKey);
  }

  path.reverse();
  return path;
}

function isInsideMap(walkMap, gridX, gridY) {
  const outsideWidth =
    gridX < 0 || gridX >= walkMap.gridWidth;
  const outsideHeight =
    gridY < 0 || gridY >= walkMap.gridHeight;

  return !outsideWidth && !outsideHeight;
}

// Cardinal BFS — short loft paths stay readable and cheap.
// Start may be a blocked desk seat (NPC standing up).
export function findPath(walkMap, startX, startY, goalX, goalY) {
  const startInside = isInsideMap(walkMap, startX, startY);
  const goalWalkable = isWalkable(walkMap, goalX, goalY);

  if (!startInside || !goalWalkable) {
    return [];
  }

  const startKey = cellKey(startX, startY);
  const goalKey = cellKey(goalX, goalY);

  if (startKey === goalKey) {
    return [];
  }

  const queue = [{ gridX: startX, gridY: startY }];
  const cameFrom = new Map();
  cameFrom.set(startKey, null);

  while (queue.length > 0) {
    const current = queue.shift();
    const currentKey = cellKey(current.gridX, current.gridY);

    if (currentKey === goalKey) {
      return rebuildPath(cameFrom, startKey, goalKey);
    }

    for (const step of CARDINAL_STEPS) {
      const nextX = current.gridX + step.deltaX;
      const nextY = current.gridY + step.deltaY;
      const nextKey = cellKey(nextX, nextY);

      if (cameFrom.has(nextKey)) {
        continue;
      }

      if (!isWalkable(walkMap, nextX, nextY)) {
        continue;
      }

      cameFrom.set(nextKey, currentKey);
      queue.push({ gridX: nextX, gridY: nextY });
    }
  }

  return [];
}
